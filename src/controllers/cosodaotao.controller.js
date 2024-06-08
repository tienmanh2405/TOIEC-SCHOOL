import CoSoDaoTao from '../models/cosodaotao.model.js';

const getCoSoDaoTaos = async (req, res) => {
    try {
        const { page = 1, pageSize, sortOrder = 'ASC' } = req.query;
        const cosodaotaos = await CoSoDaoTao.getAll(page, pageSize, sortOrder);
        res.status(200).json({ success: true, data: cosodaotaos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCoSoDaoTaoById = async (req, res) => {
    try {
        const cosodaotao = await CoSoDaoTao.getById(req.params.id);
        res.status(200).json({ success: true, data: cosodaotao });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createCoSoDaoTao = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        const newCoSoDaoTao = await CoSoDaoTao.create(req.body);
        res.status(201).json({ success: true, data: newCoSoDaoTao });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateCoSoDaoTao = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }

        const updatedCoSoDaoTao = await CoSoDaoTao.update(req.body, req.params.id);
        res.status(200).json({ success: true, data: updatedCoSoDaoTao });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteCoSoDaoTao = async (req, res) => {
    try {
        const roleAdmin = req.decoded.role;
        if (!roleAdmin || roleAdmin!== DB_CONFID.resourses.admin.role) {
            return res.status(401).json({ msg: 'Unauthorized!', success: false });
        }
        
        await CoSoDaoTao.delete(req.params.id);
        res.status(200).json({ success: true, message: 'CoSoDaoTao deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getCoSoDaoTaos, getCoSoDaoTaoById, createCoSoDaoTao, updateCoSoDaoTao, deleteCoSoDaoTao };
