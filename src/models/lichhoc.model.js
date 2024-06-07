import { DB_CONFID } from '../configs/db.config.js';
import { create, deleteById, findOne, getAll, getById, updateById } from './data.model.js';

const LichHoc = function(lichhoc) {
    this.MaLichHoc = lichhoc.MaLichHoc;
    this.MaKhoaHoc = lichhoc.MaKhoaHoc;
    this.Ngay = lichhoc.Ngay;
    this.GioBatDau = lichhoc.GioBatDau;
    this.GioKetThuc = lichhoc.GioKetThuc;
};

LichHoc.getAll = async (page, pageSize, sortOrder = 'ASC') => {
    return await getAll(DB_CONFID.table.lichhoc, page, pageSize, 'MaLichHoc', sortOrder);
};

LichHoc.getById = async (id) => {
    return await getById(DB_CONFID.table.lichhoc, 'MaLichHoc', id);
};

LichHoc.create = async (newLichHoc) => {
    return await create(DB_CONFID.table.lichhoc, newLichHoc);
};

LichHoc.delete = async (id) => {
    return await deleteById(DB_CONFID.table.lichhoc, 'MaLichHoc', id);
};

LichHoc.update = async (newLichHoc, id) => {
    return await updateById(DB_CONFID.table.lichhoc, newLichHoc, 'MaLichHoc', id);
};

LichHoc.findOne = async (finds) => {
    return await findOne(DB_CONFID.table.lichhoc, finds);
};

export default LichHoc;
