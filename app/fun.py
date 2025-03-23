from db import *
from auth import *
from fastapi import Depends, HTTPException, status 


# Helper Function to Create User
def create_user_in_db(session: Session, user_data: UserCreate) -> User:
    # Check if the username already exists
    user = session.exec(select(User).where(User.username == user_data.username)).first()
    if user:
        raise HTTPException(status_code=404, detail="Username already exists")
    hashed_password = get_password_hash(user_data.password)
    # Create a new user
    new_user = User(username=user_data.username, is_admin=user_data.is_admin , hashed_password=hashed_password)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user


# create event in db
def create_event_in_db (session: Session , new_event: creatEvent)-> Event :
    event = session.exec(select(Event).where(Event.name == new_event.name)).first() 
    if event:
        raise HTTPException(status_code=404, detail="Event already exists")
    # max_id =session.exec(select(Event.id).order_by(Event.id.desc())).first() or 0
    # new_id = max_id + 1
    new_event = Event(name= new_event.name)    
    session.add(new_event)
    session.commit()
    session.refresh(new_event)
    return new_event

# create vote in db
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


# check admin 
def chek_admin(session: Session, username: str) -> bool:
    is_admin = session.exec(select(User.is_admin).where(User.username == username)).first()
    if is_admin is None:
        raise HTTPException(status_code=404, detail="admin not found")
    return is_admin

def get_user_events (session: Session, username: str):
    user_id = session.exec(select(User.id).where(User.username == username)).first()
    user_events = session.exec(
        select(Event.name)
        .join(Vote, Event.id == Vote.event_id)  # Join Event with Vote
        .where(Vote.user_id == user_id)         # Filter by the user's ID
    ).all()
    if not user_events:
        raise HTTPException(status_code=404, detail="User has no events")
    return user_events
