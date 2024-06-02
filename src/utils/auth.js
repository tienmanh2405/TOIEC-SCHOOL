import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateAccessToken = (user,role) => {
    return jwt.sign({MaNguoiDung: user.MaNguoiDung, email: user.Email, role : role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
};
const generateRefreshToken = (user,role) => { 
    return jwt.sign({MaNguoiDung: user.MaNguoiDung, email: user.Email, role : role},process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' });
}
const verifyRefreshToken = (token) => {
    try{
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    }catch(err){
        return null;
    }
}

export {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
}