const cloudinary = require("cloudinary").v2;
const config = require("../config");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

// Ensure the uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// Multer upload middleware (no fileFilter used here, but can be added if needed)
const upload = multer({ storage });

// Cloudinary upload handler
const sendImageToCloudinary = (imageName, filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const isSupported = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".json",
  ].includes(ext);

  if (!isSupported) {
    return Promise.reject(
      new Error("Only image and JSON files are allowed for upload")
    );
  }

  const resourceType = ext === ".json" ? "raw" : "image";

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        public_id: imageName,
        resource_type: resourceType,
      },
      function (error, result) {
        // Delete the file after upload
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("Failed to delete local file:", err);
          } else {
            console.log("File deleted from local uploads.");
          }
        });

        if (error) return reject(error);
        resolve(result);
      }
    );
  });
};

module.exports = {
  upload,
  sendImageToCloudinary,
};
