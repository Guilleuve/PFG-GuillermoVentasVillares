import { Container, Stack } from "@mui/material";
import PostJoined from "components/cards/PostJoinedCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../../api/posts";
import { isLoggedIn } from "../../helpers/authHelper";
import ErrorAlert from "../_more_components/ErrorAlert";
import GoBack from "../_more_components/GoBack";
import GridLayout from "../_more_components/GridLayout";
import Loading from "../_more_components/Loading";
import PostCard from "../cards/PostCard";
import Sidebar from "../sidebar/SidebarHome";
import CommentsView from "../views/CommentsView";
import Navbar from "./Navbar";

const PostPage = () => {
  const params = useParams();

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const user = isLoggedIn();

  const fetchPost = async () => {
    setLoading(true);
    const data = await getPost(params.id, user && user.token);
    if (data.error) {
      setError(data.error);
    } else {
      setPost(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  return (
    <Container>
      <Navbar />
      <GoBack />
      <GridLayout
        left={
          loading ? (
            <Loading />
          ) : post ? (
            <Stack spacing={2}>
              <PostCard post={post} key={post._id} />
              <PostJoined post={post} key={post._id} />
              <CommentsView/>
            </Stack>
          ) : (
            error && <ErrorAlert error={error} />
          )
        }
        right={<Sidebar />}
      />
    </Container>
  );
};

export default PostPage;
