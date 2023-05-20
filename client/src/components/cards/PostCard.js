import TextsmsIcon from '@mui/icons-material/Textsms';
import {
  Card,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { BASE_URL } from "config";
import { useState } from "react";
import { AiFillCheckCircle, AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { deletePost, joinPost, likePost, unjoinPost, unlikePost, updatePost } from "../../api/posts";
import { isLoggedIn } from "../../helpers/authHelper";
import ContentDetails from "./ContentDetails";

import HorizontalStack from "../_more_components/HorizontalStack";
import LikeBox from "../_more_components/LikeBox";
import PostContentBox from "./PostContentBox";

import { } from "react-icons/ai";
import Markdown from "../_more_components/Markdown";
import ContentUpdateEditor from "./ContentUpdateEditor";

import { BiTrash } from "react-icons/bi";
import { MdCancel } from "react-icons/md";
import "./postCard.css";

import { motion } from "framer-motion";

const PostCard = (props) => {
  const { preview, removePost } = props;
  let postData = props.post;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = isLoggedIn();
  const isAuthor = user && user.username === postData.poster.username;

  const theme = useTheme();
  const iconColor = theme.palette.primary.main;

  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [post, setPost] = useState(postData);
  const [joinCount, setJoinCount] = useState(post.joinCount);
  const [likeCount, setLikeCount] = useState(post.likeCount);


  let maxHeight = null;
  if (preview === "primary") {
    maxHeight = 250;
  }

  const handleDeletePost = async (e) => {
    e.stopPropagation();

    if (!confirm) {
      setConfirm(true);
    } else {
      setLoading(true);
      await deletePost(post._id, isLoggedIn());
      setLoading(false);
      if (preview) {
        removePost(post);
      } else {
        navigate("/");
      }
    }
  };

  const handleEditPost = async (e) => {
    e.stopPropagation();

    setEditing(!editing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = e.target.content.value;
    await updatePost(post._id, isLoggedIn(), { content });
    setPost({ ...post, content, edited: true });
    setEditing(false);
  };

  const handleJoin = async (joined) => {
    if (joined) {
      setJoinCount(joinCount + 1);
      await joinPost(post._id, user);
    } else {
      setJoinCount(joinCount - 1);
      await unjoinPost(post._id, user);
    }
  };

  const handleLike = async (liked) => {
    if (liked) {
      setLikeCount(likeCount + 1);
      await likePost(post._id, user);
    } else {
      setLikeCount(likeCount - 1);
      await unlikePost(post._id, user);
    }
  };

  return (
    <motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1, delay: 1 }}
			transition={{
				ease: 'easeInOut',
				duration: 0.5,
				delay: 0.15,
			}}
			className="container mx-auto mt-5 sm:mt-10"
		>

      <Card 
    //sx={{ backgroundColor: palette.primary.main }}
    >
      <Box className={preview}>
        <HorizontalStack spacing={0} alignItems="initial">
          
          <PostContentBox clickable={preview} post={post} editing={editing}>
            <HorizontalStack justifyContent="space-between">
              <ContentDetails
                picturePath={post.poster.picturePath}
                username={post.poster.username}
                actividad={post.actividad}
                location={post.location}
                date={post.date}
                createdAt={post.createdAt}
                edited={post.edited}
                preview={preview === "secondary"}
              />
              <Box>
                {user && (isAuthor || user.isAdmin) && preview !== "primary" && preview !== "secondary" && (
                  <HorizontalStack>
                    <IconButton
                      disabled={loading}
                      size="small"
                      onClick={handleEditPost}
                    >
                      {editing ? (
                        <MdCancel color={iconColor} />
                      ) : (
                        <AiFillEdit color={iconColor} />
                      )}
                    </IconButton>
                    <IconButton
                      disabled={loading}
                      size="small"
                      onClick={handleDeletePost}
                    >
                      {confirm ? (
                        <AiFillCheckCircle color={theme.palette.error.main} />
                      ) : (
                        <BiTrash color={theme.palette.error.main} />
                      )}
                    </IconButton>
                  </HorizontalStack>
                )}
              </Box>
            </HorizontalStack>

            <Typography
              variant="h5"
              gutterBottom
              sx={{ overflow: "hidden", mt: 1, maxHeight: 125 }}
              className="title"
            >
              {post.title}
            </Typography>

            {preview !== "secondary" &&
              (editing ? (
                <ContentUpdateEditor
                  handleSubmit={handleSubmit}
                  originalContent={post.content}
                />
              ) : (
                <Box
                  maxHeight={maxHeight}
                  overflow="hidden"
                  className="content"
                >
                  <Markdown content={post.content} />
                </Box>
              ))}

            {preview !== "secondary" && post.picturePath && (
              <img
                width="100%"
                height="auto"
                alt="post"
                style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
                src={`${BASE_URL}assets/${post.picturePath}`}
              />
            )}
            
          </PostContentBox>
        </HorizontalStack>
        <HorizontalStack sx={{ mt: 1 }}>
            <LikeBox
              likeCount={likeCount}
              liked={post.liked}
              onLike={handleLike}
            />

            <IconButton sx={{ padding: 1 }}>
              <TextsmsIcon />
            </IconButton>
            <Typography>
              {post.commentCount}
            </Typography>
            </HorizontalStack>
            
      </Box>
    </Card>
    </motion.div>
    
  );
};

export default PostCard;
