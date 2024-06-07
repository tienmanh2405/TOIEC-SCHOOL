import KhoaHoc from '../models/khoahoc.model.js';

const getKhoaHocs = async (req, res) => {
    try {
        let khoahocs = await KhoaHoc.getAll();
        if (req.body) {
            const { page, pageSize, sortOrder } = req.body;

            khoahocs = await KhoaHoc.getAll(
                page || 1,
                pageSize,
                sortOrder || 'ASC'
            );
            return res.status(200).json({
                msg: 'Get KhoaHoc successfully!',
                data: khoahocs
            });
        }
        res.status(200).json({ success: true, data: khoahocs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getKhoaHocById = async (req, res) => {
    try {
        const khoahoc = await KhoaHoc.getById(req.params.id);
        res.status(200).json({ success: true, data: khoahoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createKhoaHoc = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin && roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }

        const {TenKhoaHoc, MoTa, ThoiLuong, ThoiLuongTrenLop, SiSoToiDa, GiaThanh } = req.body;

        const newKhoaHoc = {
            TenKhoaHoc,
            MoTa,
            ThoiLuong,
            ThoiLuongTrenLop,
            SiSoToiDa,
            GiaThanh
        };

        const createdKhoaHoc = await KhoaHoc.create(newKhoaHoc);
        res.status(201).json({ success: true, data: createdKhoaHoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateKhoaHoc = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin && roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }

        const {TenKhoaHoc, MoTa, ThoiLuong, ThoiLuongTrenLop, SiSoToiDa, GiaThanh } = req.body;

        let updateData = {};
        if (TenKhoaHoc) updateData.TenKhoaHoc = TenKhoaHoc;
        if (MoTa) updateData.MoTa = MoTa;
        if (ThoiLuong) updateData.ThoiLuong = ThoiLuong;
        if (ThoiLuongTrenLop) updateData.ThoiLuongTrenLop = ThoiLuongTrenLop;
        if (SiSoToiDa) updateData.SiSoToiDa = SiSoToiDa;
        if (GiaThanh) updateData.GiaThanh = GiaThanh;

        const updatedKhoaHoc = await KhoaHoc.update(updateData, req.params.id);
        res.status(200).json({ success: true, data: updatedKhoaHoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteKhoaHoc = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin && roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const khoahoc = await KhoaHoc.delete(req.params.id);
        
        res.status(200).json(khoahoc);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getKhoaHocs, getKhoaHocById, createKhoaHoc, updateKhoaHoc, deleteKhoaHoc };
