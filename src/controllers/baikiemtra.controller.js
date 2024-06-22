import BaiKiemTra from '../models/baikiemtra.model.js';

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

const getBaiKiemTraByMaKhoaHoc = async (req, res) => {
    try {
        const MaKhoaHoc = req.params.MaKhoaHoc;
        const baikiemtra = await BaiKiemTra.getById(MaKhoaHoc);
        if (!baikiemtra) {
            res.status(404).json({
                success: false,
                message: 'BaiKiemTra not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: baikiemtra
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

        const { TenBaiKiemTra, MaKhoaHoc, ThoiGianBatDau, ThoiGianKetThuc } = req.body;
        const newBaiKiemTra = new BaiKiemTra({ TenBaiKiemTra, MaKhoaHoc, ThoiGianBatDau, ThoiGianKetThuc });
        const createdBaiKiemTra = await BaiKiemTra.create(newBaiKiemTra);
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

export { getBaiKiemTras,getBaiKiemTraByMaKhoaHoc, createBaiKiemTra, deleteBaiKiemTra, updateBaiKiemTra };
