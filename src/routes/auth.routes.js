import { Router } from "express";
import UserManager from "../dao/db/mongoManagers/user_manager.js";
import passport from "passport";
import session from "express-session";
// import { isValidPassword } from "../utils.js";

const routerAuth = Router();
const um = new UserManager();

routerAuth.post("/login", passport.authenticate("login", {failureRedirect: "/api/session/loginError"}),async (req, res) => {
  // const {email, password} = req.body;
  // try {
  //   const user = await um.getUser(email);
  //   if(user){
  //     if(isValidPassword(user, password)){
  //       delete user.password;
  //       req.session.user = user;
  //       return res.redirect("/api/product");
  //     }
  //   }
  //   res.status(400).send("Credenciales invalidas.");
  // } catch(err) {
  //   throw err;
  //  }
  if(req.user){
    res.send({status: "success", payload: req.user});
  } else {
    res.status(400).send({status: "error", error: "Invalid credentials"});
  }
});

routerAuth.post("/register", passport.authenticate("register", {failureRedirect: "/api/session/registerError"}), async (req, res) => {
  // const user = req.body;
  // console.log(user);
  // try {
  //   const newUser = await um.newUser(user);
  //   req.session.user = newUser;
  //   return res.redirect("/api/user/login");
  // } catch(err) {
  //   res.status(500).send({
  //     name: err.name,
  //     msg: err.message
  //   });
  // }
  res.send({status: "success", message: "User registered"});
});

routerAuth.get("/githubcallback", passport.authenticate("github", {}), async (req, res) => {
  req.session.user = req.user;
  
  res.setHeader("Content-Type", "application/json");
  res.json({payload: req.user});
})

routerAuth.get("/registerError", async (req, res) => {
  console.log("failed strategy");
  res.status(500).send({error: "Failed register"});
})

routerAuth.get("/loginError", async (req, res) => {
  console.log("failed strategy");
  res.status(500).send({error: "Failed login"})
})

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