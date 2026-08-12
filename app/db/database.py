import os
import dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

dotenv.load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# 1. Create the engine properly
engine = create_engine(DATABASE_URL, echo=True)

# Base class for models
Base = declarative_base()

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def check_db_connection():
    try:
        # 2. Connect using the engine object and execute text SQL
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
            print("✅ Database connection successful!")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

# 3. Add this block to allow running directly from terminal
if __name__ == "__main__":
    check_db_connection()