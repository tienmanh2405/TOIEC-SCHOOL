import DiemDanh from '../models/diemdanh.model.js';
import BuoiHoc from '../models/buoihoc.model.js';

export const createDiemDanh = async (req, res) => {
    try {
        const { MaHocVien, MaBuoiHoc, TrangThai } = req.body;
        const result = await DiemDanh.create({ MaHocVien, MaBuoiHoc, TrangThai });
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

export const getDiemDanhs = async (req, res) => {
    try {
        let DiemDanhs = await DiemDanh.getAll()
        if(req.body){
            const { page, pageSize, sortOrder } = req.body;
        
            DiemDanhs = await DiemDanh.getAll(
                page || 1, 
                pageSize , 
                sortOrder || 'ASC'
            );
            return res.status(200).json({
                msg: 'Get DiemDanhs successfully!',
                data: DiemDanhs
            });
            }
        res.status(200).json({
            msg: 'Get DiemDanhs successfully!',
            data: DiemDanhs
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            stack: error.stack
        });
    }
};

export const getDiemDanhByMaLopHoc = async (req, res) => {
    try {
        const { MaLopHoc } = req.params;
        const BuoiHocs = await BuoiHoc.findAll({ MaLopHoc });
        if (!BuoiHocs.length) {
            return res.status(404).json({
                success: false,
                message: 'BuoiHoc not found'
            });
        }
        const allDiemDanh = [];
        // Fetch DiemDanh for each BuoiHoc individually
        for (const buoiHoc of BuoiHocs) {
            const diemDanh = await DiemDanh.findAll({ MaBuoiHoc: buoiHoc.MaBuoiHoc });
            allDiemDanh.push(...diemDanh);
        }
        return res.status(200).json({
            success: true,
            data: allDiemDanh
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

