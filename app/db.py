from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel, Field ,  Relationship , select , Session
from typing import List, Optional 
class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True  ,  unique=True) 
    age: int | None = Field(default=None)
    is_admin: bool = Field(default=False)
    votes: List["Vote"] = Relationship(back_populates="user")
    hashed_password : str 


    
# Pydantic Models for Validation and Response
class UserCreate(SQLModel):
    username: str
    password : str
    is_admin: Optional[bool] = False


class UserOut(SQLModel):
    username: str
    is_admin: bool

class Event (SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    total_points: int | None = Field(default=0)
    votes: List["Vote"] = Relationship(back_populates="event")
    
    
class creatEvent (SQLModel):
    name: str

class Vote(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    event_id: int = Field(foreign_key="event.id")
    points: int = Field(default=1)  # عدد النقاط الممنوحة
    user: User = Relationship(back_populates="votes")
    event: Event = Relationship(back_populates="votes")



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

