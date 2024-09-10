const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// Configuración para almacenar archivos en la carpeta 'public/hexfiles'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/hexfiles'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Endpoint para subir archivos
app.post('/upload', upload.single('hexfile'), (req, res) => {
  res.json({ message: 'Archivo subido exitosamente', file: req.file });
});

// Endpoint para obtener el archivo y devolverlo en JSON con los ":" reemplazados por "+"
app.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'public/hexfiles', filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    // Reemplazar ':' con '+'
    const modifiedContent = data.replace(/:/g, '+');

    // Devolver el contenido modificado en un JSON
    res.json({ content: modifiedContent });
  });
});

// Iniciar el servidor
app.listen(3001, '0.0.0.0', () => {
    console.log('Servidor corriendo en http://localhost:3001');
  });
