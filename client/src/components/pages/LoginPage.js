import {
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/users";
import { loginUser } from "../../helpers/authHelper";
import Copyright from "../_more_components/Copyright";
import ErrorAlert from "../_more_components/ErrorAlert";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await login(formData);
    if (data.error) {
      setServerError(data.error);
    } else {
      loginUser(data);
      navigate("/");
    }
  };

  return (
    <Container maxWidth={"xs"} sx={{ mt: 6 }}>
      <Stack alignItems="center">
        <Typography variant="h2" color="text.secondary" sx={{ mb: 6 }}>
          <Link to="/" color="inherit" underline="none">
            cooltrainer.
          </Link>
        </Typography>
        <Typography variant="h5" gutterBottom>
          Iniciar sesión
        </Typography>
        <Typography color="text.secondary">
          ¿No tienes cuenta? <Link to="/register">Registrate aquí</Link>
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Correo electrónico"
            fullWidth
            margin="normal"
            autoComplete="email"
            autoFocus
            required
            id="email"
            name="email"
            onChange={handleChange}
          />
          <TextField
            label="Contraseña"
            fullWidth
            required
            margin="normal"
            id="password  "
            name="password"
            onChange={handleChange}
            type="password"
          />

          <ErrorAlert error={serverError} />
          <Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
            Iniciar sesión
          </Button>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Copyright />
        </Box>
      </Stack>
    </Container>
  );
};

export default LoginPage;
