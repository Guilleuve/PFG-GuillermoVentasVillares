import {
  Box,
  Button,
  Card,
  Typography,
  useTheme,
} from "@mui/material";
import { getUsersJoinedPost, joinPost, unjoinPost } from "api/posts";
import HorizontalStack from "components/_more_components/HorizontalStack";
import JoinBox from "components/_more_components/JoinBox";
import Loading from "components/_more_components/Loading";
import UserImage from "components/_more_components/UserImage";
import { motion } from "framer-motion";
import { isLoggedIn } from "helpers/authHelper";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PostJoinedCard = (props) => {
  const { preview } = props;
  const postData = props.post;
  const [loading, setLoading] = useState(false);
  const user = isLoggedIn();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [end, setEnd] = useState(false);
  const [count, setCount] = useState(0);
  const [sortBy, setSortBy] = useState("-createdAt");

  const theme = useTheme();
  //const iconColor = theme.palette.primary.main;

  const [post, setPost] = useState(postData);
  const [joinCount, setJoinCount] = useState(post.joinCount);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const newPage = page + 1;
      setPage(newPage);

      let query = {
        page: page,
        sortBy,
      };

      const data = await getUsersJoinedPost(
        props.post._id,
        user && user.token,
        query,
      );
      if (data.data.length === 0) {
        setEnd(true);
        return;
      }
      
      if (!data.error) {
        setUsers([...users, ...data.data]);
        setCount(data.count);
        setPage(page + 1);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLoadMore = () => {
    if (loading || end) return;
    fetchUsers();
  };

  
  let maxHeight = null;
  if (preview === "primary") {
    maxHeight = 250;
  }

    const handleJoin = async (joined) => {
    if (joined) {
      setJoinCount(joinCount + 1);
      await joinPost(post._id, user);
    } else {
      setJoinCount(joinCount - 1);
      await unjoinPost(post._id, user);
    }
    window.location.reload(false);
  };

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, delay: 1 }}
    transition={{
      ease: 'easeInOut',
      duration: 2,
      delay: 0.15,
    }}
    className="container mx-auto mt-5 sm:mt-10"
  >
    <Card>
      {preview !== "primary" && preview !== "secondary" && (
      <JoinBox
            joinCount={joinCount}
            joined={post.joined}
            onJoin={handleJoin}
      />
      )}
      <Box className={preview}>
      
          <Box display="flex" flexDirection="column" gap="1.5rem">
            {users.map((user) => (
              <HorizontalStack
                justifyContent="space-between"
                key={user._id}
              >
                <HorizontalStack >
                  <UserImage image={user.picturePath} size={30}/>
                  <Typography variant="subtitle" >
                    {user.firstname} {user.lastname}
                  </Typography>
                  <Link to={`/users/${user.username}`}>Ver perfil</Link>
                </HorizontalStack>
                
              </HorizontalStack>
            ))}
            {loading && <Loading />}
            {!loading && users.length === 0 && (
              <Typography>No hay usuarios apuntados todavía.</Typography>
            )}
            {!loading && users.length > 0 && !end && (
              <Box
                display="flex"
                justifyContent="left"
                
              >
                <Button
                  color="primary"
                  onClick={handleLoadMore}
                >
                  Cargar más
                </Button>

                </Box>
            )}
            {!loading && users.length > 0 && end && (
              <Typography>Todos los usuarios han sido cargados.</Typography>
            )}
          </Box>
      </Box>
    </Card>
    </motion.div>
    );
};
  
export default PostJoinedCard;