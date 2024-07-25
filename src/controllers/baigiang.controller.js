import BaiGiang from '../models/baigiang.model.js';
import { DB_CONFID } from "../configs/db.config.js";

const getBaiGiangs = async (req, res) => {
    try {
        let BaiGiangs = await BaiGiang.getAll()
        if(req.body){
            const { page, pageSize, sortOrder } = req.body;
        
            BaiGiangs = await BaiGiang.getAll(
                page || 1, 
                pageSize , 
                sortOrder || 'ASC'
            );
            return res.status(200).json({
                msg: 'Get BaiGiangs successfully!',
                data: BaiGiangs
            });
            }
        res.status(200).json({
            msg: 'Get BaiGiangs successfully!',
            data: BaiGiangs
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            stack: error.stack
        });
    }
};

const getBaiGiangByMaKhoaHoc = async (req, res) => {
    try {
        const MaKhoaHoc = req.params.MaKhoaHoc;
        const baigiang = await BaiGiang.findAll({MaKhoaHoc});
        if (!baigiang) {
            res.status(404).json({
                success: false,
                message: 'BaiGiang not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: baigiang
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createBaiGiang = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const { TenBaiGiang, MaKhoaHoc } = req.body;
        const newBaiGiang = new BaiGiang({ TenBaiGiang, MaKhoaHoc });
        const createdBaiGiang = await BaiGiang.create(newBaiGiang);
        res.status(201).json({
            success: true,
            message: 'BaiGiang created successfully',
            data: createdBaiGiang
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteBaiGiang = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const MaBaiGiang = req.params.MaBaiGiang;
        const deletedBaiGiang = await BaiGiang.delete(MaBaiGiang);
        res.status(200).json({
            success: true,
            message: 'BaiGiang deleted successfully',
            data: deletedBaiGiang
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateBaiGiang = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }

        const MaBaiGiang = req.params.MaBaiGiang;
        const { TenBaiGiang, MaKhoaHoc } = req.body;

        let updateData = {};
        if (TenBaiGiang) updateData.TenBaiGiang = TenBaiGiang;
        if (MaKhoaHoc) updateData.MaKhoaHoc = MaKhoaHoc;
        
        const updatedBaiGiang = await BaiGiang.update(updateData, MaBaiGiang);
        res.status(200).json({
            success: true,
            message: 'BaiGiang updated successfully',
            data: updatedBaiGiang
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export { getBaiGiangs, getBaiGiangByMaKhoaHoc, createBaiGiang, deleteBaiGiang, updateBaiGiang };
