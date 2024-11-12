from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import Session

from database.schemas.tables import User
from database.utils.connect import DBConfig
from utils.schema import AuthResponse, UserSignUp, UserSignIn
from utils.setup import setup_logger

load_dotenv()


def get_session():
    with Session(engine) as session:
        yield session


db_config = DBConfig()
engine = db_config.connect_to_database()
supabase = db_config.connect_to_storage()
logger = setup_logger("auth", "logs/auth.log")

router = APIRouter(
    prefix="/auth",
    tags=["authentication"],
    responses={
        400: {"description": "Bad Request"},
        401: {"description": "Unauthorized"},
        500: {"description": "Internal Server Error"},
    },
)


@router.post("/signup", response_model=AuthResponse)
async def signup(user_data: UserSignUp, session: Session = Depends(get_session)):
    try:
        auth_response = supabase.auth.sign_up(
            {
                "email": user_data.email,
                "password": user_data.password,
                "options": {
                    "data": {
                        "first_name": user_data.first_name,
                        "last_name": user_data.last_name,
                    }
                },
            }
        )

        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to create user"
            )

        auth_session = auth_response.session
        user = auth_response.user

        new_user = User(
            id=user.id,
            email=user_data.email,
            grade=user_data.grade,
            name=f"{user_data.first_name} {user_data.last_name}",
        )

        session.add(new_user)
        session.commit()

        logger.info(f"User {new_user.id} created")

        return AuthResponse(
            access_token=auth_session.access_token,
            token_type="bearer",
            user={
                "id": user.id,
                "email": user.email,
                "first_name": user.user_metadata.get("first_name"),
                "last_name": user.user_metadata.get("last_name"),
                "email_confirmed": user.email_confirmed_at is not None,
            },
        )

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/signin", response_model=AuthResponse)
async def signin(credentials: UserSignIn):
    try:
        auth_response = supabase.auth.sign_in_with_password(
            {"email": credentials.email, "password": credentials.password}
        )

        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
            )

        session = auth_response.session
        user = auth_response.user

        logger.info(f"User {user.id} signed in")

        return AuthResponse(
            access_token=session.access_token,
            token_type="bearer",
            user={
                "id": user.id,
                "email": user.email,
                "first_name": user.user_metadata.get("first_name"),
                "last_name": user.user_metadata.get("last_name"),
                "email_confirmed": user.email_confirmed_at is not None,
            },
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )


@router.post("/signout")
async def signout():
    try:
        supabase.auth.sign_out()
        logger.info("User signed out")
        return {"message": "Successfully signed out"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.post("/refresh-token")
async def refresh_token(refresh_token: str):
    try:
        response = supabase.auth.refresh_session(refresh_token)
        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "expires_at": response.session.expires_at,
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        )
