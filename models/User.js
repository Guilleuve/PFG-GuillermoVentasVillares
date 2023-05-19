import mongoose from "mongoose";
import validator from "validator";
import filter from "../util/filter.js";

const { isEmail } = validator;
const { contains } = validator.default;

const User = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastname: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: [6, "El nombre de usuario tiene que tener mínimo 6 caracteres"],
      maxlength: [30, "El nombre de usuario tiene que tener máximo 30 caracteres"],
      validate: {
        validator: (val) => !contains(val, " "),
        message: "No puede contener espacios",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail, "Debes ingresar un email válido"],
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "La contraseña debe ser al menos de 8 caracteres"],
    },
    biography: {
      type: String,
      default: "",
      maxLength: [250, "El nombre de usuario tiene un máximo de 250 caracteres"],
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    location: String,
    experto: {
      type: [String],
      default: [], 
    },
    intermedio: {
      type: [String], 
      default: [], 
    },
    principiante: {
      type: [String], 
      default: [], 
    },
    picturePath: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

User.pre("save", function (next) {
  if (filter.isProfane(this.username)) {
    throw new Error("Username cannot contain profanity");
  }

  if (this.biography.length > 0) {
    this.biography = filter.clean(this.biography);
  }

  next();
});


export default mongoose.model('user', User);