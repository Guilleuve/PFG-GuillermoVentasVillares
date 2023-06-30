import { useTheme } from "@emotion/react";
import { LocationOnOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Card,
  Divider,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import Grid from "@mui/material/Grid";
import { Box } from "@mui/system";
import { deleteUser, getUser, updateUser } from "api/users";
import ErrorAlert from "components/_more_components/ErrorAlert";
import { BASE_URL } from "config";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { isLoggedIn, logoutUser } from "../../helpers/authHelper";
import HorizontalStack from "../_more_components/HorizontalStack";
import Loading from "../_more_components/Loading";
import UserImage from "../_more_components/UserImage";

const ProfileCard = (props) => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);
  const currentUser = isLoggedIn();
  const theme = useTheme();
  const iconColor = theme.palette.primary.main;
  const [location, setLocation] = useState(null); // Estado para guardar el valor de ubicación seleccionado
  const [locationString, setLocationString] = useState(null); 
  const [options, setOptions] = useState([]);
  const { palette } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [experto, setExperto] = useState([]);
  const [intermedio, setIntermedio] = useState([]);
  const [principiante, setPrincipiante] = useState([]);
  const [exp, setExp] = useState([]);
  const [inter, setInter] = useState([]);
  const [princ, setPrinc] = useState([]);
  const [selectedValuesExperto, setSelectedValuesExperto] = useState([]);
  const [selectedValuesIntermedio, setSelectedValuesIntermedio] = useState([]);
  const [selectedValuesPrincipiante, setSelectedValuesPrincipiante] = useState([]);
  const [bio, setBio] = useState("");
  const [showEliminarCuenta, setShowEliminarCuenta] = useState(true);
  const [showConfirmEliminarCuenta, setShowConfirmEliminarCuenta] = useState(false);

  const [sports, setSports] = useState([]);
  const params = useParams();

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

  const handleLogout = async (e) => {
    logoutUser();
    navigate("/login");
  };

  const handleSelectChangeLocation = (event, value) => {
    setLocation(value);

    const { DENOMINACION, PROVINCIA, COMUNIDAD_AUTONOMA } = value.value;
    // Se crea una cadena de texto con el formato deseado
    setLocationString (`${COMUNIDAD_AUTONOMA} - ${PROVINCIA} - ${DENOMINACION}`);
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

  const handleChangeBio = (e) => {
    setBio(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateUser(user._id, bio, locationString, selectedValuesExperto, selectedValuesIntermedio, selectedValuesPrincipiante);
    window.location.reload();
  };

  const fetchUser = async () => {
    const data = await getUser(params);
    
    if (data.error) {
      setError(data.error);
    } else {
      setLoggedUser(data);
    }
  };

  useEffect(() => {
    if (props.profile) {
      setUser(props.profile.user);

      if (user) {

      setBio(user.biography);
      
      const selectedOption = options.find(option => option.label === user.location);

      if (selectedOption) {
        setLocation(selectedOption);
        setLocationString(selectedOption)
      } else {
        // Aquí puedes manejar el caso en el que la opción no coincide con ninguna de las disponibles
      }

      if (Array.isArray(user.experto)) {
        const options = user.experto.map((item) => ({
          label: item,
          value: item
        }));
        setSelectedValuesExperto(options);
        setExperto(options);
      } else {
        setExperto([user.experto]); 
      }
      
      // Verificar si data.intermedio es un arreglo
      if (Array.isArray(user.intermedio)) {
        const options = user.intermedio.map((item) => ({
          label: item,
          value: item
        }));
        setSelectedValuesIntermedio(options);
        setIntermedio(options);
      } else {
        setIntermedio([user.intermedio]);
      }
      
      // Verificar si data.principiante es un arreglo
      if (Array.isArray(user.principiante)) {
        const options = user.principiante.map((item) => ({
          label: item,
          value: item
        }));
        setSelectedValuesPrincipiante(options);
        setPrincipiante(options);
      } else {
        setPrincipiante([user.principiante]);
      }
      }
    }
    fetchUser();
  }, [props.profile]);

  const handleEditClick = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  const handleDeleteAccount = async () => {
    deleteUser(user._id);
    logoutUser();
    navigate("/");
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, delay: 1 }}
      transition={{
        ease: 'easeInOut',
        duration: 0.8,
        delay: 0.15,
      }}
      className="container mx-auto mt-5 sm:mt-10"
    >
      <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      {user ? (
        <Stack alignItems="center" spacing={2}>
          <Box my={1}>
            <UserImage image={user.picturePath} size={200}/>
          </Box>

          <Typography variant="h3">{user.firstname} {user.lastname}</Typography>
          <Typography variant="subtitle2">@{user.username}</Typography>

      <Box p=".2rem 0" >
        <Box display="flex" alignItems="center" gap=".2rem" mb="0.5rem">
          <LocationOnOutlined/>
         
            <Typography fontWeight="400" >{user.location}</Typography>
       
        </Box>
      </Box>

      <Typography variant="h5">Niveles</Typography>
      <Box
            display="grid"
            gap="5px"
            gridTemplateColumns="repeat(3, minmax(0, 1fr))"
            
          >
        <Box display="grid" alignItems="center" gap="0.5rem" sx={{ gridColumn: "span 3" }}>
          
         
          <Typography>
            <Box component="span" fontWeight="500">
              {user.experto.join(", ")} {"> "}
            </Box>
            <Box component="span" fontWeight="400">
              {user.intermedio.join(", ")} {"> "}
            </Box>
            <Box component="span" fontWeight="200">
              {user.principiante.join(", ")}
            </Box>
          </Typography>
         
          
        
           </Box> 

      </Box>

      <Divider />

          {user.biography ? (
            <Typography textAlign="center" variant="p">
              <b>Biografía: </b>
              {user.biography}
            </Typography>
          ) : (
            <Typography variant="p">
              <i>No hay biografía</i>
            </Typography>
          )}

          {currentUser && user._id === currentUser.userId && (
            <Box>
              <Button startIcon={<AiFillEdit color={iconColor} />} onClick={handleEditClick}>
                {isEditing ? <>Cancelar</> : <>Editar perfil</>}
              </Button>
              <Button onClick={handleLogout}>Cerrar sesión</Button>
            </Box>
            
          )}

          {currentUser && user._id !== currentUser.userId && (
            <HorizontalStack>

            <Button variant="outlined" onClick={props.handleMessage}>
              Escribir mensaje
            </Button>
            <ErrorAlert error={serverError} />
            </HorizontalStack>
          )}

          <HorizontalStack>
            <Typography color="text.secondary">
              <b>{props.profile.posts.likeCount}</b> Likes
            </Typography>
              <Typography color="text.secondary">
                <b>{props.profile.posts.count}</b> Publicaciones
              </Typography>
          </HorizontalStack>
        </Stack>
      ) : (
        <Loading label="Loading profile" />
      )}
      </Card>
                
      {isEditing && (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}>
            <HorizontalStack
              style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '5px',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '300px', 
              }}
            >
          <Box component="form" onSubmit={handleSubmit}>
          <Box pt={1} sx={{ width: '100%' }}>
          <FormControl fullWidth sx={{ gridColumn: "span 6" }}>
            <Autocomplete
              options={options}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => <TextField {...params} label="Ubicación" />}
              value={location}
              onChange={handleSelectChangeLocation}
            />
          </FormControl>
          </Box>

          <Box pt={2}>
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
            renderInput={(params) => <TextField {...params} label="Experto" />}
            value={principiante}
            onChange={handleSelectChangePrincipiante}
          />
            </FormControl>
      </Box>
      <Stack>
        <TextField
          value={bio}
          fullWidth
          margin="normal"
          name="bio"
          sx={{ backgroundColor: "white" }}
          onChange={handleChangeBio}
          error={error.length !== 0}
          helperText={error}
          multiline
        />
        <Button
          type="submit"
          variant="outlined"
          sx={{ backgroundColor: "white", mt: 1 }}
        >
          Actualizar
        </Button>
      </Stack>
      <Button sx={{my: 1}} fullWidth onClick={handleEditClick}>
        {isEditing ? <>Cancelar</> : <>Editar perfil</>}
      </Button>
      </Box>
      <>
      {isEditing && showEliminarCuenta &&(
              <Box sx={{ my: 1.5, textAlign: "center" }}> {/* Envuelve el botón en un Box y aplica estilos de centrado */}
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setShowConfirmEliminarCuenta(true);
                    setShowEliminarCuenta(false); // Actualiza el estado para ocultar el botón "Eliminar Cuenta"
                  }}
                  sx={{
                    margin: "0 8px",
                    fontSize: "0.8rem",
                    color: "main",
                    "&:hover": {},
                  }}
                >
                  Eliminar Cuenta
                </Button>
              </Box>
              )}
    {showConfirmEliminarCuenta && (
      <Alert
        variant="outlined"
        severity="error"
        onClose={() => {
          setShowConfirmEliminarCuenta(false);
          setShowEliminarCuenta(true);
        }}
        sx={{ textAlign: "center" }}
      >
      <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={12} sm={12}>
          <Typography
            variant="body1"
            sx={{ margin: "0 8px" }}
          >
            ¿Desea eliminar su cuenta permanentemente?
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
        <Button
          variant="outlined"
          color="error"
          sx={{
            margin: "8px",
            fontSize: "0.8rem",
            color: "main",
            "&:hover": {},
          }}
          onClick={handleDeleteAccount} // Invoca la función handleDeleteAccount
        >
          Confirmar
        </Button>
        </Grid>
      </Grid>
    </Alert>
  )}
</>
        </HorizontalStack>
</div>
      )}
    </motion.div>
  );
};

export default ProfileCard;
