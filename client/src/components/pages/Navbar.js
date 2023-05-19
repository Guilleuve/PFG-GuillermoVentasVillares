import { useTheme } from "@emotion/react";
import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import "react-icons/ai";
import {
  AiFillMessage,
  AiOutlineSearch
} from "react-icons/ai";
import "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logoutUser } from "../../helpers/authHelper";
import HorizontalStack from "../_more_components/HorizontalStack";
import UserImage from "../_more_components/UserImage";


const Navbar = () => {
  const navigate = useNavigate();
  const user = isLoggedIn();
  const theme = useTheme();
  const username = user && isLoggedIn().username;
  const [search, setSearch] = useState("");
  const [searchIcon, setSearchIcon] = useState(false);
  const [width, setWindowWidth] = useState(0);

  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const mobile = width < 500;
  const navbarWidth = width < 600;

  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };

  const handleLogout = async (e) => {
    logoutUser();
    navigate("/login");
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/search?" + new URLSearchParams({ search }));
  };

  const handleSearchIcon = (e) => {
    setSearchIcon(!searchIcon);
  };

  return (
    <Stack mb={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pt: 2,
          pb: 0,
        }}
        spacing={!mobile ? 2 : 0}
      >
        <Box
        width="100%"
      >
        <Typography fontWeight="300" fontSize="40px" color="black"
        onClick={() => navigate("/")}
        sx={{
          "&:hover": {
            color: "#0062B1",
            cursor: "pointer",
          },
        }}>
        cooltrainer.
        </Typography>
        
      </Box>

        {!navbarWidth && (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              size="small"
              label="Buscar actividades"
              sx={{ flexGrow: 1, maxWidth: 300 }}
              onChange={handleChange}
              value={search}
            />
          </Box>
        )}

        <HorizontalStack>
          {mobile && (
            <IconButton onClick={handleSearchIcon}>
              <AiOutlineSearch />
            </IconButton>
          )}

          {user ? (
            <>
              <IconButton component={Link} to={"/messenger"}>
                <AiFillMessage />
              </IconButton>

              <IconButton component={Link} to={"/users/" + username} onClick={() => {
                navigate(`/users/${username}`);
                window.location.reload();
              }}>
                <UserImage image={user.picturePath} size={30}/>
              </IconButton>
            </>
          ) : (
            <>
              <Button variant="text" sx={{ minWidth: 80 }} href="/register">
                Registrarse
              </Button>
              <Button variant="text" sx={{ minWidth: 65 }} href="/login">
                Iniciar sesión
              </Button>
            </>
          )}
        </HorizontalStack>
      </Stack>
      {navbarWidth && searchIcon && (
        <Box component="form" onSubmit={handleSubmit} mt={2}>
          <TextField
            size="small"
            label="Buscar actividades"
            fullWidth
            onChange={handleChange}
            value={search}
          />
        </Box>
      )}
    </Stack>
  );
};

export default Navbar;
