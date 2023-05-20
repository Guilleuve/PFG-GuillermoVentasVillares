import { Stack } from "@mui/material";
import { motion } from "framer-motion";
import FindUsers from "../cards/FindUsersCard";
import Footer from "../cards/FooterCard";
import TopPosts from "../cards/TopPostsCard";

const SidebarHome = () => {
  return (
    <motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1, delay: 1 }}
			transition={{
				ease: 'easeInOut',
				duration: 1,
				delay: 0.15,
			}}
			className="container mx-auto mt-5 sm:mt-10"
		>
        <Stack spacing={2}>
        <TopPosts />
        <FindUsers />
        <Footer />
      </Stack>
    </motion.div>

  );
};

export default SidebarHome;
