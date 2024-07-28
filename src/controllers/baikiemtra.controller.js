import BaiKiemTra from '../models/baikiemtra.model.js';
import CauHoi from '../models/cauhoi.model.js';

const getBaiKiemTras = async (req, res) => {
    try {
        let BaiKiemTras = await BaiKiemTra.getAll()
        if(req.body){
            const { page, pageSize, sortOrder } = req.body;
        
            BaiKiemTras = await BaiKiemTra.getAll(
                page || 1, 
                pageSize , 
                sortOrder || 'ASC'
            );
            return res.status(200).json({
                msg: 'Get BaiKiemTras successfully!',
                data: BaiKiemTras
            });
            }
        res.status(200).json({
            msg: 'Get BaiKiemTras successfully!',
            data: BaiKiemTras
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            stack: error.stack
        });
    }
};


const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; 
};

const getBaiKiemTraByMaBaiKiemTra = async (_, res) => {
    try {
        const MaBaiKiemTra = getRandomIntInclusive(1, 4); //random lấy ra bài kiểm tra ngẫu nhiên
        const baikiemtra = await BaiKiemTra.findOne({MaBaiKiemTra});
        if (!baikiemtra) {
            res.status(404).json({
                success: false,
                message: 'BaiKiemTra not found'
            });
            return;
        }
        const cauhois = await CauHoi.findAll({MaBaiKiemTra});
        if (!cauhois) {
            res.status(404).json({
                success: false,
                message: 'No questions found for this BaiKiemTra'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: cauhois,
            MaBaiKiemTra
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createBaiKiemTra = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }

        const { TenBaiKiemTra } = req.body;
        const createdBaiKiemTra = await BaiKiemTra.create({ TenBaiKiemTra });
        res.status(201).json({
            success: true,
            message: 'BaiKiemTra created successfully',
            data: createdBaiKiemTra
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteBaiKiemTra = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const MaBaiKiemTra = req.params.MaBaiKiemTra;
        const deletedBaiKiemTra = await BaiKiemTra.delete(MaBaiKiemTra);
        res.status(200).json({
            success: true,
            message: 'BaiKiemTra deleted successfully',
            data: deletedBaiKiemTra
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateBaiKiemTra = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const MaBaiKiemTra = req.params.MaBaiKiemTra;
        const { TenBaiKiemTra, MaKhoaHoc, ThoiGianBatDau, ThoiGianKetThuc } = req.body;
        
        let updateData = {};
        if (TenBaiKiemTra) updateData.TenBaiKiemTra = TenBaiKiemTra;
        if (MaKhoaHoc) updateData.MaKhoaHoc = MaKhoaHoc;
        if (ThoiGianBatDau) updateData.ThoiGianBatDau = ThoiGianBatDau;
        if (ThoiGianKetThuc) updateData.ThoiGianKetThuc = ThoiGianKetThuc;
        
        const updatedBaiKiemTra = await BaiKiemTra.update(updateData, MaBaiKiemTra);
        res.status(200).json({
            success: true,
            message: 'BaiKiemTra updated successfully',
            data: updatedBaiKiemTra
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export { getBaiKiemTras,getBaiKiemTraByMaBaiKiemTra, createBaiKiemTra, deleteBaiKiemTra, updateBaiKiemTra };
