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
import { register } from "../../api/users";
import { loginUser } from "../../helpers/authHelper";
import Copyright from "../_more_components/Copyright";
import ErrorAlert from "../_more_components/ErrorAlert";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});

  const [location, setLocation] = useState(null); 
  const [locationString, setLocationString] = useState(null); 
  const [experto, setExperto] = useState([]);
  const [intermedio, setIntermedio] = useState([]);
  const [principiante, setPrincipiante] = useState([]);
  const [selectedValuesExperto, setSelectedValuesExperto] = useState([]);
  const [selectedValuesIntermedio, setSelectedValuesIntermedio] = useState([]);
  const [selectedValuesPrincipiante, setSelectedValuesPrincipiante] = useState([]);
  const [file, setFile] = useState(null);
  
  const [options, setOptions] = useState([]);
  const [sports, setSports] = useState([]);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    location: "",
    experto: "",
    intermedio: "",
    principiante: "",
    picture: "",
    picturePath: "",
  });


  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(BASE_URL + "locations");
      const data = await result.json();
  
      setOptions(
        data.map((item) => ({
          label: `${item.COMUNIDAD_AUTONOMA} - ${item.PROVINCIA} - ${item.DENOMINACION}`,
          value: item,
        }))
      );

      
      const resultSports = await fetch(BASE_URL + "sports");
      const dataSports = await resultSports.json();
    
      setSports(dataSports);
    };
  
    fetchData();
  }, []);

  const handleSelectChangeLocation = (event, value) => {
    setLocation(value);

    const { DENOMINACION, PROVINCIA, COMUNIDAD_AUTONOMA } = value.value;
    // Se crea una cadena de texto con el formato deseado
    setLocationString (`${DENOMINACION}, ${PROVINCIA} - ${COMUNIDAD_AUTONOMA}`);
  }

  const handleSelectChangeExperto = (event, values) => {
    setExperto(values);
    const labels = values.map((value) => value.label); // Obtener las etiquetas de los objetos seleccionados
    setSelectedValuesExperto(labels); // Asignar una matriz de etiquetas en lugar de una matriz de objetos
  };
  
  const handleSelectChangeIntermedio = (event, values) => {
    setIntermedio(values);
    const labels = values.map((value) => value.label); // Obtener las etiquetas de los objetos seleccionados
    setSelectedValuesIntermedio(labels); // Asignar una matriz de etiquetas en lugar de una matriz de objetos
  };
  
  const handleSelectChangePrincipiante = (event, values) => {
    setPrincipiante(values);
    const labels = values.map((value) => value.label); // Obtener las etiquetas de los objetos seleccionados
    setSelectedValuesPrincipiante(labels); // Asignar una matriz de etiquetas en lugar de una matriz de objetos
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formImage = new FormData();
    formImage.append("image", file);
    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formImage,
      });
      await response.json();
    } catch (error) {
      console.error(error);
    }
    const now = new Date();
    const date = now.getDate();
    const hours = now.getHours();

    const errors = validate();
    if (Object.keys(errors).length !== 0) return;

    
    formData.location = locationString;
    formData.experto = selectedValuesExperto;
    formData.intermedio = selectedValuesIntermedio;
    formData.principiante = selectedValuesPrincipiante;
    formData.picturePath =  date + "-" + hours + "-" + file.name;
    
    const data = await register(formData);

    if (data.error) {
      setServerError(data.error);
    } else {
      loginUser(data);
      navigate("/");
    }
  };

  const validate = () => {
    const errors = {};

    if (!isLength(formData.firstname, { min: 2 })) {
      errors.firstname = "Al menos 2 caracteres";
    }

    if (!isLength(formData.lastname, { min: 2 })) {
      errors.lastname = "Al menos 2 caracteres";
    }


    if (!isLength(formData.username, { min: 6, max: 30 })) {
      errors.username = "Debe tener una longitud entre 6 y 30 caracteres de largo";
    }

    if (contains(formData.username, " ")) {
      errors.username = "Debe contener caracteres válidos";
    }

    if (!isLength(formData.password, { min: 8 })) {
      errors.password = "Debe ser de 8 caracteres o más";
    }

    if (!isEmail(formData.email)) {
      errors.email = "Debe ser un correo válido";
    }

    setErrors(errors);

    return errors;
  };

  return (
    <Container maxWidth={"sm"} sx={{ mt: { xs: 2, md: 6 } }}>
      <Formik>
      <Stack alignItems="center">
        <Typography variant="h2" color="text.secondary" sx={{ mb: 6 }}>
          <Link to="/" color="inherit" underline="none">
            cooltrainer.
          </Link>
        </Typography>
        <Typography variant="h5" gutterBottom>
          
        </Typography>
        <Typography color="text.secondary">
          Ya tienes una cuenta <Link  to="/login">Iniciar sesión</Link>
        </Typography>
        <Divider/>
        <Box component="form" onSubmit={handleSubmit}>
        <Box
            display="grid"
            gap="20px"
            gridTemplateColumns="repeat(6, minmax(0, 1fr))"
            
          >
          <TextField
            label="Nombre"
            onChange={handleChange}
            required
            autoFocus
            //value={values.firstName}
            id="firstname"
            name="firstname"
            error={errors.firstname !== undefined}
            helperText={errors.firstname}
            sx={{ gridColumn: "span 3" }}
          />
          <TextField
            label="Apellidos"
            onChange={handleChange}
            required
            id="lastname"
            name="lastname"
            error={errors.lastname !== undefined}
            helperText={errors.lastname}
            sx={{ gridColumn: "span 3" }}
          />

          <FormControl fullWidth sx={{ gridColumn: "span 6" }}>
            <Autocomplete
              options={options}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => <TextField {...params} label="Ubicación" />}
              value={location}
              onChange={handleSelectChangeLocation}
              
            />
          </FormControl>
          <Typography   fontWeight="150" variant="h7" textAlign="center" sx={{ gridColumn: "span 6" }}>
            ¿Qué deportes realizas?
          </Typography>
          <FormControl variant="outlined" fullWidth sx={{ gridColumn: "span 2" }} >
          <Autocomplete
            multiple
            options={sports}
            getOptionLabel={(sports) => sports.label}
            renderInput={(params) => <TextField {...params} label="Experto" />}
            value={experto}
            onChange={handleSelectChangeExperto}
          />
          </FormControl>
            <FormControl variant="outlined" fullWidth sx={{ gridColumn: "span 2" }} >
            <Autocomplete
            multiple
            options={sports}
            getOptionLabel={(sports) => sports.label}
            renderInput={(params) => <TextField {...params} label="Intermedio" />}
            value={intermedio}
            onChange={handleSelectChangeIntermedio}
          />
            </FormControl>
            <FormControl variant="outlined" fullWidth sx={{ gridColumn: "span 2" }} >
            <Autocomplete
            multiple
            options={sports}
            getOptionLabel={(sports) => sports.label}
            renderInput={(params) => <TextField {...params} label="Principiante" />}
            value={principiante}
            onChange={handleSelectChangePrincipiante}
          />
            </FormControl>
            
            <Typography  fontWeight="150" variant="h7" align="center"  sx={{ gridColumn: "span 6",  mb: 1  }}>
            Selecciona tu imagen de perfil {"\n"}
          </Typography>
          
          </Box>
         
          <Box align="center">
            <input type="file" onChange={handleFileChange} />
          </Box>
          
       
          
          <TextField
            label="Nombre de usuario"
            fullWidth
            margin="normal"
            required
            id="username"
            name="username"
            onChange={handleChange}
            error={errors.username !== undefined}
            helperText={errors.username}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            autoComplete="email"
            required
            id="email"
            name="email"
            onChange={handleChange}
            error={errors.email !== undefined}
            helperText={errors.email}
          />
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
          <ErrorAlert error={serverError} />
          <Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
            Registrarse
          </Button>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Copyright />
        </Box>
      </Stack>
      </Formik>
    </Container>
  );
};

export default RegisterPage;
