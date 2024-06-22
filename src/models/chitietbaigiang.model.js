import { DB_CONFID } from '../configs/db.config.js';
import { create, deleteById, findOne, getAll, getById, updateById } from './data.model.js';

const ChiTietBaiGiang = function(chitietbaigiang) {
    this.MaBaiGiang = chitietbaigiang.MaBaiGiang;
    this.TenNoiDung = chitietbaigiang.TenNoiDung;
    this.NoiDung = chitietbaigiang.NoiDung;
    this.TaiLieu = chitietbaigiang.TaiLieu;
};

ChiTietBaiGiang.getAll = async (page, pageSize, sortOrder = 'ASC') => {
    try {
        const result = await getAll(DB_CONFID.table.chitietbaigiang, page, pageSize, 'MaChiTiet', sortOrder);
        return result;
    } catch (error) {
        throw error;
    }
};

ChiTietBaiGiang.getById = async (id) => {
    return await getById(DB_CONFID.table.chitietbaigiang, 'MaChiTiet', id);
};

ChiTietBaiGiang.create = async (newChiTietBaiGiang) => {
    return await create(DB_CONFID.table.chitietbaigiang, newChiTietBaiGiang);
};

ChiTietBaiGiang.delete = async (id) => {
    return await deleteById(DB_CONFID.table.chitietbaigiang, 'MaChiTiet', id);
};

ChiTietBaiGiang.update = async (newChiTietBaiGiang, id) => {
    return await updateById(DB_CONFID.table.chitietbaigiang, newChiTietBaiGiang, 'MaChiTiet', id);
};

ChiTietBaiGiang.findOne = async (finds) => {
    return await findOne(DB_CONFID.table.chitietbaigiang, finds);
};

export default ChiTietBaiGiang;
