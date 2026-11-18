CREATE TABLE administradores(
	id_admin INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	correo VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(250) NOT NULL
);

CREATE TABLE modulos(
	id_modulo INT AUTO_INCREMENT PRIMARY KEY,
	id_admin INT NOT NULL,
	titulo VARCHAR(150) NOT NULL,
	descripcion TEXT NOT NULL,
	orden INT NOT NULL,
	FOREIGN KEY (id_admin) REFERENCES administradores(id_admin)
);

CREATE TABLE temas(
	id_tema INT AUTO_INCREMENT PRIMARY KEY,
	id_modulo INT NOT NULL,
	titulo VARCHAR(150) NOT NULL,
	contenido TEXT NOT NULL,
	fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (id_modulo) REFERENCES modulos(id_modulo)
);

CREATE TABLE preguntas (
	id_pregunta INT AUTO_INCREMENT PRIMARY KEY,
	id_modulo INT NOT NULL,
	enunciado TEXT NOT NULL,
	opcion_a VARCHAR(250) NOT NULL,
	opcion_b VARCHAR(250) NOT NULL,
	opcion_c VARCHAR(250) NOT NULL,
	respuesta_correcta CHAR(1) NOT NULL,
	FOREIGN KEY (id_modulo) REFERENCES modulos(id_modulo)
);

CREATE TABLE usuarios (
	id_usuario INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	correo VARCHAR(100) NOT NULL,
	password VARCHAR(250) NOT NULL
);

CREATE TABLE progreso (
	id_progreso INT AUTO_INCREMENT PRIMARY KEY,
	id_usuario INT NOT NULL,
	id_modulo INT NOT NULL,
	calificacion VARCHAR(20) NOT NULL,
	fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
	FOREIGN KEY (id_modulo) REFERENCES modulos(id_modulo)
);