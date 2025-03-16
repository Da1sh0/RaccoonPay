require('dotenv').config(); // Cargar las variables de entorno
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000; // Puerto de escucha
// Middleware para manejar solicitudes JSON
app.use(express.json());
// Ruta de Prueba
app.get('/', (req, res) => {
  res.send('Hola soy RaccoonPay en un servidor en Node.js🦝!');
});
// Configuración de la conexión a SQL 
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Habilitar encriptación si es necesario
    trustServerCertificate: true, // Para evitar problemas con certificados SSL
  }
};
// Conexión a la base de datos
sql.connect(dbConfig)
  .then(() => {
    console.log('Conectado a la Base de datos de RaccoonPay');
  })
  .catch(error => {
    console.log('Error al conectarse con la base de datos de RaccoonPay', error);
  });
// Configurar middlewares
app.use(cors());
app.use(bodyParser.json()); // Permite manejar solicitudes JSON
// Importar las rutas de autenticación
const authRoutes = require('./src/routes/authRoutes.js');
// Usar las rutas de autenticación
app.use('/api', authRoutes);
// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});