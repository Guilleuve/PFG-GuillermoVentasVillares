import {
  Button,
  Card,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { Autocomplete } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useNavigate } from "react-router-dom";
import { createPost } from "../../api/posts";
import { isLoggedIn } from "../../helpers/authHelper";
import ErrorAlert from "../_more_components/ErrorAlert";
import HorizontalStack from "../_more_components/HorizontalStack";
import UserImage from "../_more_components/UserImage";
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { es } from 'date-fns/locale';
import { motion } from "framer-motion";
import { BASE_URL } from "config";

const PostEditorCard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [actividad, setActividad] = useState(null); // Estado para almacenar el valor seleccionado en actividad
  const [selectedActividad, setSelectedActividad] = useState(null);
  const [location, setLocation] = useState(null); // Estado para guardar el valor de ubicación seleccionado
  const [locationString, setLocationString] = useState(null); 
  const [options, setOptions] = useState([]);
  const [sports, setSports] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    location: "",
    actividad: "",
    date: null,
    picturePath: "",
  });

  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const user = isLoggedIn();

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

  const handleSelectChangeActividad = (event, value) => {
    setActividad(value);
    if (value) {
      const valueString = JSON.stringify(value.label);
      const formattedValueString = valueString.replace(/"/g, ''); // Eliminar las comillas dobles
      setSelectedActividad(formattedValueString);
    } else {
      setSelectedActividad(null);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    const errors = validate();
    setErrors(errors);
  };

  const handleDayClick = (date) => {
    setSelectedDay(date);
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
    const dateNow = now.getDate();
    const hours = now.getHours();

    formData.location = locationString;
    formData.actividad = selectedActividad;
    formData.date = selectedDay;
    formData.picturePath =  dateNow + "-" + hours + "-" + file.name;

    setLoading(true);

    const data = await createPost(formData, isLoggedIn());
    setLoading(false);
    if (data && data.error) {
      setServerError(data.error);
    } else {
      navigate("/posts/" + data._id);
    }
  };


  const validate = () => {
    const errors = {};

    return errors;
  };

  
  
  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, delay: 1 }}
    transition={{
      ease: 'easeInOut',
      duration: 1,
      delay: 0.15,
    }}
    className="container mx-auto mt-5 sm:mt-10"
  >
    <Card>
      <Stack spacing={1}>
        {user && (
          <HorizontalStack spacing={2}>
            <UserImage image={user.picturePath} size={50} />
            <Typography variant="h5">
              Hola, {user.firstname}. ¿Qué quieres publicar hoy?
            </Typography>
          </HorizontalStack>
        )}

        <Box>
          <TextField
            fullWidth
            label="Título"
            required
            name="title"
            margin="normal"
            onChange={handleChange}
            error={errors.title !== undefined}
            helperText={errors.title}
          />
          <TextField
            fullWidth
            label="Descripción"
            multiline
            rows={10}
            name="content"
            margin="normal"
            onChange={handleChange}
            error={errors.content !== undefined}
            helperText={errors.content}
            required
          />
          <Divider sx={{ margin: ".7rem 0" }} />

          <Typography  variant="h5" fontWeight="300">
            ¿Dónde será la actividad?
          </Typography>
   
 
        <Divider sx={{ borderColor: "white", margin: ".5rem 0" }} />
        <FormControl fullWidth sx={{ gridColumn: "span 6" }}>
            <Autocomplete
              options={options}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => <TextField {...params} label="Ubicación" />}
              value={location}
              onChange={handleSelectChangeLocation}
              
            />
          </FormControl>
                  
         <Divider sx={{ borderColor: "white", margin: ".7rem 0" }} />
                  
          <Typography  variant="h5" fontWeight="300">
          ¿Qué vas a realizar?
        </Typography>
        
        <Divider sx={{ borderColor: "white", margin: ".5rem 0" }} />
          <FormControl variant="outlined" fullWidth sx={{ gridColumn: "span 6" }}>
          <Autocomplete
            options={sports}
            getOptionLabel={(sports) => sports.label}
            renderInput={(params) => <TextField {...params} label="Actividad" />}
            value={actividad}
            onChange={handleSelectChangeActividad}
          />
          </FormControl>

          <Divider sx={{ borderColor: "white", margin: ".7rem 0" }} />
                
            <Typography  variant="h5" fontWeight="300">
              ¿Cúando?
            </Typography>
            {!selectedDay && (
              <p>Selecciona un día.</p>
            )}
            {selectedDay && (
              <p>El día {format(selectedDay, 'dd/MM/yyyy')}.</p>
            )}
            <Divider sx={{ borderColor: "white", margin: ".5rem 0" }} />
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <DayPicker
              mode="single"
              locale={es}
              localeUtils={{ ...es }}
              onDayClick={handleDayClick}
              selected={selectedDay}
              />
            </div>
          
          <Divider sx={{ borderColor: "white", margin: ".5rem 0" }} />

          <Typography  variant="h5" fontWeight="300">
          Añade una imagen (opcional)
          </Typography>
          <Typography  variant="subtitle"  sx={{ fontStyle: "italic" }} >
          Consejo: imagen de la ubicación de la actividad o quedada
          </Typography>
          <Divider sx={{ borderColor: "white", margin: ".5rem 0" }} />
          <input type="file" onChange={handleFileChange} />

          <ErrorAlert error={serverError} />

          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
            }}
          >
            {loading ? <>Publicando...</> : <>Publicar</>}
          </Button>
        </Box>
      </Stack>
    </Card>
    </motion.div>
  );
};

export default PostEditorCard;
