from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
import logging
from os import environ, fstat
from minio import Minio
from minio.error import InvalidResponseError, S3Error
from utils import token_validator
import datetime

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
    secure=False,
)


# ================== Bucket Management ==================
@app.post("/buckets/create{bucket_name}", tags=["bucket"])
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
@app.post("/documents/create", tags=["document"])
async def upload_file(
    patient_id: str,
    description: str,
    file: UploadFile = File(...),
    bucket_name: str = DEFAULT_BUCKET_NAME,
):
    # Check if the bucket exists
    if not minio_client.bucket_exists(bucket_name):
        raise HTTPException(status_code=404, detail="Bucket not found")

    # Get the length of the file data
    file_length = fstat(file.file.fileno()).st_size

    # Get the file format
    if "." not in file.filename:
        raise HTTPException(status_code=400, detail="Invalid file format")
    file_format = file.filename.split(".")[-1]

    # Create file name
    file_name = f"{patient_id}-{file.filename}"

    # add file metadata
    metadata = {
        "patient_id": patient_id,
        "description": description,
        "file_format": file_format,
        "date": (datetime.date.today()).strftime("%Y-%m-%d"),
    }

    # Save the file to MinIO
    minio_client.put_object(
        bucket_name=bucket_name,
        object_name=file_name,
        data=file.file,
        length=file_length,
        metadata=metadata,
    )

    return {"message": f"File '{file_name}' uploaded successfully"}


@app.get("/documents/get/metadata/{patient_id}", tags=["document"])
def get_documents_info_by_patient(
    patient_id: str, bucket_name: str = DEFAULT_BUCKET_NAME
):
    try:
        # Check if the bucket exists
        if not minio_client.bucket_exists(bucket_name):
            raise HTTPException(status_code=404, detail="Bucket not found")

        # get all objects in bucket
        try:
            objects = minio_client.list_objects(
                bucket_name, recursive=True, include_user_meta=True
            )
        except S3Error:
            raise HTTPException(status_code=404, detail="No documents found")

        # get all objects with patient_id
        patient_objects = []
        for obj in objects:
            if obj._metadata.get("X-Amz-Meta-Patient_id") == patient_id:
                object_info = {
                    "object_name": obj._object_name,
                    "description": obj._metadata.get("X-Amz-Meta-Description"),
                    "date": obj._metadata.get("X-Amz-Meta-Date"),
                }
                patient_objects.append(object_info)

        if not patient_objects:
            raise HTTPException(
                status_code=404, detail="No documents found for patient"
            )

        return patient_objects

    except InvalidResponseError as err:
        raise HTTPException(status_code=500, detail=f"MinIO Error: {err}")


@app.get("/documents/get/file/{file_name}", tags=["document"])
def get_document_by_file_name(
    document_name: str, bucket_name: str = DEFAULT_BUCKET_NAME
):
    # Check if the bucket exists
    if not minio_client.bucket_exists(bucket_name):
        raise HTTPException(status_code=404, detail="Bucket not found")

    try:
        document = minio_client.fget_object(bucket_name, document_name, document_name)
    except S3Error:
        raise HTTPException(status_code=404, detail="Document not found")

    # Return the document
    return FileResponse(document_name)


@app.delete("/documents/delete/file/{file_name}", tags=["document"])
def delete_document_by_file_name(
    document_name: str, bucket_name: str = DEFAULT_BUCKET_NAME
):
    # Check if the bucket exists
    if not minio_client.bucket_exists(bucket_name):
        raise HTTPException(status_code=404, detail="Bucket not found")

    try:
        minio_client.remove_object(bucket_name, document_name)
    except S3Error:
        raise HTTPException(status_code=404, detail="Document not found")

    return {"message": f"Document '{document_name}' deleted successfully"}
