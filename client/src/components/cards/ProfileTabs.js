import { Card, Tab, Tabs } from "@mui/material";
import { motion } from "framer-motion";

const ProfileTabs = (props) => {
  const handleChange = (e, newValue) => {
    props.setTab(newValue);
  };

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, delay: 1 }}
    transition={{
      ease: 'easeInOut',
      duration: 0.8,
      delay: 0.15,
    }}
    className="container mx-auto mt-5 sm:mt-10"
  >
    <Card sx={{ padding: 0 }}>
      <Tabs value={props.tab} onChange={handleChange} variant="scrollable">
        <Tab label="Publicado" value="posts" />
        <Tab label="le ha gustado" value="liked" />
      </Tabs>
    </Card>
    </motion.div>
  );
};

export default ProfileTabs;
