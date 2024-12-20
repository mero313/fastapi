from fastapi import FastAPI, HTTPException, Depends
from sqlmodel import SQLModel, Field, Session, select, create_engine
from typing import Optional
from contextlib import asynccontextmanager



db_file = "database.db"
sqlite_url = f"sqlite:///{db_file}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
        
app = FastAPI()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # الكود الذي يتم تشغيله عند بدء التطبيق
    create_db()
    yield  # هنا يبدأ التطبيق في استقبال الطلبات
    # الكود الذي يتم تشغيله عند إيقاف التطبيق (إذا كنت بحاجة إلى أي تنظيف)
    print("Application is shutting down...")
    

    
# SQLAlchemy Model for User
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)  # use 'username' here
    age: Optional[int] = Field(default=None)
    is_admin: bool = Field(default=False)

# Pydantic Model for User Creation (input)
class UserCreate(SQLModel):
    username: str
    is_admin: Optional[bool] = False

# Pydantic Model for User Output (response)
class UserOut(SQLModel):
    username: str
    is_admin: bool

# Database setup (SQLite in-memory for demonstration)
sqlite_url = "sqlite:///./database.db"
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

# Dependency to get the session
def get_session():
    with Session(engine) as session:
        yield session

# Create user function
def create_user(session: Session, user_data: UserCreate):
    # Check if the username already exists
    user = session.exec(select(User).where(User.username == user_data.username)).first()
    if user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Create a new user
    new_user = User(username=user_data.username, is_admin=user_data.is_admin)
    
    # Add the new user to the database
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    return new_user

# Route to add a new user
@app.post("/users/", response_model=UserOut)
def add_user(user: UserCreate, session: Session = Depends(get_session)):
    new_user = create_user(session, user)
    return new_user
