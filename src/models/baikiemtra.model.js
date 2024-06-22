import { DB_CONFID } from '../configs/db.config.js';
import { create, deleteById, findOne, getAll, getById, updateById } from './data.model.js';

const BaiKiemTra = function(baikiemtra) {
    this.TenBaiKiemTra = baikiemtra.TenBaiKiemTra;
    this.MaKhoaHoc = baikiemtra.MaKhoaHoc;
    this.ThoiGianBatDau = baikiemtra.ThoiGianBatDau;
    this.ThoiGianKetThuc = baikiemtra.ThoiGianKetThuc;
};

BaiKiemTra.getAll = async (page, pageSize, sortOrder = 'ASC') => {
    try {
        const result = await getAll(DB_CONFID.table.baikiemtra, page, pageSize, 'MaBaiKiemTra', sortOrder);
        return result;
    } catch (error) {
        throw error;
    }
};

BaiKiemTra.getById = async (id) => {
    return await getById(DB_CONFID.table.baikiemtra, 'MaBaiKiemTra', id);
};

BaiKiemTra.create = async (newBaiKiemTra) => {
    return await create(DB_CONFID.table.baikiemtra, newBaiKiemTra);
};

BaiKiemTra.delete = async (id) => {
    return await deleteById(DB_CONFID.table.baikiemtra, 'MaBaiKiemTra', id);
};

BaiKiemTra.update = async (newBaiKiemTra, id) => {
    return await updateById(DB_CONFID.table.baikiemtra, newBaiKiemTra, 'MaBaiKiemTra', id);
};

BaiKiemTra.findOne = async (finds) => {
    return await findOne(DB_CONFID.table.baikiemtra, finds);
};

export default BaiKiemTra;
