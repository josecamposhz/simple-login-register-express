const express = require('express');
const exphbs = require("express-handlebars");

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
  })
);
app.set("view engine", "hbs");

app.listen(3000, () => console.log("Servidor en: http://localhost:3000"));

app.use('/axios', express.static(__dirname + '/node_modules/axios/dist'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

// vistas de la aplicación
app.use('/', require('./src/routes/views'));

// rutas de la api
app.use('/api', require('./src/routes/api'));