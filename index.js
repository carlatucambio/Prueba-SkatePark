const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const expressFileUpload = require("express-fileupload");
require("dotenv").config();
const db = require ("./sql.js");
const server = app
module.exports = server;

const jwt = require("jsonwebtoken");
const { path } = require("express/lib/application");
const secretKey = "clavesecreta"

// Server
const PORT = process.env.PORT || 3000 ;
app.listen(PORT, () => console.log(`Servidor encendido: http://localhost:${PORT}`));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(
  expressFileUpload({
    limits: 5_000_000,
    abortOnLimit: true,
    responseOnLimit: "El tamaño de la imagen supera el límite permitido de 5 MB",
    createParentPath: true,
  })
);
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist"));
app.engine(
  "hbs",
  exphbs.engine({
    extname: '.hbs',
    defaultLayout: "main",
    layoutsDir: (__dirname + "/views/layouts"),
    partialsDir: (__dirname + "/views/partials"),
  })
);
app.set("view engine", "hbs");

//Vistas
app.use("/", require("./routes/vistas"));

//Consulta API REST 
app.use("/api/v1", require("./routes/myapiquery"));

app.get("*", (req, res) => {
  res.redirect("/");
});
  
