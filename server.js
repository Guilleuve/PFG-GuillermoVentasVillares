import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import socketServer from "./socketServer.js";
import posts from "./routes/posts.js";
import users from "./routes/users.js";
import comments from "./routes/comments.js";
import messages from "./routes/messages.js";
import bodyParser from "body-parser";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import { Server } from 'socket.io';
import { authSocket } from "./socketServer.js";
import { fileURLToPath } from "url";
import { register } from "./controllers/userControllers.js";
import { createPost } from "./controllers/postControllers.js";
import { verifyToken } from "./middleware/auth.js";
import { getDate, getHours } from "date-fns";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:4000"],
  },
});

io.use(authSocket);
io.on("connection", (socket) => socketServer(socket));


app.use(express.json());
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
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

/* MONGOOSE SETUP */
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: "true",
})
mongoose.connection.on("error", err => {
  console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected")
})
const PORT = process.env.PORT

if (process.env.NODE_ENV == "production") {
  app.listen(PORT, '0.0.0.0', () => console.log(`Server Port: ${PORT}`));
}
else{
  app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
}

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}
