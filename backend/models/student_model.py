from pymongo import MongoClient
from bson import ObjectId
import datetime
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# MongoDB Atlas connection
MONGO_URI = os.getenv("MONGO_URI")  # Ensure MONGO_URI is defined in your .env file
client = MongoClient(MONGO_URI)

# Use the correct database name from your Atlas cluster
db = client["faceAttandance"]  # Change this to your actual Atlas DB name
attendance_collection = db["attendance"]

# Mark student attendance
def mark_student_attendance(student_id, name, roll_number, admin_id):
    today_start = datetime.datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = datetime.datetime.now().replace(hour=23, minute=59, second=59, microsecond=999999)

    # Check if attendance already marked for the student today
    existing = attendance_collection.find_one({
        "student_id": str(student_id),
        "admin_id": admin_id,
        "timestamp": {"$gte": today_start, "$lt": today_end}
    })

    if existing:
        return None  # Attendance already marked today

    # Record attendance if not already marked
    record = {
        "student_id": str(student_id),
        "name": name,
        "roll_number": roll_number,
        "admin_id": admin_id,
        "timestamp": datetime.datetime.now(),
        "status": "Present"
    }
    result = attendance_collection.insert_one(record)
    return result.inserted_id

# Get all attendance records
def get_all_attendance():
    return list(attendance_collection.find())
