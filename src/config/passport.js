import passport from "passport";
import local from "passport-local";
import session from "express-session";
import github from "passport-github2";
import UserManager from "../dao/db/mongoManagers/user_manager.js";
import { isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;
const um = new UserManager();

const initializePassport = () => {
  passport.use("register", new LocalStrategy({
    usernameField: "email",
    passReqToCallback: true
  }, async (req, username, password, done) => {
    try {
      let userNew = req.body;
      let result = await um.newUser(userNew);
      done(null, result);
    } catch(err) {
      done("Error: el usuario ya existe", err);
    }
  }));

  passport.use("login", new LocalStrategy({usernameField: "email"}, async (username, password, done) => {
    try {
      const user = await um.getUser(username);
      if(user){
        if(isValidPassword(user, password)){
          return done(null, user);
        }
      }
      return done(null, false);
    } catch(err) {
      return done(err);
    }
  }));

  passport.use("github", new github.Strategy({
    clientID: "Iv1.b903d7c34b7ea13c",
    clientSecret: "a088e9ff785929d7da513fdbd92755ff3dee56e6",
    callbackURL: "http://localhost:8080/api/session/githubcallback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile);
      const userGitEmail = profile.id + "@github.com";
      let user = await um.getUser(profile._json.email);
      if(!user){
        let newUser = um.newUser({
          first_name: profile._json.name,
          last_name: "Empty",
          age: 18,
          email: userGitEmail,
          password: "",
          role: "user"
        });
        console.log("El usuario NO SE ENCONTRABA REGISTRADO y accedio");
        done(null, newUser);
      } else {
        console.log("El usuario ya se encontraba registrado y accedio");
        done(null, user);
      }
    } catch(err) {
      return done(err);
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await um.getUserById(id);
    done(null, user);
  });
}

export default initializePassport;