import { DB_CONFID } from '../configs/db.config.js';
import { create, deleteById, findOne, getAll, getById, updateById, find } from './data.model.js';

const LopHoc = function(lophoc) {
    this.MaLopHoc = lophoc.MaLopHoc;
    this.MaKhoaHoc = lophoc.MaKhoaHoc;
    this.Ngay = lophoc.Ngay;
    this.GioBatDau = lophoc.GioBatDau;
    this.GioKetThuc = lophoc.GioKetThuc;
};

LopHoc.getAll = async (page, pageSize, sortOrder = 'ASC') => {
    return await getAll(DB_CONFID.table.lophoc, page, pageSize, 'MaLopHoc', sortOrder);
};

LopHoc.getById = async (id) => {
    return await getById(DB_CONFID.table.lophoc, 'MaLopHoc', id);
};

LopHoc.create = async (newLopHoc) => {
    return await create(DB_CONFID.table.lophoc, newLopHoc);
};

LopHoc.delete = async (id) => {
    return await deleteById(DB_CONFID.table.lophoc, 'MaLopHoc', id);
};

LopHoc.update = async (newLopHoc, id) => {
    return await updateById(DB_CONFID.table.lophoc, newLopHoc, 'MaLopHoc', id);
};

LopHoc.findOne = async (finds) => {
    return await findOne(DB_CONFID.table.lophoc, finds);
};
LopHoc.findAll = async (finds) => {
    return await find(DB_CONFID.table.lophoc, finds);
};
export default LopHoc;
