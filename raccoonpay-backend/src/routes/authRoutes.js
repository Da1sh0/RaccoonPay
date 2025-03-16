const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const sql = require('mssql');
const dbConfig = require('../../server.js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
// Configurar nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
// Registro de usuario
router.post('/register', async (req, res) => {
  const { nombres, apellidos, identificacion, tipo_identificacion, celular, correo, cargo, login, contrasenna, perfil } = req.body;
  try {
      // Conectar a la base de datos
      const pool = await sql.connect();
      // Verificar si el correo ya está registrado
      const resultCorreo = await pool.request()
      .input('correo', sql.NVarChar, correo)
      .query('SELECT * FROM Personas WHERE correo = @correo');
      if (resultCorreo.recordset.length > 0) {
        return res.status(400).json({ message: 'El correo ya está registrado' });
      }
      // Verificar si el usuario ya existe
      const resultUsuario = await pool.request()
      .input('login', sql.NVarChar, login)
      .query('SELECT * FROM Usuarios WHERE login = @login');
      if (resultUsuario.recordset.length > 0) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }
      // Encriptar la contraseña
      const salt = await bcrypt.genSalt(10);
      const contrasenaEncriptada = await bcrypt.hash(contrasenna, salt);
      // Generar token de activación
      const token = crypto.randomBytes(20).toString('hex');
      // Iniciar transacción
      const transaction = new sql.Transaction(pool);
      await transaction.begin();
      try {
        // Insertar en la tabla Personas
        const resultPersona = await transaction.request()
        .input('nombres', sql.NVarChar, nombres)
        .input('apellidos', sql.NVarChar, apellidos)
        .input('identificacion', sql.NVarChar, identificacion)
        .input('tipo_identificacion', sql.Int, tipo_identificacion)
        .input('celular', sql.NVarChar, celular)
        .input('correo', sql.NVarChar, correo)
        .input('cargo', sql.NVarChar, cargo)
        .query(`
            INSERT INTO Personas (nombres, apellidos, identificacion, tipo_identificacion, celular, correo, cargo)
            OUTPUT INSERTED.id_persona
            VALUES (@nombres, @apellidos, @identificacion, @tipo_identificacion, @celular, @correo, @cargo)`
        );
        const id_persona = resultPersona.recordset[0].id_persona;
        // Insertar en la tabla Usuarios con token y estado inactivo
        await transaction.request()
        .input('id_persona', sql.Int, id_persona)
        .input('login', sql.NVarChar, login)
        .input('contrasena', sql.NVarChar, contrasenaEncriptada)
        .input('perfil', sql.Int, perfil)
        .input('token_activacion', sql.NVarChar, token)
        .query(`
            INSERT INTO Usuarios (id_persona, login, contrasenna, id_perfil, token_activacion, activo)
            VALUES (@id_persona, @login, @contrasena, @perfil, @token_activacion, 0)
        `);
        // Confirmar la transacción
        await transaction.commit();
        // Enviar correo con el token
        const activationLink = `https://5b11-38-52-155-66.ngrok-free.app/api/activate/${token}`;
        await transporter.sendMail({
            from: '"RaccoonPay" <mensajesconapi@gmail.com>',
            to: correo,
            subject: 'Activación de cuenta',
            html: `<p>Bienvenido a RacconPay ${nombres} ${apellidos},</p>
                    <p>Haz clic en el siguiente enlace para activar tu cuenta:</p>
                    <a href="${activationLink}">Activar cuenta</a>`
        });
          res.status(201).json({ message: 'Usuario registrado. Revisa tu correo para activar la cuenta.' });
      } catch (error) {
          await transaction.rollback();
          console.error('Error en la transacción:', error);
          res.status(500).json({ message: 'Error al crear el usuario' });
      }
  } catch (error) {
      console.error('Error en el servidor:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
  }
});
// Activar el usurio mediante Token
router.get('/activate/:token', async (req, res) => {
  const { token } = req.params;
  try {
      const pool = await sql.connect();
      const result = await pool.request()
      .input('token', sql.NVarChar, token)
      .query('SELECT id_usuario FROM Usuarios WHERE token_activacion = @token');
      if (result.recordset.length === 0) {
        return res.status(400).json({ message: 'Token inválido o expirado' });
      }
      // Activar la cuenta
      await pool.request()
      .input('id_usuario', sql.Int, result.recordset[0].id_usuario)
      .query('UPDATE Usuarios SET activo = 1, token_activacion = NULL WHERE id_usuario = @id_usuario');
      res.json({ message: 'Cuenta activada correctamente' });
  } catch (error) {
      console.error('Error activando la cuenta:', error);
      res.status(500).json({ message: 'Error al activar la cuenta' });
  }
});
// Inicio de sesión
router.post('/login', async (req, res) => {
  const { login, contrasenna } = req.body;
  if (!login || !contrasenna) {
    return res.status(400).json({ message: 'Por favor, ingrese usuario y contraseña.' });
  }
  try {
    // Conexión a la base de datos
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
    .input('login', sql.NVarChar, login)
    .query('SELECT id_usuario, login, contrasenna, activo FROM Usuarios WHERE login = @login');
    // Verificar si la consulta devolvió un usuario
    if (!result || !result.recordset || result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    const user = result.recordset[0];
    // Verificar si el usuario está activo
    if (Number(user.activo) !== 1) {
      return res.status(403).json({ message: 'Usuario no está activo. Por favor, verifica tu correo para activarlo.' });
    }
    // Comparar contraseñas
    const isMatch = await bcrypt.compare(contrasenna, user.contrasenna);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }
    // Generar token con el id_usuario
    const token = jwt.sign({ id_usuario: user.id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Si todo está bien, retornar una respuesta exitosa
    res.status(200).json({
      message: 'Login exitoso',token,id_usuario: user.id_usuario});
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});
// Recordar usuario
router.post('/forgot-user', async (req, res) => {
  const { correo } = req.body;
  try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
      .input('correo', sql.NVarChar, correo)
      .query(`
        SELECT U.login FROM Usuarios U 
        inner join personas p on u.id_persona = p.id_persona
        WHERE  p.correo = @correo
      `);
      if (!result.recordset.length) {
        return res.status(404).json({ message: 'Correo no encontrado.' });
      }
      const user = result.recordset[0];
      // Enviar correo con el enlace
      const mailOptions = {
          from: '"RaccoonPay" <mensajesconapi@gmail.com>',
          to: correo,
          subject: 'Recuperación de usuario',
          text: `Tu usuario registrado es: ${user.login}`
      };
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Correo enviado. Revisa tu bandeja de entrada.' });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error en el servidor.' });
  }
});
// Cambiar la contraseña
router.post('/recovery-password', async (req, res) =>{
  const { correo } = req.body
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
    .input('correo', sql.NVarChar, correo)
    .query(`
      SELECT U.id_usuario FROM Usuarios U
      INNER JOIN Personas P ON U.id_persona = P.id_persona
      WHERE P.correo = @correo
    `);
    if (!result.recordset.length) {
      return res.status(404).json({ message: 'Correo no encontrado.' });
    }
    const { id_usuario } = result.recordset[0];
    const token = crypto.randomBytes(32).toString('hex');
    // Guardar token en la base de datos
    await pool.request()
    .input('id_usuario', sql.Int, id_usuario)
    .input('token', sql.NVarChar, token)
    .query(`
      UPDATE Usuarios 
      SET token_recuperacion = @token
      WHERE id_usuario = @id_usuario
    `);
    // Envio del token al correo
    const mailOptions = {
      from: '"RaccoonPay" <mensajesconapi@gmail.com>',
      to: correo,
      subject: 'Recuperación de contraseña',
      text: `Usa este enlace para cambiar tu contraseña: https://5b11-38-52-155-66.ngrok-free.app/api/reset-password?token=${token}`
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado. Revisa tu bandeja de entrada.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error en el servidor'})
  }
});
// Cambiar la contraseña con el token
router.post('/reset-password', async (req, res) => {
  const { token, nuevaContrasena, confirmarnuevaContrasena } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    // Verificar si el token aún es válido en la base de datos
    const result = await pool.request()
    .input('token', sql.NVarChar, token)
    .query(`
      SELECT id_usuario FROM Usuarios 
      WHERE token_recuperacion = @token
      `);
    if (!result.recordset.length) {
      return res.status(400).json({ message: 'Token inválido.' });
    }
    if (nuevaContrasena !== confirmarnuevaContrasena) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
    }
    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaEncriptada = await bcrypt.hash(nuevaContrasena, salt);
    // Actualizar contraseña y eliminar token
    const { id_usuario } = result.recordset[0];
    await pool.request()
    .input('id_usuario', sql.Int, id_usuario)
    .input('contrasena', sql.NVarChar, contrasenaEncriptada)
    .query(`
      UPDATE Usuarios 
      SET contrasenna = @contrasena, token_recuperacion = NULL 
      WHERE id_usuario = @id_usuario
    `);
    res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});
