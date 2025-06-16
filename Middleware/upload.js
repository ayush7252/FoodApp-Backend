const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Define uploads directory
const UPLOADS_DIR = path.join(__dirname, "Uploads"); // Resolves to /opt/render/project/src/Middleware/Uploads

// Ensure uploads folder exists with error handling
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log(`Uploads directory created at: ${UPLOADS_DIR}`);
  } else {
    console.log(`Uploads directory already exists at: ${UPLOADS_DIR}`);
  }
} catch (err) {
  console.error(`Failed to create Uploads directory: ${err.message}`);
  throw err;
}

// Check write permissions
try {
  fs.accessSync(UPLOADS_DIR, fs.constants.W_OK);
  console.log(`Uploads directory is writable`);
} catch (err) {
  console.error(`Uploads directory is not writable: ${err.message}`);
  throw err;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`Saving file to: ${UPLOADS_DIR}`);
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const finalName = `${uniqueName}${path.extname(file.originalname)}`;
    console.log(`Generated filename: ${finalName}`);
    cb(null, finalName);
  },
});

// Multer configuration with file size limit and error handling
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpeg, jpg, png, gif) are allowed"));
  },
});

module.exports = upload;