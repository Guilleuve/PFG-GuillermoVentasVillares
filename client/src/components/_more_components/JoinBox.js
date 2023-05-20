import { Button, Divider, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../helpers/authHelper";
import HorizontalStack from "./HorizontalStack";

const JoinBox = (props) => {
  const { joinCount, onJoin } = props;
  const theme = useTheme();
  const [joined, setJoined] = useState(props.joined);

  const navigate = useNavigate();

  const handleJoin = (e) => {
    if (isLoggedIn()) {
      const newJoinedValue = !joined;
      setJoined(newJoinedValue);
      onJoin(newJoinedValue);
    } else {
      navigate("/login");
    }
  };

  return (
    <box>
    <HorizontalStack>
        {joined ? (
          <Button
          onClick={handleJoin}
          variant="outlined"
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          <span>desapuntarse</span>
        </Button>
        ) : (
          <Button
          onClick={handleJoin}
          variant="outlined"
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          <span>apuntarse</span>
        </Button>
        )}
    </HorizontalStack>
    <Divider sx={{ mb: "1.5rem" }} />
    <Typography sx={{ mb: "1.5rem" }} fontWeight="500">Apuntados: {joinCount}</Typography>
    </box>
    
  );
};

export default JoinBox;