// Actulizar el usuario
router.put('/update-user', async (req, res) => {
  const { nombres, apellidos, identificacion, tipo_identificacion, celular, correo, cargo, contrasenna } = req.body;
  const token = req.headers.authorization?.split(' ')[1]; // Extrae el token del header
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id_usuario = decoded.id_usuario;
    const pool = await sql.connect(dbConfig);
    // Verificar si el usuario existe y obtener la contraseña encriptada
    const result = await pool.request()
    .input('id_usuario', sql.Int, id_usuario)
    .query('SELECT contrasenna, id_persona FROM Usuarios WHERE id_usuario = @id_usuario');
    if (!result.recordset.length) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    const user = result.recordset[0];
    const id_persona = user.id_persona;
    // Comparar la contraseña proporcionada con la almacenada
    const isMatch = await bcrypt.compare(contrasenna, user.contrasenna);
    if (!user.contrasenna) {
      return res.status(400).json({ message: 'El usuario no tiene una contraseña registrada.' });
    }
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }
    // Actualizar los datos del usuario SIN modificar la contraseña
    await pool.request()
      .input('id_persona', sql.Int, id_persona)
      .input('nombres', sql.NVarChar, nombres)
      .input('apellidos', sql.NVarChar, apellidos)
      .input('identificacion', sql.NVarChar, identificacion)
      .input('tipo_identificacion', sql.Int, tipo_identificacion)
      .input('celular', sql.NVarChar, celular)
      .input('correo', sql.NVarChar, correo)
      .input('cargo', sql.NVarChar, cargo)
    .query(`
      UPDATE Personas 
      SET nombres = @nombres, apellidos = @apellidos, 
      tipo_identificacion = @tipo_identificacion, 
      celular = @celular, correo = @correo, 
      cargo = @cargo
      WHERE id_persona = @id_persona
    `);
    res.status(200).json({ message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});
// Crear periodos
router.post('/create-period', async (req, res) => {
  const { nombre, fecha_inicio, fecha_fin } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id_usuario = decoded.id_usuario; // Extraer el ID del usuario logueado
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
    .input('id_usuario', sql.Int, id_usuario)
    .query('SELECT contrasenna, id_persona FROM Usuarios WHERE id_usuario = @id_usuario');
    if (!result.recordset.length) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    const user = result.recordset[0];
    const id_persona = user.id_persona;
    // Insertar el nuevo período asociado al usuario
    await pool.request()
      .input('id_persona', sql.Int, id_persona)
      .input('nombre', sql.NVarChar, nombre)
      .input('fecha_inicio', sql.Date, fecha_inicio)
      .input('fecha_fin', sql.Date, fecha_fin)
      .query(`
        INSERT INTO Periodos (id_persona, nombre, fecha_inicio, fecha_fin)
        VALUES (@id_persona, @nombre, @fecha_inicio, @fecha_fin)
      `);

    res.status(201).json({ message: 'Período creado correctamente.' });

  } catch (error) {
    console.error('Error al crear el período:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});
// Crear los Gastos
router.post('/periods/:id_periodo/expenses', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id_usuario = decoded.id_usuario; // Extraer el ID del usuario desde el token
    const id_periodo = req.params.id_periodo;
    const { nombre, id_categoria, monto, id_opcion } = req.body;
    if (!nombre || !id_categoria || !monto || !id_opcion) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
    const pool = await sql.connect(dbConfig);
    // Verificar si el período pertenece al usuario
    const periodoResult = await pool.request()
    .input('id_periodo', sql.Int, id_periodo)
    .input('id_usuario', sql.Int, id_usuario)
    .query(`
      SELECT p.id_persona FROM periodos p
      INNER JOIN usuarios u ON p.id_persona = u.id_persona
      WHERE p.id_periodo = @id_periodo AND u.id_usuario = @id_usuario
    `);
    if (!periodoResult.recordset.length) {
      return res.status(403).json({ message: 'No tienes acceso a este período.' });
    }
    // Insertar el gasto
    await pool.request()
      .input('id_periodo', sql.Int, id_periodo)
      .input('nombre', sql.NVarChar, nombre)
      .input('id_categoria', sql.Int, id_categoria)
      .input('monto', sql.Decimal(10, 2), monto)
      .input('id_opcion', sql.Int, id_opcion)
      .query(`
        INSERT INTO gastos (id_periodo, nombre, id_categoria, monto, id_opcion)
        VALUES (@id_periodo, @nombre, @id_categoria, @monto, @id_opcion)
      `);

    res.status(201).json({ message: 'Gasto registrado exitosamente.' });
  } catch (error) {
    console.error('Error al registrar gasto:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});
// Eliminar los Gastos
router.delete('/delete-expenses/:id_gasto', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extrae el token del header
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id_usuario = decoded.id_usuario;
    const { id_gasto } = req.params; // ID del gasto a eliminar
    if (isNaN(id_gasto)) {
      return res.status(400).json({ message: 'ID de gasto inválido.' });
    }
    const pool = await sql.connect(dbConfig);
    // Verificar si el gasto pertenece a un período del usuario autenticado
    const result = await pool.request()
    .input('id_gasto', sql.Int, id_gasto)
    .input('id_usuario', sql.Int, id_usuario)
    .query(`
      SELECT g.id_gasto FROM gastos g
      JOIN periodos p ON g.id_periodo = p.id_periodo
      JOIN personas per ON p.id_persona = per.id_persona
      JOIN usuarios u ON per.id_persona = u.id_persona
      WHERE g.id_gasto = @id_gasto AND u.id_usuario = @id_usuario
    `);
    if (!result.recordset.length) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este gasto o no existe.' });
    }
    // Eliminar el gasto
    await pool.request()
    .input('id_gasto', sql.Int, id_gasto)
    .query(`DELETE FROM gastos WHERE id_gasto = @id_gasto`);
    res.status(200).json({ message: 'Gasto eliminado correctamente.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});
module.exports = router;