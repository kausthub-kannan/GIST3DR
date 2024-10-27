import os
import urllib

from sqlmodel import SQLModel, create_engine


class DBConfig:
    def __init__(self):
        host = os.getenv("HOST")
        database = os.getenv("DATABASE")
        username = os.getenv("USERNAME")
        password = os.getenv("PASSWORD")
        driver = os.getenv("DRIVER")
        port = os.getenv("PORT")

        self.params = urllib.parse.quote_plus(
            f"DRIVER={driver};"
            f"SERVER=tcp:{host},{port};"
            f"DATABASE={database};"
            f"UID={username};"
            f"PWD={password};"
            f"Encrypt=yes;"
            f"TrustServerCertificate=no;"
            f"Connection Timeout=30;"
        )

    def connect_to_database(self):
        try:
            engine = create_engine(self.params)
            SQLModel.metadata.create_all(engine)
            return engine
        except Exception as e:
            raise e
