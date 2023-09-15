![ezgif-4-4f99c93068](https://github.com/Guilleuve/PFG-GuillermoVentasVillares/assets/56960692/8e68288a-0ef0-40b0-b133-4ce462e2c338)![ezgif-4-4f99c93068](https://github.com/Guilleuve/PFG-GuillermoVentasVillares/assets/56960692/2ea30ce6-9c02-4a18-b9f6-90f0271ee75f)﻿# cooltrainer
Proyecto web "MERN" del PFG de Guillermo Ventas Villares

#INTRO
![ezgif-2-ae5452c597](https://github.com/Guilleuve/PFG-GuillermoVentasVillares/assets/56960692/e7a7c335-d0c6-4179-8405-f0a89c6a9ae2)
------------------------------------------------------------------------------------------------------------------------------------
![ezgif-4-8a0527ed79](https://github.com/Guilleuve/PFG-GuillermoVentasVillares/assets/56960692/505a379f-9bb0-4293-84da-97019384c3d0)
------------------------------------------------------------------------------------------------------------------------------------

![ezgif-4-2c7dd4e4a7](https://github.com/Guilleuve/PFG-GuillermoVentasVillares/assets/56960692/68c3ff69-a926-403a-b174-78c350a7951b)

------------------------------------------------------------------------------------------------------------------------------------
![ezgif-4-753f72ad92](https://github.com/Guilleuve/PFG-GuillermoVentasVillares/assets/56960692/9229c2e9-8c61-4bfe-a38a-7017086568a7)

------------------------------------------------------------------------------------------------------------------------------------

![ezgif-4-4f99c93068](https://github.com/Guilleuve/PFG-GuillermoVentasVillares/assets/56960692/7498a69b-fd79-4b6b-8559-5b494dda40ea)

![ezgif-4-7e55f44571](https://github.com/Guilleuve/PFG-GuillermoVentasVillares/assets/56960692/dda04a08-2b20-4e2b-821e-df28c6798cae)

![ezgif-4-da63ff3d6a](https://github.com/Guilleuve/PFG-GuillermoVentasVillares/assets/56960692/2a88cca5-6341-42da-bb18-ce803cc234be)



Necesario tener instalado NodeJS https://nodejs.org/en/download
Recomendable: MongoDB Compass - https://www.mongodb.com/try/download/compass

Pasos para la instalación:

1) Instalación npm (node package manager)
```
cd cooltrainer
npm install
npm i npx
cd client
npm install
```

2) Dependencias (servidor)
```
cd cooltrainer
npm i @reduxjs/toolkit bad-words bad-words-es bcrypt body-parser cors csv-parser date-fns dotenv express express-validator fs gridfs-stream helmet jsonwebtoken mongoose morgan multer multer-gridfs-storage nodemon react-dropzone react-redux socket.io validator

```
3) Dependencias (cliente)
```
cd client
npm i @emotion/react @emotion/styled @mui/icons-material @mui/material @mui/x-date-pickers @reduxjs/toolkit axios date-fns dayjs dotenv formik framer-motion moment nodemailer react react-cookie react-cookie-consent react-day-picker react-dom react-dropzone react-icons react-markdown react-moment react-redux react-router-dom react-scripts redux-persist serve shortid socket.io-client validator web-vitals

```

4) Crear archivo .env

```
cd ..
touch .env
```

```
MONGO_URI=<url de la base de datos mongodb> 
TOKEN_KEY=<Tu token key>
PORT=4000
NODE_ENV='development'
heroku config: set "cooltrainer"
```

5) Iniciar cooltrainer
```
cd cooltrainer
cd client
npm start
```
