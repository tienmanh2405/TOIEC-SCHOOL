import { DB_CONFID } from "../configs/db.config.js";
import QuanLy from "../models/quanly.model.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/auth.js";
// import { DB_CONFID } from '../configs/db.config.js';
import { comparePassword, hashedPassword } from "../utils/password.js";
import dotenv from 'dotenv';

dotenv.config();

const getAdmins = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        let role = 1;//role ung voi admin
        let admins = await QuanLy.getAllByRole(role);
        // if(req.body && Object.keys(req.body).length !== 0){
        //     const {page, pageSize, sortOrder } = req.body;
        //     admins = await QuanLy.getByRole(role, page||1, pageSize, sortOrder||'ASC');
        //     return res.status(200).json({
        //         msg: 'Get admins successfully!',
        //         data: admins
        //     });
        // }   
        res.status(200).json({ msg: 'admin successfully', data: admins });
    } catch (error) {
        res.status(500).json({
            msg: error,
            stack: error.stack
        });
    }
};

const getGiangViens = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        let role = 2; // role ung voi giang vien
        let giangviens = await QuanLy.getAllByRole(role);
        if(req.body){
            const {page, pageSize, sortOrder } = req.body;
            giangviens = await QuanLy.getByRole(role, page||1, pageSize, sortOrder||'ASC');
            return res.status(200).json({
                msg: 'Get giangviens successfully!',
                data: giangviens
            });
        }   
        res.status(200).json({ msg: 'admin successfully', data: giangviens });
    } catch (error) {
        res.status(500).json({
            msg: error,
            stack: error.stack
        });
    }
};

const getAdminById = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const MaQuanLy = req.params.MaQuanLy;
        const admin = await QuanLy.getById(MaQuanLy);
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            stack: error.stack
        });
    }
};

const createAdmin = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const { HoTen, Email, SoDienThoai, TenTaiKhoan, MatKhau } = req.body;

        let checkAdmin = await QuanLy.findOne({ Email });
        if (checkAdmin) {
            return res.status(400).json({ success: false, message: "Email already exists." });
        }

        checkAdmin = await QuanLy.findOne({ SoDienThoai });
        if (checkAdmin) {
            return res.status(400).json({ success: false, message: "Phone number already exists." });
        }

        checkAdmin = await QuanLy.findOne({ TenTaiKhoan });
        if (checkAdmin) {
            return res.status(400).json({ success: false, message: "Username already exists." });
        }

        const hashed = await hashedPassword(MatKhau);
        const admin = await QuanLy.create({ HoTen, Email, SoDienThoai, TenTaiKhoan, MatKhau: hashed });
        if (!admin) {
            return res.status(500).json({ success: false, message: "An error occurred.", error });
        }
        const updated = await QuanLy.updateRole('1',admin.id);
        if (!updated) {
            return res.status(500).json({ success: false, message: "An error occurred.", error });
        }
        return res.status(201).json({ success: true, message: "Admin created successfully.", admin });
    } catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred.", error });
    }
};

const createGiangVien = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const { HoTen, Email, SoDienThoai, TenTaiKhoan, MatKhau } = req.body;

        let checkGiangVien = await QuanLy.findOne({ Email });
        if (checkGiangVien) {
            return res.status(400).json({ success: false, message: "Email already exists." });
        }

        checkGiangVien = await QuanLy.findOne({ SoDienThoai });
        if (checkGiangVien) {
            return res.status(400).json({ success: false, message: "Phone number already exists." });
        }

        checkGiangVien = await QuanLy.findOne({ TenTaiKhoan });
        if (checkGiangVien) {
            return res.status(400).json({ success: false, message: "Username already exists." });
        }

        const hashed = await hashedPassword(MatKhau);
        const giangvien = await QuanLy.create({ HoTen, Email, SoDienThoai, TenTaiKhoan, MatKhau: hashed });
        if (!giangvien) {
            return res.status(500).json({ success: false, message: "An error occurred.", error });
        }
        return res.status(201).json({ success: true, message: "GiangVien created successfully.", giangvien });
    } catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred.", error });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
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
        console.log(updateData);
        if (Email) updateData.Email = Email;
        if (SoDienThoai) updateData.SoDienThoai = SoDienThoai;
        if (TenTaiKhoan) updateData.TenTaiKhoan = TenTaiKhoan;
        if (MatKhau) {
            const hashed = await hashedPassword(MatKhau);
            updateData.MatKhau = hashed;
        }

        // Cập nhật thông tin quản lý
        const updatedRows = await QuanLy.update(updateData, MaQuanLy);
        console.log(updatedRows);
        if (!updatedRows) {
            return res.status(404).json({ success: false, message: "Admin not found." });
        }

        res.status(200).json({ success: true, message: "Admin updated successfully.",updatedRows });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            stack: error.stack
        });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const MaQuanLy = req.params.MaQuanLy;
        const deletedAdmin = await QuanLy.delete(MaQuanLy);
        res.status(200).json(deletedAdmin);
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            stack: error.stack
        });
    }
};


const requestRefreshTokenAdmin =async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ msg: 'Refresh token is required!' });
        }
        const admin = verifyRefreshToken(refreshToken);
        if (!admin) {
            return res.status(404).json({ msg: 'Refresh token not found!' });
        }
        console.log(admin);
        const checkRole = await QuanLy.getRoleById(admin.info.MaQuanLy);
        const role = checkRole.TenVaiTro;
        if (role !== 'Admin') {
            return res.status(403).json({ msg: 'Unauthorized role!', success: false });
        }
        const newAccessToken = generateAccessToken(admin, role);
        res.status(200).json({ msg: 'Request refresh token successfully!', success: true, accessToken: newAccessToken });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            stack: error.stack
        });
    }
};

export { getAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin, requestRefreshTokenAdmin,getGiangViens, createGiangVien };
