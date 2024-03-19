import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from "bcrypt";

// __DIRNAME
const __dirname = dirname(fileURLToPath(import.meta.url));

// HASHEO Y AUTENTICACION
const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
}

// EXCEPCIONES PERSONALIZADAS
class NotFoundError extends Error {
  // Excepcion para elementos inexistentes
  constructor(message){
    super(message);
    this.name = "NotFoundError";
  }
}

class LimitError extends Error {
  // Excepcion para errores en el ingreso de limites
  constructor(message){
    super(message);
    this.name = "LimitError";
  }
}

class AlreadyExistsError extends Error {
  // Excepcion para elementos existentes
  constructor(message){
    super(message);
    this.name = "AlreadyExistsError";
  }
}

export { __dirname, NotFoundError, LimitError, AlreadyExistsError, createHash, isValidPassword };