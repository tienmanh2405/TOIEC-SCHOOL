import { DB_CONFID } from "../configs/db.config.js";
import QuanLy from "../models/quanly.model.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/auth.js";
// import { DB_CONFID } from '../configs/db.config.js';
// import { comparePassword} from "../utils/password.js";
import dotenv from 'dotenv';

dotenv.config();

const getGiangVienById = async (req, res) => {
    try {
        const role = req.decoded.role;

        if (role!== DB_CONFID.resourses.admin.role && role!==DB_CONFID.resourses.giangvien.role) {
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
        // Tạo đối tượng cập nhật
        let updateData = {};
        if (HoTen) updateData.HoTen = HoTen;
        if (Email) updateData.Email = Email;
        if (SoDienThoai) updateData.SoDienThoai = SoDienThoai;
        if (TenTaiKhoan) updateData.TenTaiKhoan = TenTaiKhoan;
        if (MatKhau) {
            const hashed = await hashedPassword(MatKhau);
            updateData.MatKhau = hashed;
        }

        // Cập nhật thông tin quản lý
        const updatedRows = await QuanLy.update(updateData, MaQuanLy);
        if (!updatedRows) {
            return res.status(404).json({ success: false, message: "Giang Vien not found." });
        }

        res.status(200).json({ success: true, message: "Giang Vien updated successfully.",updatedRows });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            stack: error.stack
        });
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
        const checkRole = await QuanLy.getRoleById(giangvien.info.MaQuanLy);
        const role = checkRole.TenVaiTro;
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

export { getGiangVienById, updateGiangVien,  requestRefreshTokenGiangVien };
