import { Router } from "express";

const routerUser = Router();

// Middleware para proteger las vistas que requieren autenticacion
function auth(req, res, next){
  if(req.session.user){
    if(req.session.user.role == "user" || req.session?.admin){
      return next();
    } else {
      return res.status(401).send("Error: not authorized!");
    }
  } else {
    return res.status(401).send("Error: not authorized!");
  }
}

routerUser.get("/login", (req, res) => {
  res.render("login", {});
});

routerUser.get("/register", (req, res) => {
  res.render("register", {});
})

routerUser.get("/profile", auth, (req, res) => {
  res.render("profile", {
    user: req.session.user
  });
});

export default routerUser;