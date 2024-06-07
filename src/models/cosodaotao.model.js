import { DB_CONFID } from '../configs/db.config.js';
import { create, deleteById, findOne, getAll, getById, updateById } from './data.model.js';

const CoSoDaoTao = function(cosodaotao) {
    this.MaCoSo = cosodaotao.MaCoSo;
    this.TenCoSo = cosodaotao.TenCoSo;
    this.DiaChi = cosodaotao.DiaChi;
};

CoSoDaoTao.getAll = async (page, pageSize, sortOrder = 'ASC') => {
    return await getAll(DB_CONFID.table.cosodaotao, page, pageSize, 'MaCoSo', sortOrder);
};

CoSoDaoTao.getById = async (id) => {
    return await getById(DB_CONFID.table.cosodaotao, 'MaCoSo', id);
};

CoSoDaoTao.create = async (newCoSoDaoTao) => {
    return await create(DB_CONFID.table.cosodaotao, newCoSoDaoTao);
};

CoSoDaoTao.delete = async (id) => {
    return await deleteById(DB_CONFID.table.cosodaotao, 'MaCoSo', id);
};

CoSoDaoTao.update = async (newCoSoDaoTao, id) => {
    return await updateById(DB_CONFID.table.cosodaotao, newCoSoDaoTao, 'MaCoSo', id);
};

CoSoDaoTao.findOne = async (finds) => {
    return await findOne(DB_CONFID.table.cosodaotao, finds);
};

export default CoSoDaoTao;
