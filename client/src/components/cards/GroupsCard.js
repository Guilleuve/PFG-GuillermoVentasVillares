import {
  Card,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import HorizontalStack from "components/_more_components/HorizontalStack";

  const GroupsCard = () => {
    return (
      <Card>
        <Box >
            <HorizontalStack spacing={0} alignItems="initial">
                
                <Typography
                    //color={palette.neutral.dark}
                    //variant="h5"
                    fontWeight="500"
                    sx={{ mb: "1.5rem" }}
                >
                    Grupos
                </Typography>
                <Box display="flex" flexDirection="column" gap="1.5rem">
                  
                </Box>
            
            </HorizontalStack>
              
        </Box>
      </Card>
      
    );
};
  
export default GroupsCard;