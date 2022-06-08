const { Router } = require("express");
const db = require("../sql.js");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const router = Router();

//consulta en ruta /api/v1

//Registro de usuarios en base de datos usuarios
router.post("/register", async (req, res) => { //  api/v1/register
  const { email, nombre, password, anos_experiencia, especialidad } = req.body;
  console.log(req.body);
  if (!req.files || !req.files.foto) {
    return res.status(500).send("La foto es requerida");
}
  const { foto } = req.files;
  foto.mv(path.resolve(__dirname, "../public/uploads", foto.name), async (err) => {
    if (err) {
      return res.status(500).send(err);
    }
 // encryptamos la contraseña (password)
  const hashedPassword = await bcrypt.hash(password, 10);
  const usuario = await db.nuevoUsuario(email, nombre, hashedPassword, anos_experiencia, especialidad, `uploads/${foto.name}`);
 res.status(201).send(usuario);
  });
});

//validar login usuario -- inicio de sesion
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await db.getUsuarioByEmail(email, password);
  //verificamos que el usuario esta en la base de datos
  if (!user) {
    return res.status(404).send({
      error: "Este usuario no está registrado en la base de datos",
      code: 404,
    });
  }
  //verificamos que las password coincidan con bcrypt.compare
  const validPassword = await bcrypt.compare(password, user.password);
  if (validPassword === false) {
    return res.status(401).send({ error: "Credenciales inválida", code: 401 });
  }
  //entregamos el token al usuario para que acceda a la información

  if (!user.estado) {
    return res.status(401).send({
      error: "Este skater aún no está habilitado para acceder a su cuenta",
      code: 401,
    });
  }
  const token = jwt.sign(user, process.env.SECRET_KEY, {
    expiresIn: 60 * 60 * 24,
  });
  res.send({ user, token });
  //console.log(token)
});


// //API skaters

router.get("/usuarios", async (req, res) => { //  api/v1/usuarios
  const usuarios = await db.getUsuarios();
  res.send(usuarios);
});

router.put("/usuarios/status", async (req, res) => { // api/v1/usuarios/status
  const { id, auth } = req.body;
  const usuario = await db.setUsuarioStatus(id, auth);
  res.send(usuario.estado);
});

router.put("/skaters", async (req, res) => {
  const { id, nombre, password, anos_experiencia, especialidad } = req.body;
  const hashedNewPassword = await bcrypt.hash(password, 10)
  //console.log(hashedNewPassword)
    try {
        await db.updateSkater(id, nombre, hashedNewPassword, anos_experiencia, especialidad);
        res.status(200).send("Datos actualizados con éxito");
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

router.delete("/skaters/:id", async (req, res) => {
  const { id } = req.params;
  try {
      await db.deleteSkater(id)
      res.status(200).send();
  }catch{
      res.status(500).send({
          error: `Algo salió mal... ${e}`,
          code: 500
      })
    } 
});

module.exports = router;
