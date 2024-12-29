from typing import Annotated, Optional , List 
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, FastAPI, HTTPException , Request 
from sqlmodel import Field, Session, SQLModel, create_engine, select , Relationship
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles



# Database Models
class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True  ,  unique=True) 
    age: int | None = Field(default=None)
    is_admin: bool = Field(default=False)
    votes: List["Vote"] = Relationship(back_populates="user")


    
# Pydantic Models for Validation and Response
class UserCreate(SQLModel):
    username: str
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

def create_event_in_db (session: Session , new_event: creatEvent)-> Event :
    #id = session.exec(select(Event).where(Event.id == new_event.id)).first()
    #if id:
    #    raise HTTPException(status_code=404, detail="Event already exists")
    #max_id =session.exec(select(Event.id).order_by(Event.id.desc())).first() or 0
    #new_id = max_id + 1    
    #new_event.id = new_id
    
    event = session.exec(select(Event).where(Event.name == new_event.name)).first() 
    if event:
        raise HTTPException(status_code=404, detail="Event already exists")
    
    max_id =session.exec(select(Event.id).order_by(Event.id.desc())).first() or 0
    new_id = max_id + 1
    
    
    new_event = Event(id = new_id , name= new_event.name)    
    session.add(new_event)
    session.commit()
    session.refresh(new_event)
    return new_event
        
def vote_to_event (session : Session , event_id: int , user_id: int):
    event = session.get (Event, event_id)
    user = session.get (User, user_id)
    print(event_id)
    print(user_id)
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if not user :
        raise HTTPException(status_code=404, detail="User not found")
    
    already_vote = session.exec(
        select(Vote).where(Vote.event_id == event.id , Vote.user_id ==user_id)).first()
    
    
    
    if already_vote:
        raise HTTPException(status_code=404, detail="User already voted")
    
    points = 5 if user.is_admin else 1
    
    new_vote = Vote(event_id=event.id, user_id=user_id, points=points)
    
    event.total_points += points
    
    session.add(new_vote)
    session.commit()
    session.refresh(event)
    return {"message": "Vote added successfully", "total_points": event.total_points}



def chek_admin(session: Session, username: str) -> bool:
    is_admin = session.exec(select(User.is_admin).where(User.username == username)).first()
    if is_admin is None:
        raise HTTPException(status_code=404, detail="admin not found")
    return is_admin


    
    
    
    
    
        


   



# FastAPI Application
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()  # Initialize database on startup
    yield
    print("Application is shutting down...")


app = FastAPI(lifespan=lifespan)

# Serve static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Configure templates
templates = Jinja2Templates(directory="app/templates")





origins = [
    "http://localhost:5173",
]



#Allow all origins or specify the frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origins],  # Allow all origins or specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)



# Route Handlers
@app.post("/users/" , response_model=UserOut)
def add_user(user: UserCreate, session: SessionDep ):
    new_user = create_user_in_db(session, user)
    return new_user


@app.get("/user/", response_model=list[UserOut])
def read_users(session: SessionDep):
    users = session.exec(select(User)).all()
    return users




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
    
    
    votes = session.exec(select(Vote).where(Vote.user_id == user_id)).all()
    if votes:
        for vote in votes:
            session.delete(vote)
    session.delete(user)
    session.commit()
    return {"ok": True}


@app.post("/events/")
def create_event( session: SessionDep  , new_event :creatEvent):
    new_event = create_event_in_db (session , new_event)
    return new_event

@app.post("/events/{event_id}/vote")
def vote( session: SessionDep, event_id : int , user_id: int ):
    new_vote =vote_to_event(session,  event_id,  user_id)
    return new_vote

@app.delete("/events/{event_id}")
def event(event_id: int, session: SessionDep):
    
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    votes = session.exec(select(Vote).where(Vote.event_id == event.id)).all()
    if votes:
        for vote in votes:
            session.delete(vote)
            
    print(vote)
    session.delete(event)
    session.commit()
    return {"ok": True}



@app.post("/log_in")
def log_in( session: SessionDep,  username : str):
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    is_admin = chek_admin( session , username)
    return {"is_admin": is_admin}



