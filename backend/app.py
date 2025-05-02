from flask import Flask, request, jsonify
from flask_cors import CORS
from bson.objectid import ObjectId
from datetime import datetime
import os
import face_recognition
import numpy as np
from werkzeug.security import check_password_hash
from pymongo import MongoClient

# Database models
from models.admin_model import create_admin, find_admin_by_email, admin_collection
from models.student_model import (
    create_student,
    get_all_students,
    get_students_by_admin,
    find_student_by_email_or_roll,
    is_face_encoding_duplicate,
    delete_student_by_id,
    student_collection
)
from models.attendance_model import (
    mark_student_attendance,
    get_all_attendance,
    attendance_collection
)


# Allow cross-origin requests from your frontend (change to your frontend's URL)
app = Flask(__name__)
CORS(app, origins=["https://face-attendance-system-rr87.onrender.com", "http://localhost:3000"])  # Add both URLs for production and local development

@app.route("/")
def home():
    return "MongoDB connected successfully!"


# ------------------ Admin Register ------------------
@app.route("/api/register", methods=["POST"])
def register_admin():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if find_admin_by_email(email):
        return jsonify({"success": False, "message": "Admin already exists!"}), 409

    admin_id = create_admin(name, email, password)
    return jsonify({"success": True, "message": "Admin registered!", "admin_id": admin_id}), 201


# ------------------ Admin Login ------------------
@app.route("/api/login", methods=["POST"])
def login_admin():
    data = request.form
    email = data.get("email")
    password = data.get("password")

    admin = find_admin_by_email(email)
    if not admin:
        return jsonify({"success": False, "message": "Admin not found!"}), 404

    if not check_password_hash(admin["password"], password):
        return jsonify({"success": False, "message": "Incorrect password!"}), 401

    return jsonify({
        "success": True,
        "message": "Login successful!",
        "admin": {
            "id": str(admin["_id"]),
            "name": admin["name"],
            "email": admin["email"]
        }
    }), 200


