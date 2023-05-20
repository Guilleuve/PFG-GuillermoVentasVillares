import { Button, MenuItem, Select, Stack, Typography } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Box } from "@mui/system";
import { getFollowing } from "api/users";
import { format, isToday } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPosts, getUserLikedPosts } from "../../api/posts";
import { isLoggedIn } from "../../helpers/authHelper";
import HorizontalStack from "../_more_components/HorizontalStack";
import Loading from "../_more_components/Loading";
import PostCard from "../cards/PostCard";

const PostsView = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [end, setEnd] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [count, setCount] = useState(0);
  const user = isLoggedIn();
  const navigate = useNavigate();
  const [today, setToday] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showFollowedPosts, setShowFollowedPosts] = useState(false);
  const [search] = useSearchParams();
  const [effect, setEffect] = useState(false);

  const searchExists =
    search && search.get("search") && search.get("search").length > 0;

    const fetchPosts = async () => {
      setLoading(true);
      const newPage = page + 1;
      setPage(newPage);
    
      let query = {
        page: newPage,
        sortBy,
      };

      let following= [];
      let filterFollowed = false;
      
      if (showFollowedPosts) {
        const followingResponse = await getFollowing(user.userId);
        following = followingResponse.data;
        query.followedIds = following.map((item) => item.followedId._id);
        filterFollowed = true;
      }
      else {
        filterFollowed = false;
      }

      query.filterFollowed = filterFollowed;

      //console.log(query.followedIds);
    
      if (selectedFilter === "today") {
        query.date = today;
      } else if (selectedFilter === "next5days") {
        const currentDate = new Date();
        const futureDate = new Date();
        futureDate.setDate(currentDate.getDate() + 5);
        const formattedStartDate = format(currentDate, "yyyy-MM-dd");
        const formattedEndDate = format(futureDate, "yyyy-MM-dd");
        query.startDate = formattedStartDate;
        query.endDate = formattedEndDate;
      } else if (selectedFilter === "next30days") {
        const currentDate = new Date();
        const futureDate = new Date();
        futureDate.setDate(currentDate.getDate() + 30);
        const formattedStartDate = format(currentDate, "yyyy-MM-dd");
        const formattedEndDate = format(futureDate, "yyyy-MM-dd");
        query.startDate = formattedStartDate;
        query.endDate = formattedEndDate;
      } else if (selectedFilter === "previous") {
        const formattedEndDate = format(new Date(), "yyyy-MM-dd");
        query.endDate = formattedEndDate;
      }

      let data;

      if (props.contentType === "posts") {
        if (props.profileUser) query.author = props.profileUser.username;
        if (searchExists) query.search = search.get("search");
  
        data = await getPosts(user && user.token, query);
      } else if (props.contentType === "liked") {
        data = await getUserLikedPosts(
          props.profileUser._id,
          user && user.token,
          query
        );
      }
  
      if (data.data.length < 10) {
        setEnd(true);
      }
  
      setLoading(false);
      if (!data.error) {
        setPosts([...posts, ...data.data]);
        setCount(data.count);
      }
    };

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, "yyyy-MM-dd");
    setToday(formattedDate);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [sortBy, effect]);

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setEnd(false);
    setEffect(!effect);
  }, [showFollowedPosts, search]);

  const handleSortBy = (e) => {
    const newSortName = e.target.value;
    let newSortBy;

    Object.keys(sorts).forEach((sortName) => {
      if (sorts[sortName] === newSortName) newSortBy = sortName;
    });

    setPosts([]);
    setPage(0);
    setEnd(false);
    setSortBy(newSortBy);
  };
  
  const handleShowFollowedPosts = () => {
    setShowFollowedPosts(true);
    // Realiza cualquier otra acción necesaria
  };

  const handleShowAllPosts = () => {
    setShowFollowedPosts(false);
    // Realiza cualquier otra acción necesaria
  };

  const removePost = (removedPost) => {
    setPosts(posts.filter((post) => post._id !== removedPost._id));
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const contentTypeSorts = {
    posts: {
      date: "En orden",
      "-likeCount": "Más gustados",
      "-commentCount": "Más comentarios",
    },
    liked: {
      date: "En orden",
      "-createdAt": "Últimos",
      createdAt: "Primeros",
    },
  };

  const sorts = contentTypeSorts[props.contentType];

  return (
    <>
    <HorizontalStack justifyContent="space-between">
          <Button onClick={() => navigate("/posts/create")}
            sx={{
              gridColumn: "span 6",
              color: "white",
              backgroundColor: "#0062B1",
              "&:hover": {
                backgroundColor: "#01335b",
              },
              height: "100%",
            }}
            >
            <span>Nuevo Post</span>
          </Button>
          <HorizontalStack spacing={1}>
          <Typography color="text.secondary" variant="subtitle2">
              Filtrar por:
            </Typography>
            <Select
            size="small"
            value={selectedFilter}
            sx={{ minWidth: 150 }}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <MenuItem value="all">Todas (a partir de hoy)</MenuItem>
            <MenuItem value="today">Hoy</MenuItem>
            <MenuItem value="next5days">Próximos 5 días</MenuItem>
            <MenuItem value="next30days">Próximos 30 días</MenuItem>
            <MenuItem value="previous">Ya realizadas</MenuItem>
          </Select>
            
            <Select
              size="small"
              value={sorts[sortBy]}
              sx={{ minWidth: 150 }}
              onChange={handleSortBy}
            >
              {Object.keys(sorts).map((sortName, i) => (
                <MenuItem value={sorts[sortName]} key={i}>
                  {sorts[sortName]}
                </MenuItem>
              ))}
            </Select>
          </HorizontalStack>
          </HorizontalStack>
          <div style={{ marginTop: '1rem' }}></div>
          {props.isHome && (
          <ButtonGroup
            fullWidth
            disableElevation
            variant="outlined"
            aria-label="Disabled elevation buttons"
          >
            <Button
              disabled={!showFollowedPosts}
              onClick={handleShowAllPosts}
              style={{
                backgroundColor: !showFollowedPosts ? "#0062b1" : "#F6F6F6",
                color: !showFollowedPosts ? "#fff" : undefined
              }}
            >
              Todos
            </Button>
            <Button
              disabled={showFollowedPosts}
              onClick={handleShowFollowedPosts}
              style={{
                backgroundColor: showFollowedPosts ? "#0062b1" : "#F6F6F6",
                color: showFollowedPosts ? "#fff" : undefined
              }}
            >
              Seguidores
            </Button>
          </ButtonGroup>
          )}
          <div style={{ marginTop: '.8rem' }}></div>
    <motion.div
				initial={{ opacity: 0, y: -180 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ ease: 'easeInOut', duration: 0.9, delay: 0.2 }}
				className="w-full sm:w-2/3 text-right float-right mt-8 sm:mt-0"
			>
      <Stack spacing={2}>
          
        {searchExists && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Resultados encontrados para: "{search.get("search")}"
            </Typography>
            <Typography color="text.secondary" variant="span">
              {count} resultados
            </Typography>
          </Box>
        )}

{posts
  .filter((post) => {
    
    if (selectedFilter === "today") {
      return isToday(new Date(post.date));
    } else if (selectedFilter === "next5days") {
      const currentDate = new Date();
      const futureDate = new Date();
      futureDate.setDate(currentDate.getDate() + 5);
      const postDate = new Date(post.date);
      return postDate >= currentDate && postDate <= futureDate;
    } else if (selectedFilter === "next30days") {
      const currentDate = new Date();
      const futureDate = new Date();
      futureDate.setDate(currentDate.getDate() + 30);
      const postDate = new Date(post.date);
      return postDate >= currentDate && postDate <= futureDate;
    } else if (selectedFilter === "previous") {
      const postDate = new Date(post.date);
      return postDate < new Date();
    } else if (selectedFilter === "all") {
      const postDate = new Date(post.date);
      return postDate >= new Date();
    }
    return true;
  })
  .map((post, i) => (
    <PostCard
      preview="primary"
      key={post._id}
      post={post}
      removePost={removePost}
    />
  ))}
        {loading && <Loading />}
        {end ? (
          <Stack py={5} alignItems="center">
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {posts.length > 0 ? (
                <>No hay más posts disponibles</>
              ) : (
                <>No hay posts aún</>
              )}
            </Typography>
            <Button variant="text" size="small" onClick={handleBackToTop}>
              Volver arriba
            </Button>
          </Stack>
        ) : (
          !loading &&
          posts &&
          posts.length > 0 && (
            <Stack pt={2} pb={6} alignItems="center" spacing={2}>
              <Button onClick={fetchPosts} variant="contained">
                Cargar más
              </Button>
              <Button variant="text" size="small" onClick={handleBackToTop}>
                Volver arriba
              </Button>
            </Stack>
          )
        )}
      </Stack>
    </motion.div>
      
    </>
  );
};

export default PostsView;
