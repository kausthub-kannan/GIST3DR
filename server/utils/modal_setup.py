from modal import Image


def create_image():
    image = Image.debian_slim()
    image = image.apt_install(
        "libgl1-mesa-glx",
        "libglib2.0-0",
        "libpq-dev",
    )

    packages = [
        "fastapi==0.115.3",
        "sqlmodel==0.0.22",
        "pandas==2.2.3",
        "numpy==2.0.1",
        "uvicorn==0.32.0",
        "python-dotenv==1.0.1",
        "pydicom==3.0.1",
        "simpleitk==2.4.0",
        "opencv-python==4.10.0.84",
        "scikit-image==0.24.0",
        "modal==0.65.19",
        "huggingface-hub==0.26.2",
        "hf-transfer==0.1.8",
        "psycopg2-binary==2.9.10",
        "supabase==2.10.0",
        "pydantic[email]==2.9.2",
    ]

    pytorch_packages = [
        "--index-url https://download.pytorch.org/whl/cpu",
        "torch==2.4.0+cpu",
        "torchvision==0.20.1+cpu",
    ]

    image = (
        image
        .pip_install(*packages)
        .pip_install(*pytorch_packages)
    )

    return image
