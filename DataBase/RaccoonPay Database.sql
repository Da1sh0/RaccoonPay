-- Tipo Identificacion
CREATE TABLE tipos_identificacion (
    id_tipo_identificacion INT PRIMARY KEY IDENTITY(1,1),
    nombre_tipo VARCHAR(50) NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    fecha_modificacion DATETIME DEFAULT GETDATE()
)
-- Personas
CREATE TABLE personas (
    id_persona INT PRIMARY KEY IDENTITY(1,1),
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    identificacion VARCHAR(50) UNIQUE NOT NULL,
    tipo_identificacion INT NOT NULL,
    celular VARCHAR(20) UNIQUE NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    fecha_modificacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (tipo_identificacion) REFERENCES tipos_identificacion(id_tipo_identificacion)
)

-- Perfiles
CREATE TABLE perfiles (
    id_perfil INT PRIMARY KEY IDENTITY(1,1),
    nombre_perfil VARCHAR(50) NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    fecha_modificacion DATETIME DEFAULT GETDATE()
)

-- Usuarios
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY IDENTITY(1,1),
    id_persona INT UNIQUE NOT NULL,
    login VARCHAR(50) UNIQUE NOT NULL,
    contrasenna VARCHAR(255) NOT NULL,
    id_perfil INT NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    fecha_modificacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_persona) REFERENCES personas(id_persona),
    FOREIGN KEY (id_perfil) REFERENCES perfiles(id_perfil)
)
ALTER TABLE usuarios
ADD activo BIT NOT NULL DEFAULT 0
-- Periodos
CREATE TABLE periodos (
    id_periodo INT PRIMARY KEY IDENTITY(1,1),
    id_persona INT NOT NULL,
    mes VARCHAR(20) NOT NULL,
    año INT NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    fecha_modificacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_persona) REFERENCES personas(id_persona)
)
ALTER TABLE periodos 
ADD fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL;
ALTER TABLE periodos  
ALTER COLUMN mes NVARCHAR(50);
EXEC sp_rename 'periodos.mes', 'nombre', 'COLUMN';

--Categorias
CREATE TABLE categorias (
    id_categoria INT PRIMARY KEY IDENTITY(1,1),
    nombre_categoria VARCHAR(100) NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    fecha_modificacion DATETIME DEFAULT GETDATE()
)

-- Opciones
CREATE TABLE opciones (
    id_opcion INT PRIMARY KEY IDENTITY(1,1),
    tipo_opcion VARCHAR(50) NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    fecha_modificacion DATETIME DEFAULT GETDATE()
)

-- Gastos
CREATE TABLE gastos (
    id_gasto INT PRIMARY KEY IDENTITY(1,1),
    id_periodo INT NOT NULL,
    nombre VARCHAR(255) NOT NULL, -- Nombre del gasto
    id_categoria INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    id_opcion INT NOT NULL, -- Adicional o Restante
    fecha_creacion DATETIME DEFAULT GETDATE(),
    fecha_modificacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_periodo) REFERENCES periodos(id_periodo),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    FOREIGN KEY (id_opcion) REFERENCES opciones(id_opcion)
)

-- Insert Fijos
INSERT INTO tipos_identificacion (nombre_tipo) VALUES
('Cédula de Ciudadanía'),
('Cédula de Extranjería'),
('Pasaporte'),
('Tarjeta de Identidad'),
('Registro Civil')
select * from tipos_identificacion
INSERT INTO perfiles (nombre_perfil) VALUES
('Administrador'),
('Usuario')
select * from perfiles
INSERT INTO categorias (nombre_categoria) VALUES
('Sueldo'),
('Otros'),
('Alquiler'),
('Servicios Públicos'),
('Transporte'),
('Alimentación'),
('Salud'),
('Educación'),
('Tecnologio y videojuegos'),
('Mensualidades y plataformas'),
('Deudas y Préstamos'),
('Ahorros e Inversiones'),
('Ropa')
select * from categorias
INSERT INTO opciones (tipo_opcion) VALUES
('Adicional'),
('Restante')
select * from opciones







