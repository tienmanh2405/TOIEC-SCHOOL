import { DB_CONFID } from '../configs/db.config.js';
import { create, deleteById, findOne,find, getAll, getById, updateById } from './data.model.js';

const CauHoi = function(cauhoi) {
    this.MaCauHoi = cauhoi.MaCauHoi;
    this.MaBaiKiemTra = cauhoi.MaBaiKiemTra;
    this.NoiDung = cauhoi.NoiDung;
    this.LuaChon1 = cauhoi.LuaChon1;
    this.LuaChon2 = cauhoi.LuaChon2;
    this.LuaChon3 = cauhoi.LuaChon3;
    this.LuaChon4 = cauhoi.LuaChon4;
    this.DapAn = cauhoi.DapAn;
};

CauHoi.getAll = async (page, pageSize, sortOrder = 'ASC') => {
    try {
        const result = await getAll(DB_CONFID.table.cauhoi, page, pageSize, 'MaCauHoi', sortOrder);
        return result;
    } catch (error) {
        throw error;
    }
};

CauHoi.getById = async (id) => {
    return await getById(DB_CONFID.table.cauhoi, 'MaCauHoi', id);
};

CauHoi.create = async (newCauHoi) => {
    return await create(DB_CONFID.table.cauhoi, newCauHoi);
};

CauHoi.delete = async (id) => {
    return await deleteById(DB_CONFID.table.cauhoi, 'MaCauHoi', id);
};

CauHoi.update = async (newCauHoi, id) => {
    return await updateById(DB_CONFID.table.cauhoi, newCauHoi, 'MaCauHoi', id);
};

CauHoi.findOne = async (finds) => {
    return await findOne(DB_CONFID.table.cauhoi, finds);
};

CauHoi.findAll = async (finds) => {
    return await find(DB_CONFID.table.cauhoi, finds);
};
export default CauHoi;
