const path = require("path");
const multer = require("multer");
const express = require("express");
const filestorage = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

filestorage.post("/auth/register", upload.single("picture"), (req, res) => {
  console.log(req.file);
  res.json({ success: true });
});

module.exports = filestorage;