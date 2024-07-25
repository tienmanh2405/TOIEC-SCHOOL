import { DB_CONFID } from '../configs/db.config.js';
import { create, deleteById, findOne, getAll, getById, updateById, find } from './data.model.js';

const BaiGiang = function(baigiang) {
    this.TenBaiGiang = baigiang.TenBaiGiang;
    this.MaKhoaHoc = baigiang.MaKhoaHoc;
};

BaiGiang.getAll = async (page, pageSize, sortOrder = 'ASC') => {
    try {
        const result = await getAll(DB_CONFID.table.baigiang, page, pageSize, 'MaBaiGiang', sortOrder);
        return result;
    } catch (error) {
        throw error;
    }
};

BaiGiang.getById = async (id) => {
    return await getById(DB_CONFID.table.baigiang, 'MaBaiGiang', id);
};

BaiGiang.create = async (newBaiGiang) => {
    return await create(DB_CONFID.table.baigiang, newBaiGiang);
};

BaiGiang.delete = async (id) => {
    return await deleteById(DB_CONFID.table.baigiang, 'MaBaiGiang', id);
};

BaiGiang.update = async (newBaiGiang, id) => {
    return await updateById(DB_CONFID.table.baigiang, newBaiGiang, 'MaBaiGiang', id);
};

BaiGiang.findOne = async (finds) => {
    return await findOne(DB_CONFID.table.baigiang, finds);
};

BaiGiang.findAll = async (finds) => {
    return await find(DB_CONFID.table.baigiang, finds);
};
export default BaiGiang;
