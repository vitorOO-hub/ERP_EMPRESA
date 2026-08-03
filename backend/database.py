from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from config import URL_DATABASE

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit = False, autoflush= False, bind = engine)

Base = declarative_base()

