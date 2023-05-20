import { Button, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getComments } from "../../api/posts";
import HorizontalStack from "../_more_components/HorizontalStack";
import Loading from "../_more_components/Loading";
import Comment from "../cards/CommentCard";
import CommentEditor from "../cards/CommentEditorCard";

const CommentsView = () => {
  const [comments, setComments] = useState(null);
  const [rerender, setRerender] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const [showCommentEditor, setShowCommentEditor] = useState(false);

  const handleShowComment = () => {
    setShowCommentEditor(true);
  };

  const fetchComments = async () => {
    const data = await getComments(params);
    if (data.error) {
      setError("Error al cargar los comentarios");
    } else {
      setComments(data);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const findComment = (id) => {
    let commentToFind;

    const recurse = (comment, id) => {
      console.log(comment);
      if (comment._id === id) {
        commentToFind = comment;
      } else {
        for (let i = 0; i < comment.children.length; i++) {
          const commentToSearch = comment.children[i];
          recurse(commentToSearch, id);
        }
      }
    };

    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      recurse(comment, id);
    }

    return commentToFind;
  };

  const removeComment = (removedComment) => {
    if (removedComment.parent) {
      const parentComment = findComment(removedComment.parent);
      parentComment.children = parentComment.children.filter(
        (comment) => comment._id !== removedComment._id
      );
      setRerender(!rerender);
    } else {
      setComments(
        comments.filter((comment) => comment._id !== removedComment._id)
      );
    }
  };

  const editComment = (editedComment) => {
    if (editedComment.parent) {
      let parentComment = findComment(editedComment.parent);
      for (let i = 0; i < parentComment.children.length; i++) {
        if (parentComment.children[i]._id === editedComment._id) {
          parentComment.children[i] = editedComment;
        }
      }
    } else {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i]._id === editedComment._id) {
          comments[i] = editedComment;
        }
      }
      setRerender(!rerender);
    }
  };
  

  const addComment = (comment) => {
    if (comment.parent) {
      console.log(comment.parent);
      const parentComment = findComment(comment.parent);
      parentComment.children = [comment, ...parentComment.children];

      setRerender(!rerender);
    } else {
      setComments([comment, ...comments]);
    }
  };


  return comments ? (
  <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, delay: 1 }}
        transition={{
          ease: 'easeInOut',
          duration: 1,
          delay: 0.15,
        }}
        className="container mx-auto mt-5 sm:mt-10"
      >
<Stack spacing={2}>
<>
      {!showCommentEditor && (
        <HorizontalStack justifyContent="flex">
          <Button
            variant="primary"
            onClick={handleShowComment}
            sx={{
              color:"#0062b1",
              width: "100%",
              height: "100%",
            }}
          >
            <span>Añade un comentario</span>
          </Button>
        </HorizontalStack>
      )}

      {showCommentEditor && (
        <CommentEditor addComment={addComment} label="Escribe un comentario" />
      )}
    </>
      
      

      {comments.length > 0 ? (
        <Box pb={4}>
          {comments.map((comment, i) => (
            <Comment
              addComment={addComment}
              removeComment={removeComment}
              editComment={editComment}
              comment={comment}
              key={comment._id}
              depth={0}
            />
          ))}
          {loading && <Loading />}
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          textAlign="center"
          paddingY={3}
        >
          <Box>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No hay comentarios
            </Typography>
          </Box>
        </Box>
      )}
    </Stack>

      </motion.div>
    
  ) : (
    <Loading label="Loading comments" />
  );
};

export default CommentsView;
