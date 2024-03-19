import { userModel } from "../models/user.model.js";
import { createHash } from "../../../utils.js";

class UserManager {
  async newUser({ first_name, last_name, age, email, password, role }){
    console.log(createHash(password));
    try {
      const newUser = await userModel.create({
        first_name,
        last_name,
        age,
        email,
        password: createHash(password),
        role
      });
      return newUser;
    } catch(err) {
      throw err;
    }
  }

  async getUser(email){
    try {
      const user = await userModel.findOne({email: email}, {email: 1, first_name: 1, last_name: 1, password: 1});
      return user;
    } catch(err) {
      throw err;
    }
  }
}

export default UserManager;