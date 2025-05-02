from pymongo import MongoClient
import numpy as np
 # MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["facetrack"]
student_collection = db["students"]
 
 # Check if email or roll number already exists
def find_student_by_email_or_roll(email, roll_number):
     return student_collection.find_one({
         "$or": [{"email": email}, {"roll_number": roll_number}]
     })
 
     # Check for similar face encoding (already stored face)
def is_face_encoding_duplicate(new_encoding, threshold=0.45):
     students = list(student_collection.find({}, {"face_encoding": 1}))
     for student in students:
         existing_encoding = student.get("face_encoding")
         if existing_encoding:
             # Compare face encodings using numpy
             distance = np.linalg.norm(np.array(existing_encoding) - np.array(new_encoding))
             if distance < threshold:
                 return True
     return False
 
 # Create student
def create_student(student_data):
     result = student_collection.insert_one(student_data)
     return result.inserted_id
 
 # Get all students
def get_all_students():
     return list(student_collection.find())
 
 # ✅ Get students for a specific admin
def get_students_by_admin(admin_id):
     return list(student_collection.find({"admin_id": admin_id}))
 
def get_students_by_admin(admin_id):
     print("✅ get_students_by_admin called with:", admin_id)
     return list(student_collection.find({"admin_id": admin_id}))
 
     # Delete student by student ID
def delete_student_by_id(student_id):
     result = student_collection.delete_one({"id": student_id})
     return result.deleted_count > 0  # Returns True if a document was deleted