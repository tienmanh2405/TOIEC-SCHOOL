import { DB_CONFID } from '../configs/db.config.js';
import HocVien from '../models/hocvien.model.js';
import KetQuaBaiKiemTra from '../models/ketquabaiKiemTra.model.js';

export const createHocVien = async (req, res) => {
    try {
        const { HoTen, Email, DiemSo, NhanXet, MaLopHoc} = req.body;
        const result = await HocVien.create({ HoTen, Email, DiemSo, NhanXet, MaLopHoc});
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getHocViens = async (req, res) => {
    try {
        let HocViens = await HocVien.getAll()
        if(req.body){
            const { page, pageSize, sortOrder } = req.body;
        
            HocViens = await HocVien.getAll(
                page || 1, 
                pageSize , 
                sortOrder || 'ASC'
            );
            return res.status(200).json({
                msg: 'Get HocViens successfully!',
                data: HocViens
            });
            }
        res.status(200).json({
            msg: 'Get HocViens successfully!',
            data: HocViens
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            stack: error.stack
        });
    }
};

export const getHocVienByMaLopHoc = async (req, res) => {
    try {
        const role = req.decoded.role;
        if (!role || role!== DB_CONFID.resourses.admin.role && role!== DB_CONFID.resourses.giangvien.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const MaLopHoc = req.params.MaLopHoc;
        const hocVien = await HocVien.findAll({MaLopHoc});
        if (!hocVien) {
            res.status(404).json({
                success: false,
                message: 'HocVien not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: hocVien
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getHocVienById = async (req, res) => {
    try {
        const MaHocVien = req.params.MaHocVien;
        const hocVien = await HocVien.findOne(MaHocVien);
        if (!hocVien) {
            res.status(404).json({
                success: false,
                message: 'HocVien not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: hocVien
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateHocVien = async (req, res) => {
    try {
        const MaHocVien = req.params.MaHocVien;
        const { HoTen, Email} = req.body;
        let updateData = {};
        if (HoTen) updateData.HoTen = HoTen;
        if (Email) updateData.Email = Email;

        const updatedHocVien = await HocVien.update(updateData, MaHocVien);
        res.status(200).json({
            success: true,
            message: 'HocVien updated successfully',
            data: updatedHocVien
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const updateHocVienByQuanLy = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin == DB_CONFID.resourses.user.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const MaHocVien = req.params.MaHocVien;
        const { HoTen, Email, DiemSo, NhanXet, MaLopHoc} = req.body;
        let updateData = {};
        if (HoTen) updateData.HoTen = HoTen;
        if (Email) updateData.Email = Email;
        if (DiemSo) updateData.DiemSo = DiemSo;
        if (NhanXet) updateData.NhanXet = NhanXet;
        if (MaLopHoc) updateData.MaLopHoc = MaLopHoc;

        const updatedHocVien = await HocVien.update(updateData, MaHocVien);
        res.status(200).json({
            success: true,
            message: 'HocVien updated successfully',
            data: updatedHocVien
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const deleteHocVien = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }

        const MaHocVien = req.params.MaHocVien;
        // Xóa bản ghi trong KetQuaBaiKiemTra trước
        const findDiemKiemTra = await KetQuaBaiKiemTra.findOne({MaHocVien});
        if(findDiemKiemTra)
            await KetQuaBaiKiemTra.delete(findDiemKiemTra.MaKetQua);

        // Xóa học viên
        const result = await HocVien.delete(MaHocVien);
        res.status(200).json({
            success: true,
            message: 'HocVien deleted successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
