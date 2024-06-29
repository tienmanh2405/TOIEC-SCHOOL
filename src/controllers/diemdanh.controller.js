import DiemDanh from '../models/diemdanh.model.js';

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

export const getDiemDanhById = async (req, res) => {
    try {
        const MaDiemDanh = req.params.MaDiemDanh;
        const diemDanh = await DiemDanh.findOne(MaDiemDanh);
        if (!diemDanh) {
            res.status(404).json({
                success: false,
                message: 'DiemDanh not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: diemDanh
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
