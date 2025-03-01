from typing import Annotated, Optional , List 
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, FastAPI, HTTPException , Request 
from sqlmodel import Field, Session, SQLModel, create_engine, select , Relationship
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from auth import *
from db import *
from config import *
from fun import *


SessionDep = Annotated[Session, Depends(get_session)]
# FastAPI Application
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()  # Initialize database on startup
    yield
    print("Application is shutting down...")


app = FastAPI(lifespan=lifespan)



origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

#Allow all origins or specify the frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow all origins or specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


@app.get("/users", response_model=list[UserOut])
async def read_users(session: SessionDep, current_user: User = Depends(get_current_user)):
    # if not current_user.is_admin:
    #     raise HTTPException(status_code=403, detail="Access denied")
    users = session.exec(select(User)).all()
    return users


# Route Handlers
@app.post("/user" , response_model=UserOut)
async def add_user(user: UserCreate, session: SessionDep ):
    new_user = create_user_in_db(session, user)
    return new_user




@app.delete("/users/{username}")
async def delete_user( session: SessionDep,  username : str , current_user: User = Depends(get_current_user)):
    if current_user.username == username:
        raise HTTPException(status_code=400, detail="You cannot delete your own account")
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    votes = session.exec(select(Vote).where(Vote.user_id == user.id)).all()
    
    for vote in votes:
        session.delete(vote)
            
    session.delete(user)
    session.commit()
    return {"ok": True}




@app.get("/events")
async def get_events(session: SessionDep):
    events = session.exec(select(Event)).all()
    return events



@app.post("/event/")
async def create_event( session: SessionDep  , new_event :creatEvent):
    new_event = create_event_in_db (session , new_event)
    return new_event



@app.post("/events/{event_id}/vote")
async def vote( session: SessionDep, event_id : int , user_id: int ):
    new_vote =vote_to_event(session,  event_id,  user_id)
    return new_vote

@app.delete("/events/{event_id}")
async def event(event_id: int, session: SessionDep):
    
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    votes = session.exec(select(Vote).where(Vote.event_id == event.id)).all()
    if votes:
        for vote in votes:
            session.delete(vote)
            
    
    session.delete(event)
    session.commit()
    return {"ok": True}



@app.post("/log_in")
async def log_in( session: SessionDep, Userlogin: Userlogin  ):
    user = session.exec(select(User).where(User.username == Userlogin.username)).first()
    if not user :
        raise HTTPException(status_code=401, detail="Invalid username")
    
    if not verify_password(Userlogin.password ,  user.hashed_password   ):
        raise HTTPException( status_code=401 , detail="pass error"  )         
    
    userid =user.id
    print(userid)
    user_events = session.exec(
        select(Event.name)
        .join(Vote, Event.id == Vote.event_id)  # Join Event with Vote
        .where(Vote.user_id == userid)         # Filter by the user's ID
    ).all()
    print(user_events)
    is_admin = chek_admin( session , Userlogin.username)
    
    access_token = create_access_token({"sub": user.username})  # Store username in token
    return {"ok": True,"is_admin": is_admin , "user_id": userid  , "user_events" : user_events  , "access_token": access_token, "token_type": "bearer"}

@app.get("/log_out")
async def log_out():
    return {"ok": True}


@app.put("/update")
async def update( session: SessionDep,  username : str,  new_username : str):
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.username = new_username
    session.commit()
    return {"ok": True}


 
@app.get("/if_admin/{user_id}")
async def if_admin( session: SessionDep, user_id: int):
    user = session.exec(select(User).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    is_admin = chek_admin( session , user.username)
    return {"ok": True, "is_admin": is_admin}



@app.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_session)
):
    user = await authenticate_user(db, form_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user