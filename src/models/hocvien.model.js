import { DB_CONFID } from '../configs/db.config.js';
import { create, getAll, findOne, find, updateById ,deleteById, deleteMany, updateMany } from './data.model.js';

const HocVien = function(hocVien) {
    this.MaHocVien  = hocVien.MaHocVien;
    this.MaNguoiDung  = hocVien.MaNguoiDung;
    this.HoTen = hocVien.HoTen;
    this.Email = hocVien.Email;
    this.DiemDanh = hocVien.DiemDanh;
    this.DiemSo = hocVien.DiemSo;
    this.NhanXet = hocVien.NhanXet;
    this.MaLopHoc = hocVien.MaLopHoc;
};

HocVien.create = async (newHocVien) => {
    return await create(DB_CONFID.table.hocvien, newHocVien);
};

HocVien.getAll = async (page, pageSize, sortOrder = 'ASC') => {
    try {
        const result = await getAll(DB_CONFID.table.hocvien, page, pageSize, 'MaHocVien', sortOrder);
        return result;
    } catch (error) {
        throw error;
    }
};

HocVien.findOne = async (MaHocVien) => {
    return await findOne(DB_CONFID.table.hocvien, { MaHocVien });
};

HocVien.update = async (MaHocVien, newData) => {
    return await updateById(DB_CONFID.table.hocvien, { MaHocVien }, newData);
};

HocVien.findAll = async (finds) => {
    return await find(DB_CONFID.table.hocvien, finds);
};
HocVien.delete = async (id) => {
    return await deleteById(DB_CONFID.table.hocvien, 'MaHocVien', id);
};

HocVien.deleteMany = async (conditions) => {
    return await deleteMany(DB_CONFID.table.hocvien, conditions);
};

HocVien.updateAll = async (updates, conditions) => {
    return await updateMany(DB_CONFID.table.hocvien, updates, conditions);
};

export default HocVien;
