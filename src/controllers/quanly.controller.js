
import QuanLy from "../models/quanly.model.js";
import { generateAccessToken, generateRefreshToken} from "../utils/auth.js";
import { comparePassword } from "../utils/password.js";
import dotenv from 'dotenv';

dotenv.config();

const login = async (req, res) => {
    try {
        const { Email, MatKhau } = req.body;
        const quanly = await QuanLy.findOne({ Email });
        if (!quanly) {
            return res.status(404).json({ msg: 'QuanLy not found!', success: false });
        }
        const checkMatKhau = await comparePassword(MatKhau, quanly.MatKhau);
        if (!checkMatKhau) {
            return res.status(401).json({ msg: 'Incorrect password!', success: false });
        }
        const checkRole = await QuanLy.getRoleById(quanly.MaQuanLy);
        const role = checkRole.TenVaiTro;
        if (role !== 'Admin' || role !== 'GiangVien') {
            return res.status(403).json({ msg: 'Unauthorized role!', success: false });
        }
        const accessToken = generateAccessToken(quanly, role);
        const refreshToken = generateRefreshToken(quanly, role);
        res.status(200).json({ msg: 'Login successfully!', success: true, accessToken, refreshToken, quanly });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            stack: error.stack
        });
    }
};

export {
    login
}