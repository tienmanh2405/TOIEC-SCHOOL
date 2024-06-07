import KhoaHoc from '../models/khoahoc.model.js';

const getKhoaHocs = async (req, res) => {
    try {
        const { page = 1, pageSize, sortOrder = 'ASC' } = req.query;
        const khoahocs = await KhoaHoc.getAll(page, pageSize, sortOrder);
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
        const newKhoaHoc = await KhoaHoc.create(req.body);
        res.status(201).json({ success: true, data: newKhoaHoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateKhoaHoc = async (req, res) => {
    try {
        const updatedKhoaHoc = await KhoaHoc.update(req.body, req.params.id);
        res.status(200).json({ success: true, data: updatedKhoaHoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteKhoaHoc = async (req, res) => {
    try {
        await KhoaHoc.delete(req.params.id);
        res.status(200).json({ success: true, message: 'KhoaHoc deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getKhoaHocs, getKhoaHocById, createKhoaHoc, updateKhoaHoc, deleteKhoaHoc };
