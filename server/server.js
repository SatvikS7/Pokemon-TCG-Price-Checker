import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import axios from "axios";

const app = express();
const PORT = 5000;

// Convert __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

// Upload route
app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imagePath = path.join(__dirname, "uploads", req.file.filename);

  try {
    // Send image path to Python OCR server
    const ocrResponse = await axios.post("http://localhost:5001/ocr", {
      image_path: imagePath,
    });

    res.json({
      imageUrl: `http://localhost:5000/uploads/${req.file.filename}`,
      extractedText: ocrResponse.data.extractedText, // OCR text
    });
  } catch (error) {
    console.error("OCR Error:", error);
    res.status(500).json({ message: "Error processing OCR" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
