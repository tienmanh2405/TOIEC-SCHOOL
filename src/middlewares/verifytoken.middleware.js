import { verifyRefreshToken } from '../utils/auth.js';


export const verify = (req,res,next) => {
   try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
         return res.status(401).json({msg: 'Token is required!',success: false});
        }
        const decoded = verifyRefreshToken(token);
        req.decoded = decoded;
        next();
   }catch(err) {
        res.status(401).json({ msg: err.message });
   }
}