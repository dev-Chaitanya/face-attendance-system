from pymongo import MongoClient
from werkzeug.security import generate_password_hash
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# MongoDB Atlas connection
MONGO_URI = os.getenv("MONGO_URI")  # Ensure MONGO_URI is defined in your .env file
client = MongoClient(MONGO_URI)

# Use the correct database name from your Atlas cluster
db = client["faceAttandance"]  # Change this to your actual Atlas DB name
admin_collection = db["admins"]

# Create a new admin user with hashed password
def create_admin(name, email, password):
    hashed_pw = generate_password_hash(password)
    admin_data = {
        "name": name,
        "email": email.strip().lower(),  # normalize
        "password": hashed_pw
    }
    result = admin_collection.insert_one(admin_data)
    return str(result.inserted_id)

# Find admin by email (used for login or validation)
def find_admin_by_email(email):
    return admin_collection.find_one({"email": email.strip().lower()})
