import { DB_CONFID } from '../configs/db.config.js';
import { create, getAll, findOne } from './data.model.js';

const BuoiHoc = function(buoiHoc) {
    this.MaLopHoc = buoiHoc.MaLopHoc;
    this.NgayHoc = buoiHoc.NgayHoc;
};

BuoiHoc.create = async (newBuoiHoc) => {
    return await create(DB_CONFID.table.buoihoc, newBuoiHoc);
};

BuoiHoc.getAll = async (page, pageSize, sortOrder = 'ASC') => {
    try {
        const result = await getAll(DB_CONFID.table.buoihoc, page, pageSize, 'MaBuoiHoc', sortOrder);
        return result;
    } catch (error) {
        throw error;
    }
};

BuoiHoc.findOne = async (MaBuoiHoc) => {
    return await findOne(DB_CONFID.table.buoihoc, { MaBuoiHoc });
};

export default BuoiHoc;
