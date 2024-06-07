import { DB_CONFID } from '../configs/db.config.js';
import { create, deleteById, findOne, getAll, getById, updateById } from './data.model.js';

const KhoaHoc = function(khoahoc) {
    this.MaKhoaHoc = khoahoc.MaKhoaHoc;
    this.TenKhoaHoc = khoahoc.TenKhoaHoc;
    this.MoTa = khoahoc.MoTa;
};

KhoaHoc.getAll = async (page, pageSize, sortOrder = 'ASC') => {
    return await getAll(DB_CONFID.table.khoahoc, page, pageSize, 'MaKhoaHoc', sortOrder);
};

KhoaHoc.getById = async (id) => {
    return await getById(DB_CONFID.table.khoahoc, 'MaKhoaHoc', id);
};

KhoaHoc.create = async (newKhoaHoc) => {
    return await create(DB_CONFID.table.khoahoc, newKhoaHoc);
};

KhoaHoc.delete = async (id) => {
    return await deleteById(DB_CONFID.table.khoahoc, 'MaKhoaHoc', id);
};

KhoaHoc.update = async (newKhoaHoc, id) => {
    return await updateById(DB_CONFID.table.khoahoc, newKhoaHoc, 'MaKhoaHoc', id);
};

KhoaHoc.findOne = async (finds) => {
    return await findOne(DB_CONFID.table.khoahoc, finds);
};

export default KhoaHoc;
