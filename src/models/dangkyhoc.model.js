import { DB_CONFID } from '../configs/db.config.js';
import { create, deleteById, findOne, getAll, getById, updateById } from './data.model.js';

const DangKyHoc = function(dangkyhoc) {
    this.MaDangKy = dangkyhoc.MaDangKy;
    this.MaKhoaHoc = dangkyhoc.MaKhoaHoc;
    this.MaQuanLy = dangkyhoc.MaQuanLy;
};

DangKyHoc.getAll = async (page, pageSize, sortOrder = 'ASC') => {
    return await getAll(DB_CONFID.table.dangkyhoc, page, pageSize, 'MaDangKy', sortOrder);
};

DangKyHoc.getById = async (id) => {
    return await getById(DB_CONFID.table.dangkyhoc, 'MaDangKy', id);
};

DangKyHoc.create = async (newDangKyHoc) => {
    return await create(DB_CONFID.table.dangkyhoc, newDangKyHoc);
};

DangKyHoc.delete = async (id) => {
    return await deleteById(DB_CONFID.table.dangkyhoc, 'MaDangKy', id);
};

DangKyHoc.update = async (newDangKyHoc, id) => {
    return await updateById(DB_CONFID.table.dangkyhoc, newDangKyHoc, 'MaDangKy', id);
};

DangKyHoc.findOne = async (finds) => {
    return await findOne(DB_CONFID.table.dangkyhoc, finds);
};

export default DangKyHoc;
