import json
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

logger.info("Initializing MongoDB connection...")

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

def make_response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        "body": json.dumps(body, cls=JSONEncoder)
    }

def lambda_handler(event, context):
    logger.info(f"Received request: {event}")

    if collection is None:
        return make_response(500, {"error": "Database connection failed"})

    if event.get("httpMethod") == "OPTIONS":
        logger.info("Handling CORS preflight request.")
        return make_response(200, {"message": "CORS preflight successful"})

    try:
        path_params = event.get("pathParameters")
        if not path_params or "id" not in path_params:
            logger.error("No task ID provided in path parameters.")
            return make_response(400, {"error": "Task ID is required in the URL"})

        task_id = path_params["id"]
        logger.info(f"Checking if task exists before deletion: {task_id}")

        existing_task = collection.find_one({"id": task_id})
        if not existing_task:
            logger.warning(f"Task with ID {task_id} not found before deletion.")
            return make_response(404, {"message": "Task not found"})

        result = collection.delete_one({"id": task_id})

        if result.deleted_count == 0:
            logger.warning(f"Task with ID {task_id} was not deleted.")
            return make_response(404, {"message": "Task not found"})

        logger.info(f"Task with ID {task_id} successfully deleted.")
        return make_response(200, {"message": "Task deleted"})

    except Exception as e:
        logger.error(f"Error deleting task: {str(e)}")
        return make_response(500, {"error": str(e)})
