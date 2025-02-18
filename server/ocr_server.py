import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

from flask import Flask, request, jsonify
import easyocr

import torch
print("CUDA Available:", torch.cuda.is_available())
print("GPU Name:", torch.cuda.get_device_name(0) if torch.cuda.is_available() else "No GPU detected")


app = Flask(__name__)

# Allow CORS (Cross-Origin Resource Sharing)
from flask_cors import CORS
CORS(app)

# Initialize the EasyOCR reader
reader = easyocr.Reader(['en'], gpu=True)
print("OCR Server is using:", "GPU" if torch.cuda.is_available() else "CPU")

# Define the OCR route
@app.route("/ocr", methods=["POST"])
def process_image():
    if "image_path" not in request.json:
        return jsonify({"error": "No image path provided"}), 400

    image_path = request.json["image_path"]

    if not os.path.exists(image_path):
        return jsonify({"error": "Image not found"}), 404

    # Perform OCR
    result = reader.readtext(image_path, detail=0)  # Extract text only
    extracted_text = " ".join(result)

    return jsonify({"extractedText": extracted_text})

# Start the Python OCR server
if __name__ == "__main__":
    app.run(port=5001, debug=True)
