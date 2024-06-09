import DangKyHoc from '../models/dangkyhoc.model.js';
import KhoaHoc from '../models/khoahoc.model.js';
import stripe from '../configs/stripe.config.js';
import Users from "../models/user.model.js";
import CoSoDaoTao from "../models/cosodaotao.model.js";

const getDangKyHocs = async (req, res) => {
    try {
        let dangkyhocs = await DangKyHoc.getAll();
        if (req.body) {
            const { page, pageSize, sortOrder } = req.body;

            dangkyhocs = await DangKyHoc.getAll(
                page || 1,
                pageSize,
                sortOrder || 'ASC'
            );
            return res.status(200).json({
                msg: 'Get DangKyHoc successfully!',
                data: dangkyhocs
            });
        }
        res.status(200).json({ success: true, data: dangkyhocs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDangKyHocById = async (req, res) => {
    try {
        const dangkyhoc = await DangKyHoc.getById(req.params.id);
        res.status(200).json({ success: true, data: dangkyhoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createDangKyHoc = async (req, res) => {
    try {
        const { HoTen, Email, SoDienThoai, MaKhoaHoc, MaCoSo, MaNguoiDung } = req.body;

        const newDangKyHoc = {
            HoTen,
            Email,
            SoDienThoai,
            MaKhoaHoc,
            MaCoSo,
            MaNguoiDung,
            TrangThaiThanhToan: false // Thêm cột này khi tạo mới
        };

        const createdDangKyHoc = await DangKyHoc.create(newDangKyHoc);
        res.status(201).json({ success: true, data: createdDangKyHoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateDangKyHoc = async (req, res) => {
    try {
        const { HoTen, Email, SoDienThoai, MaKhoaHoc, MaCoSo, MaNguoiDung, TrangThaiThanhToan } = req.body;

        let updateData = {};
        if (HoTen) updateData.HoTen = HoTen;
        if (Email) updateData.Email = Email;
        if (SoDienThoai) updateData.SoDienThoai = SoDienThoai;
        if (MaKhoaHoc) updateData.MaKhoaHoc = MaKhoaHoc;
        if (MaCoSo) updateData.MaCoSo = MaCoSo;
        if (MaNguoiDung) updateData.MaNguoiDung = MaNguoiDung;
        if (TrangThaiThanhToan !== undefined) updateData.TrangThaiThanhToan = TrangThaiThanhToan;

        const updatedDangKyHoc = await DangKyHoc.update(updateData, req.params.id);
        res.status(200).json({ success: true, data: updatedDangKyHoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteDangKyHoc = async (req, res) => {
    try {
        const deleteDKH = await DangKyHoc.delete(req.params.id);
        res.status(200).json(deleteDKH);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createPaymentIntent = async (req, res) => {
    try {
        const { MaKhoaHoc, HoTen, Email, SoDienThoai, MaCoSo, MaNguoiDung } = req.body;
        
        const course = await KhoaHoc.getById(MaKhoaHoc);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const newDangKyHoc = {
            HoTen,
            Email,
            SoDienThoai,
            MaKhoaHoc,
            MaCoSo,
            MaNguoiDung,
            TrangThaiThanhToan: false
        };

        const createdDangKyHoc = await DangKyHoc.create(newDangKyHoc);
        // Create a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: course.GiaThanh * 100, // amount in cents
            currency: 'usd',
            metadata: { MaKhoaHoc, MaDangKy: createdDangKyHoc.id },
        });
        const updateClientSecret = await DangKyHoc.update({clientSecret: paymentIntent.client_secret},createdDangKyHoc.id);
        res.status(200).json({
            success: true,
            DangKyHoc: updateClientSecret
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getDangKyHocs, getDangKyHocById, createDangKyHoc, updateDangKyHoc, deleteDangKyHoc, createPaymentIntent };
