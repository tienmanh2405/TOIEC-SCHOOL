import BuoiHoc from '../models/buoihoc.model.js';

export const createBuoiHoc = async (req, res) => {
    try {
        const { MaLopHoc,NgayHoc } = req.body;
        const result = await BuoiHoc.create({ MaLopHoc,NgayHoc });
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

export const getBuoiHocs = async (req, res) => {
    try {
        let BuoiHocs = await BuoiHoc.getAll()
        if(req.body){
            const { page, pageSize, sortOrder } = req.body;
        
            BuoiHocs = await BuoiHoc.getAll(
                page || 1, 
                pageSize , 
                sortOrder || 'ASC'
            );
            return res.status(200).json({
                msg: 'Get BuoiHocs successfully!',
                data: BuoiHocs
            });
            }
        res.status(200).json({
            msg: 'Get BuoiHocs successfully!',
            data: BuoiHocs
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            stack: error.stack
        });
    }
};

export const getBuoiHocByMaLopHoc = async (req, res) => {
    try {
        const MaLopHoc = req.params.MaLopHoc;
        const buoiHoc = await BuoiHoc.find(MaLopHoc);
        if (!buoiHoc) {
            res.status(404).json({
                success: false,
                message: 'BuoiHoc not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: buoiHoc
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
