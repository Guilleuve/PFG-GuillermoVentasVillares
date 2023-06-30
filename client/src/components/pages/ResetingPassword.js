import {
  Autocomplete,
  Button,
  Container,
  Divider,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FormControl from '@mui/material/FormControl';
import { Box } from "@mui/system";
import { BASE_URL } from "config";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contains, isEmail, isLength } from "validator";
import { register, resetPass } from "../../api/users";
import { loginUser } from "../../helpers/authHelper";
import Copyright from "../_more_components/Copyright";
import ErrorAlert from "../_more_components/ErrorAlert";
import axios from 'axios';

const ResetingPassword = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const [renderVerif, setRenderVerif] = useState(false);
  const [location, setLocation] = useState(null); 
  const [locationString, setLocationString] = useState(null); 
  const [experto, setExperto] = useState([]);
  const [intermedio, setIntermedio] = useState([]);
  const [principiante, setPrincipiante] = useState([]);
  const [selectedValuesExperto, setSelectedValuesExperto] = useState([]);
  const [selectedValuesIntermedio, setSelectedValuesIntermedio] = useState([]);
  const [selectedValuesPrincipiante, setSelectedValuesPrincipiante] = useState([]);
  const [file, setFile] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [userid] = useState("");

  const [formData, setFormData] = useState({
    password: "",
    cpassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleChangec = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!isVerified) {
          const token = new URLSearchParams(window.location.search).get('token');
          userid = await axios.get(BASE_URL + "verify-pass", { params: { token } });
          console.log(userid);
          setVerificationStatus(true);
        }
      } catch (error) {
        console.log(error);
        setVerificationStatus(false);
      }
    };

    verifyEmail();
  }, [isVerified, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isVerified) {
        await resetPass(userid, formData.password);
        setIsVerified(true);

        // Esperar 5 segundos y redirigir
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
    setVerificationStatus(true)
  };


  const validate = () => {
    const errors = {};

    if (!isLength(formData.password, { min: 8 })) {
      errors.password = "Debe ser de 8 caracteres o más";
    }

    if (formData.password !== formData.cpassword) {
      errors.password = "Las contraseñas deben ser iguales";
    }

    setErrors(errors);

    return errors;
  };

  return (
    <Container maxWidth={"sm"} sx={{ mt: { xs: 2, md: 6 } }}>
       <div>
        {verificationStatus ? (
          <>
            <div style={{ textAlign: 'center' }}>
              {isVerified ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="green" viewBox="0 0 24 24">
                  <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="red" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              )}
            </div>
            <p style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
              {isVerified ? 'Contraseñá actualizada, se le redirigirá a la página login' : 'Error al actualizar contraseña'}
            </p>
          </>
        ) : (
          <Formik>
      <Stack alignItems="center">
        <Typography variant="h2" color="text.secondary" sx={{ mb: 6 }}>
          <Link to="/" color="inherit" underline="none">
            Nueva contraseña
          </Link>
        </Typography>
        <Divider/>
        <Box component="form" onSubmit={handleSubmit}>
          
          <TextField
            label="Contraseña"
            fullWidth
            required
            margin="normal"
            autoComplete="password"
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            error={errors.password !== undefined}
            helperText={errors.password}
          />

          <TextField
            label="Confirmar Contraseña"
            fullWidth
            required
            margin="normal"
            autoComplete="cpassword"
            id="cpassword"
            name="cpassword"
            type="password"
            onChange={handleChangec}
            error={errors.password !== undefined}
            helperText={errors.password}
          />
          <ErrorAlert error={serverError} />
          <Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
            Confirmar
          </Button>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Copyright />
        </Box>
      </Stack>
      </Formik>
        )}
      </div>
    </Container>
  );
};

export default ResetingPassword;
