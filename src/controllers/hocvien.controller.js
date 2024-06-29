import HocVien from '../models/hocvien.model.js';

export const createHocVien = async (req, res) => {
    try {
        const { HoTen, Email, DiemDanh, DiemSo, NhanXet, MaLopHoc} = req.body;
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
        const { HoTen, Email, DiemSo, NhanXet, MaLopHoc} = req.body;
        let updateData = {};
        if (HoTen) updateData.HoTen = HoTen;
        if (Email) updateData.Email = Email;
        if (DiemDanh) updateData.DiemDanh = DiemDanh;
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
