import json
import pytest
import mongomock
from unittest.mock import patch

from src.create_task.app import lambda_handler as create_task_handler
from src.get_tasks.app import lambda_handler as get_tasks_handler
from src.update_task.app import lambda_handler as update_task_handler
from src.delete_task.app import lambda_handler as delete_task_handler

mock_client = mongomock.MongoClient()
mock_db = mock_client["tasks_db"]
mock_collection = mock_db["tasks"]

SAMPLE_TASK = {
    "id": "1234-abcd",
    "title": "Test Task",
    "status": "pending"
}

@pytest.fixture(autouse=True)
def clean_mock_collection():
    """Ensure the collection is reset before each test"""
    mock_collection.delete_many({})

@pytest.fixture
def mock_mongo():
    """Mock MongoDB collection for all tests"""
    with patch("src.create_task.app.collection", mock_collection), \
         patch("src.get_tasks.app.collection", mock_collection), \
         patch("src.update_task.app.collection", mock_collection), \
         patch("src.delete_task.app.collection", mock_collection):
        yield

def test_create_task(mock_mongo):
    """Test creating a new task"""
    event = {"body": json.dumps({"title": "New Task"})}
    response = create_task_handler(event, None)
    body = json.loads(response["body"])

    assert response["statusCode"] == 201
    assert body["message"] == "Task created"
    assert "id" in body["task"]

def test_get_tasks(mock_mongo):
    """Test retrieving all tasks"""
    mock_collection.insert_one(SAMPLE_TASK)
    event = {}
    response = get_tasks_handler(event, None)
    body = json.loads(response["body"])

    assert response["statusCode"] == 200
    assert isinstance(body, list)
    assert len(body) > 0
    assert body[0]["title"] in ["Test Task", "New Task"]

def test_update_task(mock_mongo):
    """Test updating a task's status"""
    mock_collection.insert_one(SAMPLE_TASK)

    event = {
        "pathParameters": {"id": "1234-abcd"},
        "body": json.dumps({"status": "completed"})
    }

    response = update_task_handler(event, None)
    body = json.loads(response["body"])

    assert response["statusCode"] == 200
    assert body["message"] == "Task updated"
    assert body["id"] == "1234-abcd"
    assert body["status"] == "completed"

def test_delete_task(mock_mongo):
    """Test deleting a task"""
    mock_collection.insert_one(SAMPLE_TASK)

    event = {
        "pathParameters": {"id": "1234-abcd"}
    }

    response = delete_task_handler(event, None)
    body = json.loads(response["body"])

    assert response["statusCode"] == 200
    assert body["message"] == "Task deleted"
