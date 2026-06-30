from database import SessionLocal

def session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()