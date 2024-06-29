import { DB_CONFID } from '../configs/db.config.js';
import { create, getAll } from './data.model.js';

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

export default KetQuaBaiKiemTra;
