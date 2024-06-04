import { DB_CONFID } from '../configs/db.config.js';
import { create, deleteById, findOne, getAll, getById, updateById, getInfoWithJoin, getByRole, updateRole } from './data.model.js';

const QuanLy = function(quanly) {
    this.MaQuanLy = quanly.MaQuanLy;
    this.HoTen = quanly.HoTen;
    this.Email = quanly.Email;
    this.SoDienThoai = quanly.SoDienThoai;
    this.TenTaiKhoan = quanly.TenTaiKhoan;
    this.MatKhau = quanly.MatKhau;
}

QuanLy.getAll = async (page, pageSize, sortOrder = 'ASC') => {
    const result = await getAll(DB_CONFID.table.quanly, page, pageSize, 'MaQuanLy', sortOrder);
    return result;
};

QuanLy.getByRole = async (role, page, pageSize, sortOrder = 'ASC') => {
    const result = await getByRole(role,DB_CONFID.table.quanly, DB_CONFID.table.phanquyen , page, pageSize, 'MaQuanLy', sortOrder);
    return result;
};
QuanLy.getAllByRole = async (role) =>{
    const result = await getByRole(role,DB_CONFID.table.quanly, DB_CONFID.table.phanquyen);
    return result;
};


QuanLy.getById = async (id) => {
    return await getById(DB_CONFID.table.quanly, 'MaQuanLy', id);
}

QuanLy.create = async (newUser) => {
    return await create(DB_CONFID.table.quanly, newUser);
}

QuanLy.delete = async (id) => {
    return await deleteById(DB_CONFID.table.quanly, 'MaQuanLy', id);
}

QuanLy.update = async (newUser, id) => {
    return await updateById(DB_CONFID.table.quanly, newUser, 'MaQuanLy', id);
}

QuanLy.findOne = async (finds) => {
    return await findOne(DB_CONFID.table.quanly, finds);
}

QuanLy.getRoleById = async (id) => {
    return await getInfoWithJoin(DB_CONFID.table.phanquyen, DB_CONFID.table.vaitro, 'TenVaiTro','MaVaiTro', 'MaQuanLy',id);
}

QuanLy.updateRole = async (role,id)=>{
    return await updateRole(DB_CONFID.table.phanquyen,'MaVaiTro',role, 'MaQuanLy',id);
}

export default QuanLy;
