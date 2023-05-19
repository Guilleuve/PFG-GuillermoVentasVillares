import { Card } from "@mui/material";
import { Box } from "@mui/system";
import Copyright from "../_more_components/Copyright";

const FooterCard = () => {
  return (
    <Box pb={3}>
      <Card>
        <Copyright />
      </Card>
    </Box>
  );
};

export default FooterCard;
