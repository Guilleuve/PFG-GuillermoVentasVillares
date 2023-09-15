# cooltrainer
Proyecto web "MERN" del PFG de Guillermo Ventas Villares

![ezgif-2-ae5452c597](https://github.com/Guilleuve/PFG-GuillermoVentasVillares/assets/56960692/e7a7c335-d0c6-4179-8405-f0a89c6a9ae2)
------------------------------------------------------------------------------------------------------------------------------------
![image](https://github.com/Guilleuve/PFG-GuillermoVentasVillares/assets/56960692/64cee26b-7b27-448f-83d3-8465ada21e27)
------------------------------------------------------------------------------------------------------------------------------------


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
