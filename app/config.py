import os

SECRET_KEY = os.environ.get("SECRET_KEY", "default_secret_key")  # Use a strong secret key
ALGORITHM = "HS256"             # Algorithm for JWT
ACCESS_TOKEN_EXPIRE_MINUTES = 5  # Token validity time
