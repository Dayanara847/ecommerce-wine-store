const server = require("express").Router();
const { User } = require("../db.js");


// Ruta ME

server.get("/me", async (req, res, next) => {
    try {
      if (req.user) {
        const { id } = req.user;
        const result = await User.findByPk(id);
        res.json(result);
      } else res.sendStatus(401);
    } catch (error) {
      next(error);
    }
  });

//Ruta para Registrarse

  server.post("/register", async function (req, res, next) {
    try {
      const user = await User.create(req.body);
      const { id, firstName, lastName, email, birthdate, cellphone, role, password } = user;
      return res.send(
        
          {
            id,
            firstName, 
            lastName, 
            email, 
            birthdate, 
            cellphone, 
            role, 
            password
          }
        
      );
    } catch (error) {
      res.sendStatus(500).send(error);
    }
  });

  server.post("/login", async function (req, res, next) {
    const {password, email} = req.body
    if (!password || !email) { res.sendStatus(400).send('Tienes que ingresar Email y Password') }
    try {
      User.findOne({
        where: {email}
      }).then (correctUser => {
        const prueba = correctUser.compare(password)
        console.log(prueba)
      }) 
    }
    catch (error) {
      res.send(error);
    }
  });



module.exports = server;