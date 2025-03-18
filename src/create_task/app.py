import json
import uuid
import os
import logging
import boto3
from pymongo import MongoClient
from bson import ObjectId

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

def get_mongo_uri():
    ssm = boto3.client("ssm")
    try:
        response = ssm.get_parameter(Name="/serverless-task/MONGO_URI", WithDecryption=True)
        return response["Parameter"]["Value"]
    except Exception as e:
        logger.error(f"Failed to retrieve MONGO_URI from SSM: {str(e)}")
        return None

MONGO_URI = get_mongo_uri()

if not MONGO_URI:
    raise ValueError("MONGO_URI is missing! Ensure it's set in AWS SSM.")

logger.info("Connecting to MongoDB...")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client["tasks_db"]
    collection = db["tasks"]
    logger.info("MongoDB connection successful.")
except Exception as e:
    logger.error(f"MongoDB Connection Error: {str(e)}")
    collection = None

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

def lambda_handler(event, context):
    logger.info("Received event: %s", event)

    if collection is None:
        return {"statusCode": 500, "body": json.dumps({"error": "Database connection failed"})}

    try:
        body = json.loads(event["body"])
        if "title" not in body:
            return {"statusCode": 400, "body": json.dumps({"error": "Title is required"})}

        task = {
            "id": str(uuid.uuid4()),
            "title": body["title"],
            "status": "pending"
        }
        
        collection.insert_one(task)
        return {"statusCode": 201, "body": json.dumps({"message": "Task created", "task": task}, cls=JSONEncoder)}

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
