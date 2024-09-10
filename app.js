// Crea un servidor web que utiliza express.js para manejar peticiones.
// Permite subir archivos a la carpeta 'public/hexfiles' utilizando el middleware
// multer y, posteriormente, devuelve el contenido del archivo en formato JSON,
// reemplazando todos los ':' con '+'.

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// Configuración para almacenar archivos en la carpeta 'public/hexfiles'
const storage = multer.diskStorage({
  // La carpeta donde se guardarán los archivos subidos.
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/hexfiles'));
  },
  // El nombre del archivo que se guardará.
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Endpoint para subir archivos. Espera que el archivo se llame 'hexfile'.
app.post('/upload', upload.single('hexfile'), (req, res) => {
  // Devuelve un JSON con el nombre del archivo subido y un mensaje.
  res.json({ message: 'Archivo subido exitosamente', file: req.file });
});

// Endpoint para obtener el archivo y devolverlo en JSON con los ":" reemplazados por "+"
app.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'public/hexfiles', filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      // Si no se encuentra el archivo, devuelve un error 404 con un JSON.
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    // Reemplaza todos los ':' con '+'.
    const modifiedContent = data.replace(/:/g, '+');

    // Devuelve el contenido modificado en un JSON.
    res.json({ content: modifiedContent });
  });
});

// Inicia el servidor en el puerto 3001.
app.listen(3001, '0.0.0.0', () => {
    console.log('Servidor corriendo en http://localhost:3001/file/Blink.ino.hex');
  });
app.get('/', (req, res) => {
  res.redirect('/index.html');
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Para que funcione en la web, debes seguir los siguientes pasos:
// 1. Crea un archivo .html en la carpeta public y agrega un formulario con un input de tipo file.
// 2. En el evento submit del formulario, haz una petición POST a la ruta '/upload' con el archivo adjunto.
// 3. En el servidor, el archivo se guardará en la carpeta 'public/hexfiles' y se devuelve un JSON con el nombre del archivo subido y un mensaje.
// 4. Para obtener el archivo, haz una petición GET a la ruta '/file/:filename' y se devuelve el contenido del archivo en formato JSON con los ":" reemplazados por "+".

