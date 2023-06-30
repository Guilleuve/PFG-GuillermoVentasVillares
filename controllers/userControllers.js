import User from "../models/User.js";
import Post from "../models/Post.js";
import PostLike from "../models/PostLike.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Follow from "../models/Follow.js";
import EmailVerification from "../models/EmailVerification.js";
import paginate from "../util/paginate.js";
import { BASE_URL } from "../config.js";
import nodemailer from 'nodemailer';
import Conversation from "../models/Conversation.js";


const getUserDict = (token, user) => {
  return {
    token,
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    picturePath: user.picturePath,
    userId: user._id,
    isAdmin: user.isAdmin,
  };
};

const buildToken = (user) => {
  return {
    userId: user._id,
    isAdmin: user.isAdmin,
  };
};

const register = async (req, res) => {
  try {
    const { firstname, lastname, 
      username, 
      email, 
      password,
      location,
      experto,
      intermedio,
      principiante, 
      picturePath } = req.body;

    if (!(firstname && lastname && username && email && password && location)) {
      throw new Error("Debes rellenar todos los campos");
    }

    const normalizedEmail = email.toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username }],
    });

    if (existingUser) {
      throw new Error("Ya existe un usuario con estas credenciales");
    }

    if (req.file) {
      const { filename } = req.file;
      fs.renameSync(`./assets/${filename}`, `./assets/${filename}`);
    }

    const user = await User.create({
      firstname,
      lastname,
      username,
      email: normalizedEmail,
      password: hashedPassword,
      location,
      experto,
      intermedio,
      principiante,
      picturePath,
    });

    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY);

    // Generar token de verificación
    const verificationToken = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, { expiresIn: '1d' });

    // Guardar el token de verificación en la base de datos
    await EmailVerification.create({
      userId: user._id,
      token: verificationToken,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 horas de expiración
    });
    

    // Enviar correo electrónico de verificación
    const verificationLink = `${BASE_URL}verify-email?token=${verificationToken}`;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'noreply.cooltrainer@gmail.com',
        pass: 'gzbxrjqdywhcoarh',
  },
    });

    await transporter.sendMail({
      from: 'noreply.cooltrainer@gmail.com',
      to: user.email,
      subject: 'Verificación de correo electrónico',
      text: `Haz clic en el siguiente enlace para verificar tu correo electrónico: ${verificationLink}`,
      html: `Haz clic <a href="${verificationLink}">aquí</a> para verificar tu correo electrónico.`,
    });

    return res.json(getUserDict(token, user));
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const sendPass = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generar token de verificación
    const verificationToken = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, { expiresIn: '1d' });

    // Guardar el token de verificación en la base de datos
    await ResetingPassword.create({
      userId: user._id,
      token: verificationToken,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 horas de expiración
    });
    
    // Enviar correo electrónico de verificación
    const verificationLink = `${BASE_URL}reseting-password?token=${verificationToken}`;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'noreply.cooltrainer@gmail.com',
        pass: 'gzbxrjqdywhcoarh',
  },
    });

    await transporter.sendMail({
      from: 'noreply.cooltrainer@gmail.com',
      to: user.email,
      subject: 'Resetear contraseña',
      text: `Haz clic en el siguiente enlace para cambiar tu contraseña: ${verificationLink}`,
      html: `Haz clic <a href="${verificationLink}">aquí</a> para cambiar tu contraseña.`,
    });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const verifyPass = async (req, res) => {
  try {
    const { token } = req.query;

    // Buscar el token de verificación en la base de datos
    const verification = await ResetingPassword.findOne({ token: token });

    if (!verification) {
      throw new Error('Token de verificación inválido o expirado.');
    }

    // Verificar si el token ha expirado
    if (verification.expiresAt < Date.now()) {
      throw new Error('Token de verificación expirado.');
    }

    // Obtener el ID del usuario asociado con el token de verificación
    const userId = verification.userId;

    // Eliminar el token de verificación de la base de datos
    await ResetingPassword.findByIdAndDelete(verification._id);

    return res.status(200).json({ userId });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const resetPass = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Usuario no existe");
    }

    // Actualizar la contraseña del usuario
    user.password = password;

    await user.save();

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Buscar el token de verificación en la base de datos
    const verification = await EmailVerification.findOne({ token: token });

    if (!verification) {
      throw new Error('Token de verificación inválido o expirado.');
    }

    // Verificar si el token ha expirado
    if (verification.expiresAt < Date.now()) {
      throw new Error('Token de verificación expirado.');
    }

    // Actualizar el campo "verified" del usuario en la base de datos
    await User.findByIdAndUpdate(verification.userId, { verified: true });

    // Eliminar el token de verificación de la base de datos
    await EmailVerification.findByIdAndDelete(verification._id);

    return res.status(200).send('¡Tu correo electrónico ha sido verificado exitosamente!');
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      throw new Error("Debes rellenar todos los campos");
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new Error("Email o contraseña incorrectos");
    }

    if (user.verified == false){
      throw new Error("Debes verificar el email");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Email o contraseña incorrectos");
    }

    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY);

    return res.json(getUserDict(token, user));
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId, biography, location, experto, intermedio, principiante } = req.body;

    console.log(userId, biography, location, experto, intermedio, principiante);

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Usuario no existe");
    }

    user.biography = biography;
    user.location = location;
    user.experto = experto;
    user.intermedio = intermedio;
    user.principiante = principiante;

    await User.updateOne({ _id: userId }, user);

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;

    console.log(userId);
    
    await User.findByIdAndRemove(userId);

    await Post.deleteMany({ poster: userId });

    await PostJoin.deleteMany({ userId: userId });

    await PostLike.deleteMany({ userId: userId });

    await Message.deleteMany({ sender: userId });

    await Follow.deleteMany({ followerId: userId });

    await Follow.deleteMany({ followedId: userId });

    await Conversation.deleteMany({ recipients: userId });

    await Comment.deleteMany({ commenter: userId });


    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const follow = async (req, res) => {
  try {
    const { followerId, followedId } = req.body;

    // Verifica si el usuario que sigue ya existe en la base de datos
    const existingFollower = await User.findById(followerId);
    if (!existingFollower) {
      throw new Error("El seguidor no existe");
    }

    // Verifica si el usuario seguido ya existe en la base de datos
    const existingFollowed = await User.findById(followedId);
    if (!existingFollowed) {
      throw new Error("El usuario seguido no existe");
    }

    // Verifica si ya existe una relación de seguimiento entre los usuarios
    const existingFollow = await Follow.findOne({ followerId, followedId });
    if (existingFollow) {
      throw new Error("Ya sigues a este usuario");
    }

    // Crea una nueva relación de seguimiento
    await Follow.create({
      followerId,
      followedId,
    });

    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const unfollow = async (req, res) => {
  try {
    const { followerId, followedId } = req.body;

    const existingFollow = await Follow.findOne({ followerId, followedId });

    if (!existingFollow) {
      throw new Error("No sigues al usuario");
    }

    await existingFollow.remove();

    return res.status(200).json({ data: existingFollow });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getFollowers = async (req, res) => {
  try {
    const userId = req.params.id;
    let { page, sortBy } = req.query;

    if (!page) page = 1;

    let followers = await Follow.find({ followedId: userId })
      .sort(sortBy)
      .populate({
        path: 'followerId',
        select: 'username firstname lastname picturePath',
      })
      .lean();

    followers = paginate(followers, 10, page);

    const count = followers.length;

    //console.log(userId + ' Followers', followers);
    

    return res.json({ data: followers, count });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const getFollowing = async (req, res) => {
  try {
    const userId = req.params.id;
    let { page, sortBy } = req.query;

    if (!page) page = 1;

    let following = await Follow.find({ followerId: userId })
      .sort(sortBy)
      .populate({
        path: 'followedId',
        select: 'username firstname lastname picturePath',
      })
      .lean();

    following = paginate(following, 10, page);

    const count = following.length;

    //console.log(userId + ' Following', following);

    return res.json({ data: following, count });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const isFollowing = async (req, res) => {
  try {
    const { followerId, followedId } = req.body;
    const follow = await Follow.findOne({ followerId, followedId });
    console.log( "le sigue" + !!follow);
    return !!follow; // Retorna true si se encuentra el seguimiento, false en caso contrario
  } catch (err) {
    console.log(err);
    throw new Error("Ocurrió un error al verificar el seguimiento.");
  }
};

const getUser = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      throw new Error("El usuario no existe");
    }

    const posts = await Post.find({ poster: user._id })
      .populate("poster")
      .sort("-createdAt");

    let likeCount = 0;

    posts.forEach((post) => {
      likeCount += post.likeCount;
    });

    const data = {
      user,
      posts: {
        count: posts.length,
        likeCount,
        data: posts,
      },
    };

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getRandomUsers = async (req, res) => {
  try {
    let { size } = req.query;

    const users = await User.find({ verified: true }).select("-password");

    const randomUsers = [];

    if (size > users.length) {
      size = users.length;
    }

    const randomIndices = getRandomIndices(size, users.length);

    for (let i = 0; i < randomIndices.length; i++) {
      const randomUser = users[randomIndices[i]];
      randomUsers.push(randomUser);
    }

    return res.status(200).json(randomUsers);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const getRandomIndices = (size, sourceSize) => {
  const randomIndices = [];
  while (randomIndices.length < size) {
    const randomNumber = Math.floor(Math.random() * sourceSize);
    if (!randomIndices.includes(randomNumber)) {
      randomIndices.push(randomNumber);
    }
  }
  return randomIndices;
};


export{
  register,
  verifyEmail,
  login,
  sendPass,
  verifyPass,
  resetPass,
  follow,
  unfollow,
  getFollowers,
  getFollowing,
  isFollowing,
  getUser,
  getRandomUsers,
  updateUser,
  deleteUser,
};
