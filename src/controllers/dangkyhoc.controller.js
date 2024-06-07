import DangKyHoc from '../models/dangkyhoc.model.js';
import KhoaHoc from '../models/khoahoc.model.js';
import stripe from '../configs/stripe.config.js';

const getDangKyHocs = async (req, res) => {
    try {
        const { page = 1, pageSize, sortOrder = 'ASC' } = req.query;
        const dangkyhocs = await DangKyHoc.getAll(page, pageSize, sortOrder);
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
        const { MaKhoaHoc, MaQuanLy } = req.body;
        
        // Check if the course exists
        const course = await KhoaHoc.getById(MaKhoaHoc);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const newDangKyHoc = await DangKyHoc.create({ MaKhoaHoc, MaQuanLy });
        res.status(201).json({ success: true, data: newDangKyHoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateDangKyHoc = async (req, res) => {
    try {
        const updatedDangKyHoc = await DangKyHoc.update(req.body, req.params.id);
        res.status(200).json({ success: true, data: updatedDangKyHoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteDangKyHoc = async (req, res) => {
    try {
        await DangKyHoc.delete(req.params.id);
        res.status(200).json({ success: true, message: 'DangKyHoc deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const createPaymentIntent = async (req, res) => {
    try {
        const { MaKhoaHoc, MaQuanLy } = req.body;
        
        // Check if the course exists
        const course = await KhoaHoc.getById(MaKhoaHoc);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Create a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: course.price * 100, // amount in cents
            currency: 'usd',
            metadata: { MaKhoaHoc, MaQuanLy },
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getDangKyHocs, getDangKyHocById, createDangKyHoc, updateDangKyHoc, deleteDangKyHoc, createPaymentIntent };
