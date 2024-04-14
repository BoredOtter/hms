from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
import logging
from os import environ, fstat
from minio import Minio
from minio.error import InvalidResponseError
from utils import token_validator

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
app = FastAPI()

MINIO_HOST = environ.get("MINIO_HOST")
MINIO_ACCESS_KEY = environ.get("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = environ.get("MINIO_SECRET_KEY")

DEFAULT_BUCKET_NAME = environ.get("MINIO_BUCKET_NAME")

# Initialize MinIO client
minio_client = Minio(
    endpoint=MINIO_HOST,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

# ================== Bucket Management ==================
@app.post("/bucket/{bucket_name}", tags=["bucket"])
def create_bucket(bucket_name: str):
    try:
        # Check if the bucket already exists
        if minio_client.bucket_exists(bucket_name):
            raise HTTPException(status_code=400, detail="Bucket already exists")

        # Create a new bucket
        minio_client.make_bucket(bucket_name)
        return {"message": f"Bucket '{bucket_name}' created successfully"}

    except InvalidResponseError as err:
        raise HTTPException(status_code=500, detail=f"MinIO Error: {err}")
    
# ================== Document Management ==================

@app.get("/document/{document_name}", tags=["document"])
def get_document(document_name: str, bucket_name: str = DEFAULT_BUCKET_NAME):
    try:
        # Check if the bucket exists
        if not minio_client.bucket_exists(bucket_name):
            raise HTTPException(status_code=404, detail="Bucket not found")

        # Check if the document exists
        if not minio_client.stat_object(bucket_name, document_name):
            raise HTTPException(status_code=404, detail="Document not found")

        document = minio_client.fget_object(bucket_name, document_name, document_name)
        
        # Return the document
        return FileResponse(document_name)

    except InvalidResponseError as err:
        raise HTTPException(status_code=500, detail=f"MinIO Error: {err}")

@app.post("/document", tags=["document"])
async def upload_file(file: UploadFile = File(...), bucket_name: str = DEFAULT_BUCKET_NAME):
    try:
        # Check if the bucket exists
        if not minio_client.bucket_exists(bucket_name):
            raise HTTPException(status_code=404, detail="Bucket not found")

        # Get the length of the file data
        file_length = fstat(file.file.fileno()).st_size
        
        # Save the file to MinIO
        minio_client.put_object(bucket_name, file.filename, file.file, file_length)

        return {"message": f"File '{file.filename}' uploaded successfully"}

    except InvalidResponseError as err:
        raise HTTPException(status_code=500, detail=f"MinIO Error: {err}")
