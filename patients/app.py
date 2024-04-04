from fastapi import FastAPI
import logging
from utils import token_validator
from database import engine
from sqlalchemy import text, MetaData

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
app = FastAPI()

@app.get("/protected")
@token_validator
async def protected_endpoint():
    return "This is the protected endpoint from patient-service."

@app.get("/unprotected")
async def unprotected_endpoint():
    metadata = MetaData()

    # Reflect all tables from the database
    metadata.reflect(bind=engine)

    # Print all table names
    logger.info("Tables in the database:")
    for table in metadata.tables.values():
        logger.info(table.name)
    
    # get patient data
    with engine.connect() as connection:
        result = connection.execute(text("SELECT * FROM Patients"))
        patients = result.fetchall()
        logger.info(patients)
