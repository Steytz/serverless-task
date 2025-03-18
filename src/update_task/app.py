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

def lambda_handler(event, context):
    """Handles updating a task's status in MongoDB"""
    logger.info(f"Received request: {event}")

    if collection is None:
        return {"statusCode": 500, "body": json.dumps({"error": "Database connection failed"})}

    try:
        task_id = event.get("pathParameters", {}).get("id")

        if not task_id:
            logger.error("No task ID provided.")
            return {"statusCode": 400, "body": json.dumps({"error": "Task ID is required"})}

        body = json.loads(event.get("body", "{}"))
        new_status = body.get("status")

        if not new_status:
            logger.error("Missing new status.")
            return {"statusCode": 400, "body": json.dumps({"error": "Status is required"})}

        result = collection.update_one({"id": task_id}, {"$set": {"status": new_status}})

        if result.modified_count == 0:
            logger.warning(f"Task with ID {task_id} not found or status unchanged.")
            return {"statusCode": 404, "body": json.dumps({"message": "Task not found or already in the requested state"})}

        logger.info(f"Task with ID {task_id} successfully updated to status '{new_status}'.")
        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Task updated", "id": task_id, "status": new_status})
        }

    except Exception as e:
        logger.error(f"Error updating task: {str(e)}")
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
