# 🛠️ Serverless Task Management API

This is a **serverless task management API** built with **AWS Lambda**, **API Gateway**, and **MongoDB Atlas**. It allows users to **create, retrieve, update, and delete tasks** using a **fully managed, scalable, and cost-effective** architecture.

## 🚀 Features
- **AWS Lambda** functions for CRUD operations
- **MongoDB Atlas** as the NoSQL database
- **AWS SSM Parameter Store** for secure storage of environment variables
- **API Gateway** for exposing endpoints
- **Unit tests** with **pytest** and **mongomock**
- **Dockerized functions** for efficient deployment

---

## 📌 Prerequisites
Before running this project, ensure you have the following installed:
- [Python 3.9+](https://www.python.org/downloads/)
- [AWS CLI](https://aws.amazon.com/cli/) (configured with valid credentials)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- [Docker](https://www.docker.com/get-started)

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/serverless-task.git
cd serverless-task
```

### 2️⃣ Create a Virtual Environment & Install Dependencies
```sh
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3️⃣ Set Up Environment Variables  
Ensure you have a **MongoDB Atlas URI** stored in AWS SSM Parameter Store:
```sh
aws ssm put-parameter --name "/serverless-task/MONGO_URI" --value "<your-mongodb-uri>" --type "SecureString"
```

---

## ▶️ Running Locally

### 🏷️ **Build the Project**
```sh
sam build
```

### 🛠️ **Start the API Locally**
```sh
sam local start-api
```
Once running, your API will be available at:  
**`http://127.0.0.1:3000/tasks`**

---

## 📄 Deploying to AWS
Run the following command to deploy the API to AWS:
```sh
sam deploy --guided
```
This will prompt you to configure stack settings for AWS.

---

## 🔗 API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/tasks` | Create a new task |
| `GET` | `/tasks` | Retrieve all tasks |
| `PUT` | `/tasks/{id}` | Update a task's status |
| `DELETE` | `/tasks/{id}` | Delete a task |

---

## ✅ Running Tests
To run the unit tests:
```sh
pytest tests/
```

---

## 🛠️ Debugging Common Issues
### **1️⃣ MONGO_URI Not Found in SSM**
Ensure the parameter exists:
```sh
aws ssm get-parameter --name "/serverless-task/MONGO_URI" --with-decryption
```
If missing, add it again.

### **2️⃣ API Gateway "Missing Authentication Token"**
Ensure the API Gateway deployment is correct:
```sh
sam deploy
```

### **3️⃣ MongoDB Connection Issues**
- Verify IP whitelisting in **MongoDB Atlas**
- Ensure **MongoDB URI is correctly stored in SSM**

---

## 🐝 License
This project is licensed under the **MIT License**.

---

