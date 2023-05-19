import { Container } from "@mui/material";
import PostsView from "components/views/PostsView";
import GridLayout from "../_more_components/GridLayout";
import SidebarHome from "../sidebar/SidebarHome";
import Navbar from "./Navbar";

const HomePage = () => {
  return (
    <Container>
      <Navbar />
      <GridLayout
        left={<PostsView isHome={true} createPost contentType="posts" />}
        right={<SidebarHome />}
      />
    </Container>
  );
};

export default HomePage;
