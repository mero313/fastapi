from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional
from config import  *
from fastapi.security import OAuth2PasswordRequestForm , OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status 
from db import *

from jwt import PyJWTError


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# step 1 password hash
def get_password_hash(password):
    return pwd_context.hash(password)


# step 2 password verify
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)



def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
    
async def authenticate_user(session: Session, Userlogin: Userlogin):
    user = session.exec(select(User).where(User.username ==  Userlogin.username)).first()
    if not user:
        return None
    if not verify_password(Userlogin.password, user.hashed_password):
        return None
    return user

def verify_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


# def get_current_user(token: str = Depends(oauth2_scheme)):
#     try:
#         payload = verify_token(token)
#         return payload  # Typically, you'd fetch user from DB here
#     except:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid token",
#             headers={"WWW-Authenticate": "Bearer"},
#         )

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    try:
        payload = verify_token(token)
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = session.exec(select(User).where(User.username == username)).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except:
        raise HTTPException(status_code=401, detail="Could not validate credentials")