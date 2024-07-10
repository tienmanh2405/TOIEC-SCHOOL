import { DB_CONFID } from '../configs/db.config.js';
import { create, getAll, find, updateMany } from './data.model.js';

const DiemDanh = function(diemDanh) {
    this.MaHocVien = diemDanh.MaHocVien;
    this.MaBuoiHoc = diemDanh.MaBuoiHoc;
    this.TrangThai = diemDanh.TrangThai;
};

DiemDanh.create = async (newDiemDanh) => {
    return await create(DB_CONFID.table.diemdanh, newDiemDanh);
};

DiemDanh.getAll = async (page, pageSize, sortOrder = 'ASC') => {
    try {
        const result = await getAll(DB_CONFID.table.diemdanh, page, pageSize, 'MaDiemDanh', sortOrder);
        return result;
    } catch (error) {
        throw error;
    }
};

DiemDanh.findAll = async (finds) => {
    return await find(DB_CONFID.table.diemdanh, finds);
};
DiemDanh.updateAll = async (updates, conditions) => {
    return await updateMany(DB_CONFID.table.diemdanh, updates, conditions);
};

export default DiemDanh;
