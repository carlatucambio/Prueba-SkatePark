const { query } = require("express");
const { Router } = require ("express");
const db = require("../sql.js");
const requiresAuth = require("../middlewares/requiresAuth.js"); //validar que tenemos el token en el query params

const router = Router();


router.get("/", async (req, res) => {
  const usuarios = await db.getUsuarios();
    res.render("index", {usuarios, user: req.user});
  });


router.get("/admin", async (req, res) => {
  const usuarios = await db.getUsuarios();
    res.render("admin", { usuarios, user: req.user }); //tip para el perfil de la prueba skate park
  });

router.get("/skaters", requiresAuth, async(req, res) => {
  const usuarios = await db.getUsuarios();
    res.render("datos", { usuarios, user: req.user});
  });

router.get("/login", (req, res) => {
    res.render("login");
  });  

router.get("/registro", (req, res) => {
    res.render("registro");
  });  

module.exports = router;