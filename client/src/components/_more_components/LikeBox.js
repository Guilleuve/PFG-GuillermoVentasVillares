import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
} from "@mui/icons-material";
import { IconButton, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { IconContext } from "react-icons/lib";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../helpers/authHelper";
import HorizontalStack from "./HorizontalStack";

const LikeBox = (props) => {
  const { likeCount, onLike } = props;
  const theme = useTheme();
  const [liked, setLiked] = useState(props.liked);

  const navigate = useNavigate();

  const handleLike = (e) => {
    if (isLoggedIn()) {
      const newLikedValue = !liked;
      setLiked(newLikedValue);
      onLike(newLikedValue);
    } else {
      navigate("/login");
    }
  };

  return (
    <HorizontalStack >
      <IconButton sx={{ padding: 1 }} onClick={handleLike}>
        {liked ? (
          <IconContext.Provider>
            <FavoriteOutlined sx={{ color: "#0062B1" }} />
          </IconContext.Provider>
        ) : (
          <FavoriteBorderOutlined />
        )}
      </IconButton>
      <Typography>{likeCount}</Typography>
    </HorizontalStack>
  );
};

export default LikeBox;
