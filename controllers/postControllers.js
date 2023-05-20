import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import PostLike from "../models/PostLike.js";
import PostJoin from "../models/PostJoin.js";
import paginate from "../util/paginate.js";

const cooldown = new Set();

const createPost = async (req, res) => {
  try {
    const { title, content, location, actividad, date, userId, picturePath } = req.body;

    if (!(title && content)) {
      throw new Error("Debes rellenar todos los elementos");
    }

    /*
    if (cooldown.has(userId)) {
      throw new Error(
        ""
      );
    }
    */

    cooldown.add(userId);
    setTimeout(() => {
      cooldown.delete(userId);
    }, 60000);

    const post = await Post.create({
      title,
      content,
      location,
      actividad,
      date,
      poster: userId,
      picturePath,
    });

    res.json(post);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("El post no existe");
    }

    const post = await Post.findById(postId)
      .populate("poster", "-password")
      .lean();

    if (!post) {
      throw new Error("El post no existe");
    }

    if (userId) {
      await setLiked([post], userId);
      await setJoined([post], userId);
    }


    return res.json(post);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content, userId, isAdmin } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("El post no existe");
    }

    if (post.poster != userId && !isAdmin) {
      throw new Error("No tienes permisos");
    }

    post.content = content;
    post.edited = true;

    await post.save();

    return res.json(post);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId, isAdmin } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("El post no existe");
    }

    if (post.poster != userId && !isAdmin) {
      throw new Error("No tienes permisos");
    }

    await post.remove();

    await Comment.deleteMany({ post: post._id });

    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const setLiked = async (posts, userId) => {
  let searchCondition = {};
  if (userId) searchCondition = { userId };

  const userPostLikes = await PostLike.find(searchCondition); //userId needed

  posts.forEach((post) => {
    userPostLikes.forEach((userPostLike) => {
      if (userPostLike.postId.equals(post._id)) {
        post.liked = true;
        return;
      }
    });
  });
};

const setJoined = async (posts, userId) => {
  let searchCondition = {};
  if (userId) searchCondition = { userId };

  const userPostJoins = await PostJoin.find(searchCondition); 

  posts.forEach((post) => {
    userPostJoins.forEach((userPostJoin) => {
      if (userPostJoin.postId.equals(post._id)) {
        post.joined = true;
        return;
      }
    });
  });
};

const getUsersJoinedPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;
    let { page, sortBy } = req.query;

    if (!page) page = 1;

    let joinedMembers = await PostJoin.find({ postId: postId })
    .sort(sortBy)
    .populate({
      path: 'userId',
      select: 'username firstname lastname picturePath',
    })
    .lean();

    joinedMembers = paginate(joinedMembers, 10, page);

    const count = joinedMembers.length;

    let userIds = [];
    joinedMembers.forEach((joinedMember) => {
      userIds.push(joinedMember.userId);
    });

    console.log(joinedMembers);

    if (userId) {
      await setJoined([postId], userId);
    }

    return res.json({ data: userIds, count });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};


const getUserLikedPosts = async (req, res) => {
  try {
    const likerId = req.params.id;
    const { userId } = req.body;
    let { page, sortBy } = req.query;

    if (!sortBy) sortBy = "-createdAt";
    if (!page) page = 1;

    let posts = await PostLike.find({ userId: likerId })
      .sort(sortBy)
      .populate({ path: "postId", populate: { path: "poster" } })
      .lean();

    posts = paginate(posts, 10, page);

    const count = posts.length;

    let responsePosts = [];
    posts.forEach((post) => {
      responsePosts.push(post.postId);
    });

    if (userId) {
      await setLiked(responsePosts, userId);
    }

    return res.json({ data: responsePosts, count });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const { userId} = req.body;

    let { followedIds, filterFollowed, page, sortBy, author, search, liked } = req.query;

    if (!sortBy) sortBy = "-createdAt";
    if (!page) page = 1;

    let posts = await Post.find()
      .populate("poster", "-password")
      .sort(sortBy)
      .lean();

    if (author) {
      posts = posts.filter((post) => post.poster.username == author);
    }

    if (search) {
      posts = posts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filtrar por los IDs de los usuarios seguidos
    if (followedIds && followedIds.length > 0) {
      posts = posts.filter((post) => followedIds.includes(post.poster._id));
    }

    const count = posts.length;

    posts = paginate(posts, 10, page);

    if (userId) {
      await setLiked(posts, userId);
    }

    return res.json({ data: posts, count });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const joinPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("El post no existe");
    }

    const existingPostJoin = await PostJoin.findOne({ postId, userId });

    if (existingPostJoin) {
      throw new Error("El usuario ya se ha apuntado al post");
    }

    await PostJoin.create({
      postId,
      userId,
    });

    post.joinCount = (await PostJoin.find({ postId })).length;

    await post.save();

    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const unjoinPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("El post no existe");
    }

    const existingPostJoin = await PostJoin.findOne({ postId, userId });

    if (!existingPostJoin) {
      throw new Error("El usuario ya se ha apuntado al post");
    }

    await existingPostJoin.remove();

    post.joinCount = (await PostJoin.find({ postId })).length;

    await post.save();

    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("El post no existe");
    }

    const existingPostLike = await PostLike.findOne({ postId, userId });

    if (existingPostLike) {
      throw new Error("El post ya ha sido gustado");
    }

    await PostLike.create({
      postId,
      userId,
    });

    post.likeCount = (await PostLike.find({ postId })).length;

    await post.save();

    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("El post no existe");
    }

    const existingPostLike = await PostLike.findOne({ postId, userId });

    if (!existingPostLike) {
      throw new Error("El post ya ha sido gustado");
    }

    await existingPostLike.remove();

    post.likeCount = (await PostLike.find({ postId })).length;

    await post.save();

    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  joinPost,
  unjoinPost,
  likePost,
  unlikePost,
  getUsersJoinedPost,
  getUserLikedPosts,
};
