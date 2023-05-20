import {
  Card,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getRandomUsers } from "../../api/users";
import HorizontalStack from "../_more_components/HorizontalStack";
import Loading from "../_more_components/Loading";
import UserImage from "../_more_components/UserImage";

const FindUsersCard = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getRandomUsers({ size: 5 });
    setLoading(false);
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleClick = () => {
    fetchUsers();
  };

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, delay: 1 }}
    transition={{
      ease: 'easeInOut',
      duration: 0.6,
      delay: 0.15,
    }}
    className="container mx-auto mt-5 sm:mt-10"
  >
    <Card>
      <Stack spacing={2}>
        <HorizontalStack justifyContent="space-between">
          <HorizontalStack>
            <AiOutlineUser />
            <Typography>Otros usuarios</Typography>
          </HorizontalStack>
          <IconButton
            sx={{ padding: 0 }}
            disabled={loading}
            onClick={handleClick}
          >
            <MdRefresh />
          </IconButton>
        </HorizontalStack>

        <Divider />

        {loading ? (
          <Loading />
        ) : (
          users &&
          users.map((user) => (
            <>
            <HorizontalStack 
            onClick={() => navigate(`/users/${user.username}`)}  
            sx={{
              justifyContent: "space-between",
              "&:hover": {
                cursor: "pointer",
              }
            }}
            key={user._id}
            >
              <HorizontalStack>
                <UserImage image={user.picturePath} size={"30px"}/>
                <Typography 
                
                fontSize="lg"
                fontWeight={"400"}
                >{user.firstname} {user.lastname} {"\n"} </Typography>
                
              </HorizontalStack>
            </HorizontalStack>
            </>
          ))
        )}
      </Stack>
    </Card>
    </motion.div>
  );
};

export default FindUsersCard;
