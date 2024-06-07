import LichHoc from '../models/lichhoc.model.js';

const getLichHocs = async (req, res) => {
    try {
        const { page = 1, pageSize, sortOrder = 'ASC' } = req.query;
        const lichhocs = await LichHoc.getAll(page, pageSize, sortOrder);
        res.status(200).json({ success: true, data: lichhocs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getLichHocById = async (req, res) => {
    try {
        const lichhoc = await LichHoc.getById(req.params.id);
        res.status(200).json({ success: true, data: lichhoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createLichHoc = async (req, res) => {
    try {
        const newLichHoc = await LichHoc.create(req.body);
        res.status(201).json({ success: true, data: newLichHoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateLichHoc = async (req, res) => {
    try {
        const updatedLichHoc = await LichHoc.update(req.body, req.params.id);
        res.status(200).json({ success: true, data: updatedLichHoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteLichHoc = async (req, res) => {
    try {
        await LichHoc.delete(req.params.id);
        res.status(200).json({ success: true, message: 'LichHoc deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getLichHocs, getLichHocById, createLichHoc, updateLichHoc, deleteLichHoc };
