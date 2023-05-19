import WhatshotIcon from '@mui/icons-material/Whatshot';
import { Card, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import "react-icons/md";
import { getPosts } from "../../api/posts";
import { isLoggedIn } from "../../helpers/authHelper";
import HorizontalStack from "../_more_components/HorizontalStack";
import Loading from "../_more_components/Loading";
import PostCard from "./PostCard";

const TopPostsCard = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState(null);
  const user = isLoggedIn();

  const fetchPosts = async () => {
    const query = { sortBy: "-likeCount" };

    const data = await getPosts(user && user.token, query);

    const topPosts = [];

    if (data && data.data) {
      for (let i = 0; i < 3 && i < data.data.length; i++) {
        topPosts.push(data.data[i]);
      }
    }

    setPosts(topPosts);

    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Stack spacing={2}>
     
      <Stack spacing={2}>
        <HorizontalStack>
          <WhatshotIcon />
          <Typography fontWeight="500">Top actividades</Typography>
        </HorizontalStack>

      
      {!loading ? (
        posts &&
        posts.map((post) => (
          <PostCard preview="secondary" post={post} key={post._id} />
        ))
      ) : (
        <Loading />
      )}
      </Stack>
      
    </Stack>
  );
};

export default TopPostsCard;