# ------------------ Student Registration ------------------
@app.route("/api/student/register", methods=["POST"])
def register_student():
    name = request.form.get("name")
    roll_number = request.form.get("roll_number")
    email = request.form.get("email")
    course = request.form.get("course")
    semester = request.form.get("semester")
    image_file = request.files.get("image")
    admin_id = request.form.get("admin_id")

    if not all([name, roll_number, email, course, semester, image_file, admin_id]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    if find_student_by_email_or_roll(email, roll_number):
        return jsonify({"success": False, "message": "Student with same email or roll number already exists"}), 409

    upload_folder = "uploads"
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    image_path = os.path.join(upload_folder, f"{roll_number}_{image_file.filename}")
    image_file.save(image_path)

    image = face_recognition.load_image_file(image_path)
    face_encodings = face_recognition.face_encodings(image)

    if len(face_encodings) == 0:
        return jsonify({"success": False, "message": "No face detected in the image!"}), 400

    encoding_list = face_encodings[0].tolist()

    if is_face_encoding_duplicate(encoding_list):
        return jsonify({"success": False, "message": "Duplicate face detected. This face is already registered."}), 409

    student_data = {
        "name": name,
        "roll_number": roll_number,
        "email": email,
        "course": course,
        "semester": semester,
        "image": image_path,
        "face_encoding": encoding_list,
        "admin_id": admin_id
    }

    result_id = create_student(student_data)

    return jsonify({
        "success": True,
        "message": "Student registered and face encoded successfully",
        "student_id": str(result_id)
    }), 201


# ------------------ Mark Attendance ------------------
@app.route("/api/mark-attendance", methods=["POST"])
def mark_attendance():
    image_file = request.files.get("image")
    admin_id = request.form.get("admin_id")

    if not admin_id or not image_file:
        return jsonify({"success": False, "message": "Admin ID and image are required"}), 400

    temp_path = "temp.jpg"
    image_file.save(temp_path)

    unknown_image = face_recognition.load_image_file(temp_path)
    unknown_encodings = face_recognition.face_encodings(unknown_image)
    os.remove(temp_path)

    if not unknown_encodings:
        return jsonify({"success": False, "message": "No face found!"}), 400

    unknown_encoding = unknown_encodings[0]

    students = get_students_by_admin(admin_id)
    known_encodings = [s.get("face_encoding") for s in students if s.get("face_encoding")]
    student_list = [s for s in students if s.get("face_encoding")]

    face_distances = face_recognition.face_distance(known_encodings, unknown_encoding)
    best_match_index = np.argmin(face_distances)
    best_distance = face_distances[best_match_index]

    if best_distance < 0.45:
        student = student_list[best_match_index]
        attendance_id = mark_student_attendance(student["_id"], student["name"], student["roll_number"], admin_id)

        if attendance_id is None:
            return jsonify({"success": False, "message": f"Attendance already marked today for {student['name']}"}), 409

        return jsonify({
            "success": True,
            "message": f"Attendance marked for {student['name']} ({student['roll_number']})",
            "attendance_id": str(attendance_id)
        }), 200

    return jsonify({"success": False, "message": "No match found!"}), 404


# ------------------ Attendance Records ------------------
@app.route("/api/attendance-records", methods=["POST"])
def get_attendance_by_admin():
    data = request.get_json()
    admin_id = data.get("admin_id")

    if not admin_id:
        return jsonify({"success": False, "message": "admin_id is required"}), 400

    students = list(student_collection.find({"admin_id": admin_id}))
    student_dict = {str(s["_id"]): s for s in students}

    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = datetime.now().replace(hour=23, minute=59, second=59, microsecond=999999)

    attendance = list(attendance_collection.find({
        "student_id": {"$in": list(student_dict.keys())},
        "timestamp": {"$gte": today_start, "$lt": today_end}
    }))

    attendance_map = {rec["student_id"]: rec for rec in attendance}

    formatted = []
    for student_id, student in student_dict.items():
        record = attendance_map.get(student_id)
        if record:
            status = record.get("status", "Present")
            timestamp = record["timestamp"].strftime("%Y-%m-%d")
            attendance_id = str(record["_id"])
        else:
            status = "Not Marked"
            timestamp = datetime.now().strftime("%Y-%m-%d")
            attendance_id = None
        formatted.append({
            "Studentid": str(student.get("_id")),
            "name": student.get("name", "Unknown"),
            "id": student.get("roll_number", "Unknown"),
            "date": timestamp,
            "course": student.get("course", "Unknown"),
            "status": status,
            "marked_by": student.get("admin_id", "N/A"),
            "attendance_id": attendance_id
        })

    return jsonify({"success": True, "records": formatted}), 200


# ------------------ Attendance Summary ------------------
@app.route('/api/attendance-summary', methods=['GET'])
def attendance_summary():
    students = list(student_collection.find())
    attendance = list(attendance_collection.find({
        "timestamp": {
            "$gte": datetime.now().replace(hour=0, minute=0, second=0, microsecond=0),
            "$lt": datetime.now().replace(hour=23, minute=59, second=59, microsecond=999999)
        }
    }))

    total_students = len(students)
    present = sum(1 for r in attendance if r.get("status") == "Present")
    absent = sum(1 for r in attendance if r.get("status") == "Absent")
    not_marked = total_students - len({r['student_id'] for r in attendance})

    return jsonify({
        "total_students": total_students,
        "present_today": present,
        "absent_today": absent,
        "not_marked": not_marked
    }), 200


# ------------------ Fetch All Students ------------------
@app.route('/api/students', methods=['POST'])
def get_students():
    data = request.get_json()
    admin_id = data.get('admin_id')

    students = list(student_collection.find({"admin_id": admin_id}))
    for student in students:
        student["_id"] = str(student["_id"])

    return jsonify({"success": True, "students": students})


# ------------------ Delete Student Attendance ------------------
@app.route("/api/delete-student-attendance", methods=["DELETE"])
def delete_student_attendance():
    data = request.get_json()
    student_id = data.get("student_id")

    if not student_id:
        return jsonify({"success": False, "message": "Student ID is required"}), 400

    result = attendance_collection.delete_many({"student_id": student_id})
    if result.deleted_count > 0:
        return jsonify({"success": True, "message": "Student's attendance records deleted successfully."}), 200
    else:
        return jsonify({"success": False, "message": "No attendance records found for this student."}), 404


if __name__ == "__main__":
    app.run(debug=True)
