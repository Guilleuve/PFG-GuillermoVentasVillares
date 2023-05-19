import {
  Button,
  Card,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createComment } from "../../api/posts";
import { isLoggedIn } from "../../helpers/authHelper";
import ErrorAlert from "../_more_components/ErrorAlert";
import HorizontalStack from "../_more_components/HorizontalStack";

const CommentEditorCard = ({ label, comment, addComment, setReplying }) => {
  const [formData, setFormData] = useState({
    content: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      ...formData,
      parentId: comment && comment._id,
    };

    setLoading(true);
    const data = await createComment(body, params, isLoggedIn());
    setLoading(false);

    if (data.error) {
      setError(data.error);
    } else {
      formData.content = "";
      setReplying && setReplying(false);
      addComment(data);
    }
  };

  const handleFocus = (e) => {
    !isLoggedIn() && navigate("/login");
  };

  return (
    <Card>
      <Stack spacing={2}>
        <HorizontalStack justifyContent="space-between">
          <Typography variant="h5">
            {comment ? <>Reply</> : <>Nuevo comentario</>}
          </Typography>
        </HorizontalStack>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            multiline
            fullWidth
            label={label}
            rows={5}
            required
            name="content"
            sx={{
              backgroundColor: "white",
            }}
            onChange={handleChange}
            onFocus={handleFocus}
            value={formData.content}
          />

          <ErrorAlert error={error} sx={{ my: 4 }} />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              
              mt: 2,
            }}
          >
            {loading ? <div>Publicando...</div> : <div>Publicar</div>}
          </Button>
        </Box>
      </Stack>
    </Card>
  );
};

export default CommentEditorCard;
