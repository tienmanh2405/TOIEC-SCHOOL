import { DB_CONFID } from '../configs/db.config.js';
import { create, getAll, findOne, deleteById, find, deleteMany } from './data.model.js';

const KetQuaBaiKiemTra = function(ketqua) {
    this.MaBaiKiemTra = ketqua.MaBaiKiemTra;
    this.MaHocVien = ketqua.MaHocVien;
    this.Diem = ketqua.Diem;
    this.NgayThi = ketqua.NgayThi;
};

KetQuaBaiKiemTra.create = async (newKetQua) => {
    return await create(DB_CONFID.table.ketquabaikiemtra, newKetQua);
};

KetQuaBaiKiemTra.getAll = async (page, pageSize, sortOrder = 'ASC') => {
    try {
        const result = await getAll(DB_CONFID.table.ketquabaikiemtra, page, pageSize, 'MaKetQua', sortOrder);
        return result;
    } catch (error) {
        throw error;
    }
};
KetQuaBaiKiemTra.findOne = async (finds) => {
    return await findOne(DB_CONFID.table.ketquabaikiemtra, finds);
};
KetQuaBaiKiemTra.delete = async (id) => {
    return await deleteById(DB_CONFID.table.ketquabaikiemtra, 'MaKetQua', id);
};

KetQuaBaiKiemTra.findAll = async (finds) => {
    return await find(DB_CONFID.table.ketquabaikiemtra, finds);
};

KetQuaBaiKiemTra.deleteMany = async (conditions) => {
    return await deleteMany(DB_CONFID.table.ketquabaikiemtra, conditions);
};
export default KetQuaBaiKiemTra;
