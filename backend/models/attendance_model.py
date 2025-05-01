# models/attendance_model.py
from pymongo import MongoClient
from bson import ObjectId
import datetime

client = MongoClient("mongodb://localhost:27017/")
db = client["facetrack"]
attendance_collection = db["attendance"]

def mark_student_attendance(student_id, name, roll_number, admin_id):
    today_start = datetime.datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = datetime.datetime.now().replace(hour=23, minute=59, second=59, microsecond=999999)

    existing = attendance_collection.find_one({
        "student_id": str(student_id),
        "admin_id": admin_id,
        "timestamp": {"$gte": today_start, "$lt": today_end}
    })

    if existing:
        return None  # Attendance already marked today

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
def get_all_attendance():
    return list(attendance_collection.find())
