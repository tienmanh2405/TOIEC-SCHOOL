import { DB_CONFID } from '../configs/db.config.js';
import ChiTietBaiGiang from '../models/chitietbaigiang.model.js';

const getChiTietBaiGiangs = async (req, res) => {
    try {
        let ChiTietBaiGiangs = await ChiTietBaiGiang.getAll()
        if(req.body){
            const { page, pageSize, sortOrder } = req.body;
        
            ChiTietBaiGiangs = await ChiTietBaiGiang.getAll(
                page || 1, 
                pageSize , 
                sortOrder || 'ASC'
            );
            return res.status(200).json({
                msg: 'Get ChiTietBaiGiangs successfully!',
                data: ChiTietBaiGiangs
            });
            }
        res.status(200).json({
            msg: 'Get ChiTietBaiGiangs successfully!',
            data: ChiTietBaiGiangs
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            stack: error.stack
        });
    }
};
/// lấy theo BaiGiang
const getChiTietBaiGiangById = async (req, res) => {
    try {
        const MaChiTiet = req.params.MaChiTiet;
        const chitietbaigiang = await ChiTietBaiGiang.getById(MaChiTiet);
        if (!chitietbaigiang) {
            res.status(404).json({
                success: false,
                message: 'ChiTietBaiGiang not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: chitietbaigiang
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
/// lấy theo BaiGiang
const getChiTietBaiGiangByMaBaiGiang = async (req, res) => {
    try {
        const MaBaiGiang = req.params.MaBaiGiang;
        const chitietbaigiang = await ChiTietBaiGiang.findAll({MaBaiGiang});
        if (!chitietbaigiang) {
            res.status(404).json({
                success: false,
                message: 'ChiTietBaiGiang not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: chitietbaigiang
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createChiTietBaiGiang = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }

        const { MaBaiGiang, TenNoiDung, NoiDung, TaiLieu } = req.body;
        const newChiTietBaiGiang = new ChiTietBaiGiang({ MaBaiGiang, TenNoiDung, NoiDung, TaiLieu });
        const createdChiTietBaiGiang = await ChiTietBaiGiang.create(newChiTietBaiGiang);
        res.status(201).json({
            success: true,
            message: 'ChiTietBaiGiang created successfully',
            data: createdChiTietBaiGiang
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteChiTietBaiGiang = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }

        const MaChiTiet = req.params.MaChiTiet;
        const deletedChiTietBaiGiang = await ChiTietBaiGiang.delete(MaChiTiet);
        res.status(200).json({
            success: true,
            message: 'ChiTietBaiGiang deleted successfully',
            data: deletedChiTietBaiGiang
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateChiTietBaiGiang = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }

        const MaChiTiet = req.params.MaChiTiet;
        const { TenNoiDung, NoiDung, TaiLieu } = req.body;
        let updateData = {};
        if (TenNoiDung) updateData.TenNoiDung = TenNoiDung;
        if (NoiDung) updateData.NoiDung = NoiDung;
        if (TaiLieu) updateData.TaiLieu = TaiLieu;
        const updatedChiTietBaiGiang = await ChiTietBaiGiang.update(updateData, MaChiTiet);
        res.status(200).json({
            success: true,
            message: 'ChiTietBaiGiang updated successfully',
            data: updatedChiTietBaiGiang
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export { getChiTietBaiGiangs, getChiTietBaiGiangById,getChiTietBaiGiangByMaBaiGiang, createChiTietBaiGiang, deleteChiTietBaiGiang, updateChiTietBaiGiang };
