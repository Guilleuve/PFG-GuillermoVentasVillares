import { Box, Divider, List, Stack, Typography } from "@mui/material";
import { AiFillMessage } from "react-icons/ai";
import "react-icons/bi";
import { BiSad } from "react-icons/bi";
import HorizontalStack from "../_more_components/HorizontalStack";
import Loading from "../_more_components/Loading";
import UserMessengerEntry from "./UserMessengerEntry";

const UserMessengerEntries = (props) => {
  return !props.loading ? (
    <>
      {props.conversations.length > 0 ? (
        <Stack>
          <HorizontalStack
            alignItems="center"
            spacing={2}
            sx={{ px: 2, height: "60px" }}
          >
            <AiFillMessage size={30} />
            <Typography>
              <b>Conversaciones</b>
            </Typography>
          </HorizontalStack>
          <Divider />
          <Box sx={{ height: "calc(100vh - 171px)" }}>
            <Box sx={{ height: "100%" }}>
              <List sx={{ padding: 0, maxHeight: "100%", overflowY: "auto" }}>
                {props.conversations.map((conversation) => (
                  <UserMessengerEntry
                    conservant={props.conservant}
                    conversation={conversation}
                    key={conversation.recipient.username}
                    setConservant={props.setConservant}
                  />
                ))}
              </List>
            </Box>
          </Box>
        </Stack>
      ) : (
        <Stack
          sx={{ height: "100%" }}
          justifyContent="center"
          alignItems="center"
          spacing={2}
          textAlign="center"
        >
          <BiSad size={60} />
          <Typography variant="h5">No hay conversaciones</Typography>
          <Typography color="text.secondary" sx={{ maxWidth: "70%" }}>
            Haz click en "Enviar mensaje" en el perfil del usuario para comenzar una conversación
          </Typography>
        </Stack>
      )}
    </>
  ) : (
    <Stack sx={{ height: "100%" }} justifyContent="center">
      <Loading />
    </Stack>
  );
};

export default UserMessengerEntries;
