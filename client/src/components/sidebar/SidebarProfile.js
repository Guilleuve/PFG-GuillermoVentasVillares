import { useTheme } from "@emotion/react";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { follow, getFollowers, getFollowing, unfollow } from "api/users";
import ErrorAlert from "components/_more_components/ErrorAlert";
import HorizontalStack from "components/_more_components/HorizontalStack";
import Loading from "components/_more_components/Loading";
import UserImage from "components/_more_components/UserImage";
import { motion } from "framer-motion";
import { isLoggedIn } from "helpers/authHelper";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SidebarProfile = (props) => {
  const { preview } = props;
  const [serverError, setServerError] = useState("");
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [usersFollowers, setUsersFollowers] = useState([]);
  const [usersFollowing, setUsersFollowing] = useState([]);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [followersPage, setFollowersPage] = useState(1);
  const [followersEnd, setFollowersEnd] = useState(false);
  const [followingPage, setFollowingPage] = useState(1);
  const [followingEnd, setFollowingEnd] = useState(false);
  const [count, setCount] = useState(0);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [error, setError] = useState("");
  const currentUser = isLoggedIn();
  const [user, setUser] = useState(currentUser?.userId || null);
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;

  const navigate = useNavigate();
  const params = useParams();
  
  const [shouldFetchFollowers, setShouldFetchFollowers] = useState(false);
  const [shouldFetchFollowing, setShouldFetchFollowing] = useState(false);

  useEffect(() => {
    setLoadingFollowers(true);
    setLoadingFollowing(true);
    if (props.profile && props.profile.user) {
      setUser(props.profile.user);
      setShouldFetchFollowers(true);
      setShouldFetchFollowing(true);
      if (!currentUser){
        navigate("/login");
      }
    }
    setLoadingFollowers(false);
    setLoadingFollowing(false);
  }, [props.profile]);

  useEffect(() => {
    if (shouldFetchFollowers) {
      fetchFollowers();
      setShouldFetchFollowers(false);
    }
    if (shouldFetchFollowing) {
      fetchFollowing();
      setShouldFetchFollowing(false);
    }
    
    // Verificar si user._id está en usersFollowers
    if (usersFollowers.some(follower => follower.followerId._id.toString() === isLoggedIn().userId)) {
      setIsFollowingUser(true);
    } else {
      setIsFollowingUser(false);
    }
    
  }, [shouldFetchFollowers, shouldFetchFollowing, usersFollowers]);

  const fetchFollowers = async () => {
    setLoadingFollowers(true);
    try {
      const newPage = followersPage + 1;
      setFollowersPage(newPage);
  
      let query = {
        page: followersPage,
        sortBy,
      };
  
      const data = await getFollowers(user._id, query);
      if (data.data.length === 0) {
        setFollowersEnd(true);
        return;
      }
      
      if (!data.error) {
        setUsersFollowers([...usersFollowers, ...data.data]);
        setCount(data.count);
        setFollowersPage(followersPage + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const fetchFollowing = async () => {
    setLoadingFollowing(true);
    try {
      const newPage = followingPage + 1;
      setFollowingPage(newPage);
  
      let query = {
        page: followingPage,
        sortBy,
      };
  
      const dataFollowing = await getFollowing(user._id, query);
      if (dataFollowing.data.length === 0) {
        setFollowingEnd(true);
        return;
      }
  
      if (!dataFollowing.error) {
        setUsersFollowing([...usersFollowing, ...dataFollowing.data]);
        setCount(dataFollowing.count);
        setFollowingPage(followingPage + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingFollowing(false);
    }
  };

  const handleLoadMoreFollowers = () => {
    if (loadingFollowers || followersEnd) return;
    fetchFollowers();
  };

  const handleLoadMoreFollowing = () => {
    if (loadingFollowing || followingEnd) return;
    fetchFollowing();
  };

  const followUser = async (followerId, followedId) => {
    try {
      await follow(followerId, followedId);
      
    } catch (error) {
      console.log(error);
    }
  };
  
  const unfollowUser = async (followerId, followedId) => {
    try {
      await unfollow(followerId, followedId);
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack spacing={2}>
          <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, delay: 2 }}
    transition={{
      ease: 'easeInOut',
      duration: 3,
      delay: 0.15,
    }}
    className="container mx-auto sm:mt-10"
  >
{currentUser && user._id !== currentUser.userId && (
            <HorizontalStack>
            <Button
            fullWidth
            sx={{
              color: "white",
              backgroundColor: primaryLight,
              "&:hover": {
                backgroundColor: primaryDark,
                color: "white"
              },
            }}
            onClick={() => {
              if (isFollowingUser) {
                unfollowUser(isLoggedIn().userId, user._id);
              } else {
                followUser(isLoggedIn().userId, user._id);
              }
              window.location.reload();
            }}
          >
            {isFollowingUser ? (
              <>
                Dejar de seguir
                <PersonRemoveOutlined sx={{ color: "white" }} />
              </>
            ) : (
              <>
                Seguir
                <PersonAddOutlined sx={{ color: "white" }} />
              </>
            )}
          </Button>
            <ErrorAlert error={serverError} />
            </HorizontalStack>
      )}
  </motion.div>
      
      <Card>
        <Typography fontWeight="500" sx={{ mb: "1.5rem" }}>
          Seguidores
        </Typography>
        <Box className={preview}>
          <Box display="flex" flexDirection="column" gap="1.5rem">
            {loadingFollowers ? (
              <Loading />
            ) : (
              usersFollowers.map((follower) => (
                <HorizontalStack
                  onClick={() => 
                    {
                      navigate(`/users/${follower.followerId.username}`);
                      window.location.reload();
                    }
                  } 
                  sx={{
                    justifyContent: "space-between",
                    "&:hover": {
                      cursor: "pointer",
                    }
                  }}
                  key={follower._id}
                  
                >
                  <HorizontalStack>
                    <UserImage
                      image={follower.followerId.picturePath}
                      size={30}
                    />
                    <Typography variant="subtitle">
                      {follower.followerId.firstname} {follower.followerId.lastname}
                    </Typography>
                    
                  </HorizontalStack>
                </HorizontalStack>
              ))
            )}
            {!loadingFollowers && usersFollowers.length === 0 && (
              <Typography>No tiene seguidores aún</Typography>
            )}
            {!loadingFollowers && usersFollowers.length > 0 && !followersEnd && (
              <Box display="flex" justifyContent="left">
                <Button color="primary" onClick={handleLoadMoreFollowers}>
                  Cargar más
                </Button>
              </Box>
            )}
            
          </Box>
        </Box>
      </Card>

      <Card>
        <Typography fontWeight="500" sx={{ mb: "1.5rem" }}>
          Siguiendo
        </Typography>
          
        <Box className={preview}>
          <Box display="flex" flexDirection="column" gap="1.5rem">
            {loadingFollowing ? (
              <Loading />
            ) : (
              usersFollowing.map((following) => (
                <HorizontalStack
                  onClick={() => 
                    {
                      navigate(`/users/${following.followedId.username}`);
                      window.location.reload();
                    }
                    } 
                    sx={{
                      justifyContent: "space-between",
                      "&:hover": {
                        cursor: "pointer",
                      }
                    }}
                  key={following._id}
                >
                  <HorizontalStack>
                    <UserImage
                      image={following.followedId.picturePath}
                      size={30}
                    />
                    <Typography variant="subtitle">
                      {following.followedId.firstname} {following.followedId.lastname}
                    </Typography>
                    
                  </HorizontalStack>
                </HorizontalStack>
              ))
            )}
            {!loadingFollowing && usersFollowing.length === 0 && (
              <Typography>No sigue a ningún usuario</Typography>
            )}
            {!loadingFollowing && usersFollowing.length > 0 && !followingEnd && (
              <Box display="flex" justifyContent="left">
                <Button color="primary" onClick={handleLoadMoreFollowing}>
                  Cargar más
                </Button>
              </Box>
            )}
            
          </Box>
        </Box>
      </Card>
    </Stack>
  );
};

export default SidebarProfile;