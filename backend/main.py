from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from passlib.context import CryptContext
import jwt
from typing import Optional, List
import certifi
import joblib
import easyocr
import shutil
import os
import google.generativeai as genai
from motor.motor_asyncio import AsyncIOMotorClient

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace '*' with specific origins for better security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB configuration
MONGO_URI = "mongodb+srv://dbuser:dbuser@cluster0.xudqw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())

try:
    client.admin.command("ping")
    print("Connected to MongoDB!")
except Exception as e:
    print("MongoDB connection error:", e)

db = client["user_db"]
users_collection = db["users"]
profiles_collection = db.profile  # Collection for profile data

# JWT Secret Key
SECRET_KEY = "your_jwt_secret_key"

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Helper functions for password handling and JWT
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)

def create_jwt(email: str, allergy: List[str]) -> str:
    payload = {"email": email, "allergy": allergy}
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

# Load pre-trained model and vectorizer using joblib
vectorizer = joblib.load("model/tfidf_vectorizer.joblib")
model = joblib.load("model/allergen_classifier_model.joblib")

# Allergen labels
allergens = ["gluten", "soy", "peanuts", "milk", "eggs"]  # Replace with your actual labels

# OCR Reader Initialization
reader = easyocr.Reader(["en"])

# Pydantic Models
class UserSignup(BaseModel):
    email: str
    password: str
    allergy: Optional[List[str]] = []

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfileUpdate(BaseModel):
    email: str
    allergy: List[str]

class Profile(BaseModel):
    email: str
    allergy: List[str]

# API Endpoints for User Authentication and Profile Management
@app.post("/signup")
def signup(user: UserSignup):
    print(user)
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already exists.")

    hashed_password = hash_password(user.password)
    new_user = {"email": user.email, "password": hashed_password, "allergy": user.allergy}
    print(new_user)
    users_collection.insert_one(new_user)
    print("test")

    token = create_jwt(user.email, user.allergy)
    return {"jwt": token}

@app.post("/login")
def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    token = create_jwt(db_user["email"], db_user.get("allergy", []))
    return {"jwt": token}

@app.put("/update-profile")
def update_profile(update_data: UserProfileUpdate):
    result = users_collection.update_one(
        {"email": update_data.email},
        {"$set": {"allergy": update_data.allergy}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")

    return {"message": "Profile updated successfully."}

@app.get("/get-allergy/{email}")
def get_allergy(email: str):
    db_user = users_collection.find_one({"email": email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found.")

    return {"email": email, "allergy": db_user.get("allergy", [])}

# Allergy Detection API - OCR-based
@app.post("/api/allergy_detection/")
async def allergy_detection(file: UploadFile = File(...)):
    try:
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = reader.readtext(temp_file_path)
        os.remove(temp_file_path)

        extracted_text = [entry[1] for entry in result]
        combined_text = " ".join(extracted_text[1:])

        ingredients = clean_and_split_ingredients(combined_text)
        predicted_allergens = await predict_allergens(ingredients)

        return {"status": "success", "predicted_allergens": predicted_allergens}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def clean_and_split_ingredients(ingredient_string):
    cleaned_string = ingredient_string.replace(';', ',').replace(',', ',')
    if cleaned_string.endswith(':'):
        cleaned_string = cleaned_string[:-1].lower()
    return [item.strip() for item in cleaned_string.split(',') if item.strip()]

async def predict_allergens(ingredients: list[str]):
    if not ingredients:
        raise HTTPException(status_code=400, detail="Ingredients list is empty.")

    ingredients_text = [" ".join(ingredients)]
    ingredients_vectorized = vectorizer.transform(ingredients_text)
    prediction = model.predict(ingredients_vectorized)

    predicted_allergens = {allergens[i]: int(pred) for i, pred in enumerate(prediction[0]) if pred == 1}
    return predicted_allergens

# Nutrition Review API - OCR-based with Generative AI
genai.configure(api_key="AIzaSyC5tFI_TwCtBQqRZykbWlbE6JZfsq_1-GM")  # Replace with your actual API key

@app.post("/api/nutrition_review/")
async def nutrition_review(file: UploadFile = File(...)):
    try:
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = reader.readtext(temp_file_path)
        os.remove(temp_file_path)

        extracted_text = [entry[1] for entry in result]
        combined_text = " ".join(extracted_text)

        prompt = f"""
        You are a highly intelligent nutrition analysis assistant. Given the following text extracted from a product's nutritional label, analyze 
        This should include:
        1. "overall_rating" (integer, scale 1-5): Rate the product's overall nutritional quality.
        2. "rating_explanation" (string): Briefly explain the rationale for the rating.
        3. For each key nutrient like "sodium," "saturated fat," "fiber," and "protein":
            - "level" (string): One of ["low", "moderate", "high"].
            - "recommendation" (string): Suggest dietary advice based on its level.
        4. "suggested_intake" (object):
            - "frequency" (string): Suggest how often it should be consumed (e.g., "daily", "occasional").
            - "rationale" (string): Explain the reasoning.
        Nutrition Facts:
        {combined_text}
        """

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        # Clean up the response by removing unwanted characters
        nutrition_review = response.text.strip()
        
        # Remove the code block markdown and unnecessary whitespaces/newlines
        nutrition_review = nutrition_review.replace("```json\n", "").replace("\n```", "")
        nutrition_review = nutrition_review.replace("\n", " ").replace("\r", "")
        
        # Ensure the string is well formatted as JSON
        nutrition_review = " ".join(nutrition_review.split())

        # Return clean JSON
        return {"status": "success", "nutrition_review": nutrition_review}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

