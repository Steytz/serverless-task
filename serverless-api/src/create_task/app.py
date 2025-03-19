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

def make_response(status_code, body=None):
    response = {
        "statusCode": status_code,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    }
    if body is not None:
        response["body"] = json.dumps(body, cls=JSONEncoder)
    return response

def lambda_handler(event, context):
    logger.info("Received event: %s", event)

    if event.get("httpMethod") == "OPTIONS":
        logger.info("Handling preflight OPTIONS request")
        return make_response(200)

    if collection is None:
        return make_response(500, {"error": "Database connection failed"})

    try:
        body = json.loads(event["body"])
        if "title" not in body:
            return make_response(400, {"error": "Title is required"})

        task = {
            "id": str(uuid.uuid4()),
            "title": body["title"],
            "status": "to-do"
        }
        
        collection.insert_one(task)
        return make_response(201, {"message": "Task created", "task": task})

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return make_response(500, {"error": str(e)})
