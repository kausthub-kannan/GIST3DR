from typing import Annotated

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session

from database.schemas.tables import User
from database.utils.connect import DBConfig
from utils.setup import setup_logger

load_dotenv()

db_config = DBConfig()
engine = db_config.connect_to_database()
supabase = db_config.connect_to_storage()
logger = setup_logger("patients", "logs/patients.log")


def get_session():
    with Session(engine) as session:
        yield session


router = APIRouter(
    prefix="/user", tags=["user"], responses={404: {"description": "Not found"}}
)


async def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
):
    try:
        user = supabase.auth.get_user(credentials.credentials)
        return user
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


SessionDep = Annotated[Session, Depends(get_session)]
AuthDep = Annotated[dict, Depends(verify_token)]


@router.get("/")
async def get_user_details(auth: AuthDep, session: SessionDep) -> User:
    try:
        user = session.get(User, auth.user.id)
        return user

    except Exception as e:
        logger.error(f"Error fetching user details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch user details",
        )
