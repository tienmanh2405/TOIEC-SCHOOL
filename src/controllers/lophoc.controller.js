import { DB_CONFID } from '../configs/db.config.js';
import BuoiHoc from '../models/buoihoc.model.js';
import HocVien from '../models/hocvien.model.js';
import KetQuaBaiKiemTra from '../models/ketquabaiKiemTra.model.js';
import LopHoc from '../models/lophoc.model.js';

const getLopHocs = async (req, res) => {
    try {
        let lophocs = await LopHoc.getAll();
        if (req.body) {
            const { page, pageSize, sortOrder } = req.body;

            lophocs = await LopHoc.getAll(
                page || 1,
                pageSize,
                sortOrder || 'ASC'
            );
            lophocs = lophocs.map(lophoc => {
                lophoc.LichHocTrongTuan = JSON.parse(lophoc.LichHocTrongTuan);
                return lophoc;
            });
            return res.status(200).json({
                msg: 'Get LopHoc successfully!',
                data: lophocs
            });
        }
        lophocs = lophocs.map(lophoc => {
            lophoc.LichHocTrongTuan = JSON.parse(lophoc.LichHocTrongTuan);
            return lophoc;
        });
        res.status(200).json({ success: true, data: lophocs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getLopHocByMaGiangVien = async (req, res) => {
    try {
        const role = req.decoded.role;
        if (!role || role!== DB_CONFID.resourses.admin.role && role!== DB_CONFID.resourses.giangvien.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const MaGiangVien = req.params.MaQuanLy;
        const lophoc = await LopHoc.findAll({MaGiangVien});
        res.status(200).json({ success: true, data: lophoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const getBuoiHocByMaLopHoc = async (req, res) => {
    try {
        const role = req.decoded.role;
        console.log(role);
        if (!role || role!== DB_CONFID.resourses.admin.role && role!== DB_CONFID.resourses.giangvien.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const MaLopHoc = req.params.MaLopHoc;
        const buoiHoc = await BuoiHoc.findAll({MaLopHoc});
        console.log(buoiHoc);
        res.status(200).json({ success: true, data: buoiHoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createLopHoc = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }

        const { NgayBatDau, NgayDuKienKetThuc, TongSoBuoiHoc, ThoiLuongHocTrenLop, LichHocTrongTuan, MaCoSo, MaKhoaHoc, MaGiangVien } = req.body;

        const newLopHoc = {
            NgayBatDau,
            NgayDuKienKetThuc,
            TongSoBuoiHoc,
            ThoiLuongHocTrenLop,
            LichHocTrongTuan: JSON.stringify(LichHocTrongTuan),
            MaCoSo,
            MaKhoaHoc,
            MaGiangVien
        };

        const createdLopHoc = await LopHoc.create(newLopHoc);
        res.status(201).json({ success: true, data: createdLopHoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateLopHoc = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const {NgayBatDau, NgayDuKienKetThuc, TongSoBuoiHoc, ThoiLuongHocTrenLop, LichHocTrongTuan, MaCoSo, MaKhoaHoc, MaGiangVien } = req.body;

        let updateData = {};
        if (NgayBatDau) updateData.NgayBatDau = NgayBatDau;
        if (NgayDuKienKetThuc) updateData.NgayDuKienKetThuc = NgayDuKienKetThuc;
        if (TongSoBuoiHoc) updateData.TongSoBuoiHoc = TongSoBuoiHoc;
        if (ThoiLuongHocTrenLop) updateData.ThoiLuongHocTrenLop = ThoiLuongHocTrenLop;
        if (LichHocTrongTuan) updateData.LichHocTrongTuan = LichHocTrongTuan;
        if (MaCoSo) updateData.MaCoSo = MaCoSo;
        if (MaKhoaHoc) updateData.MaKhoaHoc = MaKhoaHoc;
        if (MaGiangVien) updateData.MaGiangVien = MaGiangVien;

        const updatedLopHoc = await LopHoc.update(updateData, req.params.id);
        res.status(200).json({ success: true, data: updatedLopHoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteLopHoc = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin !== DB_CONFID.resources.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }

        const MaLopHoc = req.params.MaLopHoc;

        // Tìm tất cả các học viên trong lớp
        const hocViens = await HocVien.find({ MaLopHoc });

        // Xóa tất cả các kết quả bài kiểm tra của các học viên này
        const maHocViens = hocViens.map(hv => hv.MaHocVien);
        await KetQuaBaiKiemTra.deleteMany({ MaHocVien: maHocViens });

        // Xóa tất cả các học viên trong lớp
        await HocVien.deleteMany({ MaLopHoc });
        // Xóa buoihoc cua lop nay
        await BuoiHoc.deleteMany({ MaLopHoc });
        // Xóa lớp học
        const result = await LopHoc.delete(MaLopHoc);

        res.status(200).json({
            success: true,
            message: 'LopHoc deleted successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export { getLopHocs, getLopHocByMaGiangVien, createLopHoc, updateLopHoc, deleteLopHoc,getBuoiHocByMaLopHoc };
