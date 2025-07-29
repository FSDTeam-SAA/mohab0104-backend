const cloudinary = require("cloudinary").v2;
const config = require("../config");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const sendImageToCloudinary = (imageName, filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".json"].includes(
    ext
  );

  if (!isImage) {
    return Promise.reject(
      new Error("Only image and JSON files are allowed for upload")
    );
  }
  console.log(filePath);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { public_id: imageName },
      function (error, result) {
        // Always delete the file
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("Failed to delete local file:", err);
          } else {  
            console.log("File deleted from local uploads.");
          }
        });

        if (error) return reject(error);
        console.log(result);
         resolve(result);
      }
    );
  });
};

// Multer storage config for local uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + "/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

module.exports = {
  sendImageToCloudinary,
  upload,
};
