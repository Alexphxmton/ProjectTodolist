const express = require('express');
const { conectarDB } = require('./db');
const rutas = require('./routes/todoRoute');
const cors = require('cors');;

const app = express();


app.use(cors());
app.use(express.json());
app.use('/api', rutas);


const PORT = 4000;


async function iniciarServidor() {
  try {
    await conectarDB();

    app.listen(PORT, () => {
      console.log(` Servidor en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('No se pudo iniciar el servidor');
  }
}

iniciarServidor();