from pathlib import Path
from dotenv import load_dotenv
import os

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

def get_required_env(name):
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Variavel obrigatoria ausente no backend/.env: {name}")
    return value


SECRET_KEY = get_required_env("SECRET_KEY")
ALGORITHM = get_required_env("ALGORITHM")
URL_DATABASE = get_required_env("URL_DATABASE")

try:
    ACCESS_TOKEN_EXPIRE_MINUTES = int(get_required_env("ACCESS_TOKEN_EXPIRE_MINUTES"))
except ValueError as exc:
    raise RuntimeError("ACCESS_TOKEN_EXPIRE_MINUTES precisa ser um numero inteiro") from exc
