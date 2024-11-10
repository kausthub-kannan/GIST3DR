import os

import modal
from modal import Image, Mount, Secret, asgi_app
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from routes import patients, auth
from utils.modal_setup import create_image

app = modal.App("gist3dr-api")
image = create_image()


def create_app():
    web_app = FastAPI(
        title="GIST3DR API",
        description="Dental data analytics and implant generation",
        version="0.5.0",
    )

    web_app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    web_app.include_router(auth.router)
    web_app.include_router(patients.router)

    @web_app.get("/", response_class=JSONResponse)
    async def read_root():
        return {"status": "Healthy"}

    return web_app


@app.function(
    image=image,
    mounts=[Mount.from_local_dir(".", remote_path="/root/web_app")]
)
@asgi_app()
def fastapi_app():
    return create_app()