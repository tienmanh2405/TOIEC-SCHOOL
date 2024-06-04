import bcrypt  from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const hashedPassword = async (password) => {
    const saltRounds = 10; 
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
};

const comparePassword = async (checkPassword, password) =>{
    return await bcrypt.compare(checkPassword,password);
}

export { hashedPassword, comparePassword };