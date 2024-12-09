from typing import Annotated
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True )
    name: str = Field(index=True)
    age: int | None = Field(default=None)
    is_admin : bool  = Field(default=False)
    


db_file = "database.db"
sqlite_url = f"sqlite:///{db_file}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session



SessionDep = Annotated[Session , Depends(get_session)]



app = FastAPI()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # الكود الذي يتم تشغيله عند بدء التطبيق
    create_db()
    yield  # هنا يبدأ التطبيق في استقبال الطلبات
    # الكود الذي يتم تشغيله عند إيقاف التطبيق (إذا كنت بحاجة إلى أي تنظيف)
    print("Application is shutting down...")
    
app = FastAPI(lifespan=lifespan)

@app.get("/users/")
def read_heroes(
    session: SessionDep,
    
) -> list[User]:
    users = session.exec(select(User))
    return users




@app.post("/users/")
def create_user(user: User, session: SessionDep) -> User:
    id= session.exec(select(User).where(User.id == user.id)).first()
    if id:
        max_id =  session.exec(select(User.id).order_by(User.id.desc())).first() or 0
        user.id = max_id + 1
    session.add(user) 
    session.commit()
    session.refresh(user)
    return user


@app.get("/users/{user_id}")
def read_user(user_id: int, session: SessionDep) -> User:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.delete("/users/{user_id}")
def delete_hero(user_id: int, session: SessionDep):
    user = session.get(User , user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()
    return {"ok": True}