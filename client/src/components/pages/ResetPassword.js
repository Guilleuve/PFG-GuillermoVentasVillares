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
import { login, sendPass } from "../../api/users";
import { loginUser } from "../../helpers/authHelper";
import Copyright from "../_more_components/Copyright";
import ErrorAlert from "../_more_components/ErrorAlert";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [renderVerif, setRenderVerif] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
  });

  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData.email);

    const data = await sendPass(formData.email);
    if (data.error) {
      setServerError(data.error);
    } else {
      setRenderVerif(true);
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
          Resetear contraseña
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
         
          <ErrorAlert error={serverError} />
          <Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
            Resetear contraseña
          </Button>
         
        </Box>
        <Box sx={{ mt: 3 }}>
          <Copyright />
        </Box>
      </Stack>
      {renderVerif && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', zIndex: '9999' }}>
          <p style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
            Se ha enviado un mensaje a su dirección de correo electrónico para verificar su identidad
          </p>
          <p style={{ textAlign: 'center', fontSize: '20px' }}>Puede cerrar esta pestaña</p>
        </div>
      )}
    </Container>
  );
};

export default ResetPassword;
