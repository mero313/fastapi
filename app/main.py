from typing import Annotated, Optional
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException
from sqlmodel import Field, Session, SQLModel, create_engine, select


# Database Models
class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    age: int | None = Field(default=None)
    is_admin: bool = Field(default=False)


# Pydantic Models for Validation and Response
class UserCreate(SQLModel):
    username: str
    is_admin: Optional[bool] = False


class UserOut(SQLModel):
    username: str
    is_admin: bool


# Database Configuration
db_file = "database.db"
sqlite_url = f"sqlite:///{db_file}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


# Helper Function to Create User
def create_user_in_db(session: Session, user_data: UserCreate) -> User:
    # Check if the username already exists
    user = session.exec(select(User).where(User.username == user_data.username)).first()
    if user:
        raise HTTPException(status_code=404, detail="Username already exists")

    # Create a new user
    new_user = User(username=user_data.username, is_admin=user_data.is_admin)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user


SessionDep = Annotated[Session, Depends(get_session)]


# FastAPI Application
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()  # Initialize database on startup
    yield
    print("Application is shutting down...")


app = FastAPI(lifespan=lifespan)


# Route Handlers
@app.post("/users/", response_model=UserOut)
def add_user(user: UserCreate, session: SessionDep):
    new_user = create_user_in_db(session, user)
    return new_user


@app.get("/user/", response_model=list[UserOut])
def read_users(session: SessionDep):
    users = session.exec(select(User)).all()
    return users


@app.post("/users2/")
def create_user_with_id(user: User, session: SessionDep) -> User:
    existing_user = session.exec(select(User).where(User.id == user.id)).first()
    if existing_user:
        max_id = session.exec(select(User.id).order_by(User.id.desc())).first() or 0
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
def delete_user(user_id: int, session: SessionDep):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    session.delete(user)
    session.commit()
    return {"ok": True}
