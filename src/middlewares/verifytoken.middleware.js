import { verifyAccessToken} from '../utils/auth.js';


export const verify = (req,res,next) => {
   try {
          const checkAuthorization = req.headers.authorization;
          if (!checkAuthorization) {
               return res.status(401).json({msg: 'Token is required!',success: false});
          }
          const token = checkAuthorization.split(' ')[1];
          if (!token) {
               return res.status(401).json({msg: 'Token is required!',success: false});
          }
          const decoded = verifyAccessToken(token);
          req.decoded = decoded;
          next();
   }catch(err) {
          res.status(401).json({ msg: err.message });
   }
}