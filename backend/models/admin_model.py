from pymongo import MongoClient
from werkzeug.security import generate_password_hash

client = MongoClient("mongodb://localhost:27017/")
db = client["facetrack"]
admin_collection = db["admins"]

def create_admin(name, email, password):
    hashed_pw = generate_password_hash(password)
    admin_data = {
        "name": name,
        "email": email.strip().lower(),  # normalize
        "password": hashed_pw
    }
    result = admin_collection.insert_one(admin_data)
    return str(result.inserted_id)

def find_admin_by_email(email):  # ✅ THIS FUNCTION
    return admin_collection.find_one({"email": email.strip().lower()})
