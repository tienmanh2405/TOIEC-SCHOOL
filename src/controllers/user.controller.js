import Users from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/auth.js";
import { DB_CONFID } from '../configs/db.config.js';
import { comparePassword, hashedPassword } from "../utils/password.js";
import dotenv from 'dotenv';

dotenv.config();

const getUsers = async (req, res) => {
    try {
        let users = await Users.getAll()
        if(req.body){
            const { page, pageSize, sortOrder } = req.body;
        
            const users = await Users.getAll(
                page || 1, 
                pageSize , 
                sortOrder || 'ASC'
            );
            return res.status(200).json({
                msg: 'Get users successfully!',
                data: users
            });
            }
        res.status(200).json({
            msg: 'Get users successfully!',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            stack: error.stack
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const MaNguoiDung = req.params.MaNguoiDung;
        const user = await Users.getById(MaNguoiDung)
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
};

const createUser = async (req, res) => {
    try {
        const { HoTen, Email, SoDienThoai, TenTaiKhoan, MatKhau } = req.body;
        
        // Check if email already exists
        let checkUser = await Users.findOne({ Email: Email });
        if (checkUser) {
            return res.status(400).json({ success: false, message: "Email already exists." });
        }

        // Check if phone number already exists
        checkUser = await Users.findOne({ SoDienThoai: SoDienThoai });
        if (checkUser) {
            return res.status(400).json({ success: false, message: "Phone number already exists." });
        }

        // Check if username already exists
        checkUser = await Users.findOne({ TenTaiKhoan: TenTaiKhoan });
        if (checkUser) {
            return res.status(400).json({ success: false, message: "Username already exists." });
        }
        
        // Hash the password
        const hashed = await hashedPassword(MatKhau);
        
        // Create a new user
        const user = await Users.create({ HoTen, Email, SoDienThoai, TenTaiKhoan, MatKhau: hashed });
        
        // Send success response
        return res.status(201).json({ success: true, message: "User created successfully.", user });
    } catch (error) {
        // Send error response
        return res.status(500).json({ success: false, message: "An error occurred.", error });
    }
};


const updateUser = async (req, res) => {
    try {
        const MaNguoiDung = req.params.MaNguoiDung;
        const infoUser = req.body;
        const updateUser = await Users.update(infoUser, MaNguoiDung);
        res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteUser = async (req, res) => {
    try {
        const checkMaNguoiDung = req.decoded.MaNguoiDung;
        const MaNguoiDung = req.params.MaNguoiDung;
        if(checkMaNguoiDung!== MaNguoiDung){
            res.status(401).json({msg: 'You do not have permission to delete this user!',success: false});
            return;
        }
        const deleteUser = await Users.delete(MaNguoiDung);
        res.status(200).json(deleteUser);
    } catch (error) {
        res.status(500).json(error);
    }
};

const login = async (req, res) =>{
    try {
        const Email = req.body.Email;
        const MatKhau = req.body.MatKhau;
        const user = await Users.findOne({Email: Email});
        if(!user){
            res.status(404).json({msg: 'User not found!',success: false});
            return;
        }
        const checkMatKhau = await comparePassword(MatKhau, user.MatKhau);
        if (!checkMatKhau) {
            return res.status(401).json({ msg: 'Incorrect password!', success: false });
        }
        const accessToken = generateAccessToken(user,DB_CONFID.resourses.user.role);
        const refreshToken = generateRefreshToken(user,DB_CONFID.resourses.user.role);
        res.status(200).json({msg: 'Login sussecfully!',success: true,accessToken,refreshToken, user: user});
    } catch (error) {
        res.status(500).json(error);
    }
}
const requestRefreshToken = (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        if(!refreshToken){
            res.status(400).json({msg: 'Refresh token is required!'});
            return;
        }
        const user = verifyRefreshToken(refreshToken);
        if(!user){
            res.status(404).json({msg: 'Refresh token not found!'});
            return;
        }
        const newAccessToken = generateAccessToken(user,DB_CONFID.resourses.user.role);
        res.status(200).json({msg: 'Request refresh token sussecfully!',success: true,accessToken: newAccessToken});
    } catch (error) {
        res.status(500).json(error);
    }
}
export { getUsers, getUserById, createUser, deleteUser, updateUser, login, requestRefreshToken };