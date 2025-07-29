const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/json") {
    cb(null, true);
  } else {
    cb(new Error("Only JSON files are allowed"), false);
  }
};

const upload = multer({ storage: storage, fileFilter });

module.exports = upload;
