import { Typography } from "@mui/material";
import { format, formatDistanceToNow } from 'date-fns';
import es from 'date-fns/locale/es';
import { Link } from "react-router-dom";
import HorizontalStack from "../_more_components/HorizontalStack";
import UserImage from "../_more_components/UserImage";

const ContentDetails = ({ picturePath, username, actividad, location, date, createdAt, edited, preview, isComment }) => {
// Convertir la fecha a un formato legible
const formattedCreatedAt = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: es }) : 'Fecha no disponible';
const formattedDate = date ? format(new Date(date), "d 'de' MMMM", { locale: es }) : 'Fecha no disponible';

  return (
    <>
    <HorizontalStack>
      { !preview && isComment && (
        <UserImage image={picturePath} size={"30px"} />
      )
      }
      {
        !preview && !isComment && (
          <UserImage image={picturePath} size={"50px"} />
        )
      }
      {
        preview && (
          <UserImage image={picturePath} size={"40px"} />
        )
      }
      
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        <Link
          color="inherit"
          underline="hover"
          onClick={(e) => {
            e.stopPropagation();
          }}
          to={"/users/" + username}
        >
          {username}
        </Link>
        </Typography>
        

      {!preview && !isComment && (
        <Typography variant="subtitle" color="text" gutterBottom>
          {" "} · {actividad} en {location.split('-').shift().trim()} {"- El "} {formattedDate}
        </Typography>
      )}

      {!preview && isComment && (
      <Typography variant="subtitle" color="text.secondary" gutterBottom>
        {"\n"} - {formattedCreatedAt}
      </Typography>
      )}
      
    </HorizontalStack>
    
    </>
  );
};

export default ContentDetails;
