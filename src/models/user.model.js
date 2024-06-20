import { DB_CONFID } from '../configs/db.config.js';
import {create, deleteById, findOne, getAll, getById, updateById} from './data.model.js'

const Users = function(user) {
    this.MaNguoiDung = user.MaNguoiDung;
    this.HoTen = user.HoTen;
    this.Email = user.Email;
    this.SoDienThoai = user.SoDienThoai;
    this.TenTaiKhoan = user.TenTaiKhoan;
    this.MatKhau = user.MatKhau;
    this.NgaySinh = user.NgaySinh
}

Users.getAll = async (page, pageSize, sortOrder = 'ASC') => {
    try {
        const result = await getAll(DB_CONFID.table.nguoidung, page, pageSize, 'MaNguoiDung', sortOrder);
        return result;
    } catch (error) {
        throw error;
    }
};

Users.getById =async (id) => {    
    return await getById(DB_CONFID.table.nguoidung,'MaNguoiDung',id);
}

Users.create =async (newUser) => {
    return await create(DB_CONFID.table.nguoidung,newUser);
}
Users.delete =async (id) => {
    return await deleteById(DB_CONFID.table.nguoidung,'MaNguoiDung',id);
}
Users.update =async (newUser, id) => {
    return await updateById(DB_CONFID.table.nguoidung,newUser,'MaNguoiDung',id);
}
Users.findOne = async (finds) => {
    return await findOne(DB_CONFID.table.nguoidung,finds);
}

export default Users;
