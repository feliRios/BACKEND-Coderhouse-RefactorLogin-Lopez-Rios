import { Router } from "express";
import UserManager from "../dao/db/mongoManagers/user_manager.js";
import { isValidPassword } from "../utils.js";

const routerAuth = Router();
const um = new UserManager();

routerAuth.post("/login", async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await um.getUser(email);
    if(user){
      if(isValidPassword(user, password)){
        delete user.password;
        req.session.user = user;
        return res.redirect("/api/product");
      }
    }
    res.status(400).send("Credenciales invalidas.");
  } catch(err) {
    throw err;
   }
});

routerAuth.post("/register", async (req, res) => {
  const user = req.body;
  console.log(user);
  try {
    const newUser = await um.newUser(user);
    req.session.user = newUser;
    return res.redirect("/api/user/login");
  } catch(err) {
    res.status(500).send({
      name: err.name,
      msg: err.message
    });
  }
});

routerAuth.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if(!err){
      res.redirect("/api/user/login");
    } else {
      res.status(500).send("Error en logout.");
    }
  });
});

export default routerAuth;