import { Container, Stack } from "@mui/material";

import PostsView from "components/views/PostsView";
import GridLayout from "../_more_components/GridLayout";
import Sidebar from "../sidebar/SidebarHome";
import Navbar from "./Navbar";

const SearchPage = () => {
  return (
    <Container>
      <Navbar />
      <GridLayout
        left={
          <Stack spacing={2}>
            <PostsView createPost contentType="posts" />
          </Stack>
        }
        right={<Sidebar />}
      />
    </Container>
  );
};

export default SearchPage;
