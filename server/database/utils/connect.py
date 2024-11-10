import os
from supabase import Client, create_client
from sqlmodel import SQLModel, create_engine, Session


class DBConfig:
    def __init__(self):
        host = os.getenv("HOST")
        database = os.getenv("DATABASE")
        username = "postgres.uigtqwlbgrhtjxohmrqo"
        password = os.getenv("PASSWORD")
        port = os.getenv("PORT")
        self.params = (
            f"postgresql+psycopg2://{username}:{password}@{host}:{port}/{database}"
        )

    def connect_to_database(self):
        try:
            engine = create_engine(self.params)
            SQLModel.metadata.create_all(engine)
            return engine
        except Exception as e:
            raise e

    def connect_to_storage(self):
        try:
            supabase: Client = create_client(
                os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY")
            )
            return supabase
        except Exception as e:
            raise e


def get_session(engine):
    with Session(engine) as session:
        yield session
