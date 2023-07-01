import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import comments from "./routes/comments.js";
import messages from "./routes/messages.js";
import posts from "./routes/posts.js";
import users from "./routes/users.js";
import { verifyEmail } from "./controllers/userControllers.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());

//app.use(bodyParser.json({ limit: "30mb", extended: true }));
//app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use(cors({
  origin: "https://cooltrainer-2cb4079caab8.herokuapp.com"
}));
//app.use(morgan("common"));
//app.use(bodyParser.json({ limit: "30mb", extended: true }));
//app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/assets/");
  },
  filename: function (req, file, cb) {
    const now = new Date();
    const date = now.getDate();
    const hours = now.getHours();
    cb(null, date + "-" + hours + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), (req, res) => {
  res.send("Archivo cargado exitosamente");
});

//locations
app.get('/locations', (req, res) => {
  fs.readFile('./data/locations.json', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer el archivo');
    } else {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    }
  });
});

//Sports
app.get('/sports', (req, res) => {
  fs.readFile('./data/sports.json', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer el archivo');
    } else {
      const sportsArray = JSON.parse(data);
      const sportsData = sportsArray.map((sport) => ({
        label: sport,
        value: { name: sport } // Puedes agregar más propiedades aquí si es necesario
      }));
      res.json(sportsData);
    }
  });
});

//routes
app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/comments", comments);
app.use("/api/messages", messages);
app.get('/verify-email', verifyEmail);


if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));


  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

/* MONGOOSE SETUP*/
const PORT = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    if (process.env.NODE_ENV == "production") {
      app.listen(PORT, '0.0.0.0', () => console.log(`Server Port: ${PORT}`));
    }
    else{
      app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    }
    
  })
  .catch((error) => console.log(`${error} did not connect`));
