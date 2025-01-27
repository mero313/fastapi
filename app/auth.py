from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional
from config import  *
from fastapi.security import OAuth2PasswordRequestForm , OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status 
from db import *


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
    
async def authenticate_user(username: str, password: str):
    # Check if user exists in the database
    user = UserCreate if UserCreate[username] == username else None
    if not user:
        return None  # User not found
    # Verify the password
    if not verify_password(password, User["hashed_password"]):
        return None  # Password is incorrect
    return user  # Authentication successful

def verify_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = verify_token(token)
        return payload  # Typically, you'd fetch user from DB here
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )