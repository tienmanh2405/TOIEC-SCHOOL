import { DB_CONFID } from "../configs/db.config.js";
import QuanLy from "../models/quanly.model.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/auth.js";
// import { DB_CONFID } from '../configs/db.config.js';
import { comparePassword} from "../utils/password.js";
import dotenv from 'dotenv';

dotenv.config();

const getGiangVienById = async (req, res) => {
    try {
        const role = req.decoded.role;
        if (role!== DB_CONFID.resourses.admin.role || role==DB_CONFID.resourses.giangvien.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const MaQuanLy = req.params.MaQuanLy;
        const giangvien = await QuanLy.getById(MaQuanLy);
        res.status(200).json(giangvien);
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            stack: error.stack
        });
    }
};

const updateGiangVien = async (req, res) => {
    try {
        const role = req.decoded.role;
        if (!role || role === DB_CONFID.resourses.user.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const MaQuanLy = req.params.MaQuanLy;
        const {HoTen,Email,SoDienThoai,TenTaiKhoan,MatKhau} = req.body;

        let check = await QuanLy.findOne({ Email });
        if (check) {
            return res.status(400).json({ success: false, message: "Email already exists." });
        }

        check = await QuanLy.findOne({ SoDienThoai });
        if (check) {
            return res.status(400).json({ success: false, message: "Phone number already exists." });
        }

        check = await QuanLy.findOne({ TenTaiKhoan });
        if (check) {
            return res.status(400).json({ success: false, message: "Username already exists." });
        }
        const hashed = await hashedPassword(MatKhau);
        const updatedGiangVien = await QuanLy.update({HoTen,Email,SoDienThoai,TenTaiKhoan,MatKhau:hashed}, MaQuanLy);
        res.status(200).json(updatedGiangVien);
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            stack: error.stack
        });
    }
};

const deleteGiangVien = async (req, res) => {
    try {
        const role = req.decoded.role;
        if (!role || role === DB_CONFID.resourses.user.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const MaQuanLy = req.params.MaQuanLy;
        const deletedGiangVien = await QuanLy.delete(MaQuanLy);
        res.status(200).json(deletedGiangVien);
    } catch (error) {
        res.status({msg: error.message,stack: error.stack})
    }
};


const requestRefreshTokenGiangVien = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ msg: 'Refresh token is required!' });
        }
        const giangvien = verifyRefreshToken(refreshToken);
        if (!giangvien) {
            return res.status(404).json({ msg: 'Refresh token not found!' });
        }
        const role = await QuanLy.getRoleById(giangvien.MaQuanLy);
        if (role !== 'GiangVien') {
            return res.status(403).json({ msg: 'Unauthorized role!', success: false });
        }
        const newAccessToken = generateAccessToken(giangvien, role);
        res.status(200).json({ msg: 'Request refresh token successfully!', success: true, accessToken: newAccessToken });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            stack: error.stack
        });
    }
};

export { getGiangVienById, updateGiangVien, deleteGiangVien, requestRefreshTokenGiangVien };
