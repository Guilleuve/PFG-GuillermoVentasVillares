import { Container } from "@mui/material";
import GoBack from "../_more_components/GoBack";
import GridLayout from "../_more_components/GridLayout";
import PostEditor from "../cards/PostEditorCard";
import Sidebar from "../sidebar/SidebarHome";
import Navbar from "./Navbar";

const CreatePostPage = () => {
  
  return (
    <Container>
      <Navbar />
      <GoBack />
      <GridLayout left={<PostEditor />} right={<Sidebar />} />
    </Container>
  );
};

export default CreatePostPage;
