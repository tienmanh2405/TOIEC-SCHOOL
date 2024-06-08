import db from '../connectData/connectSql.js';
const getAll = (table, page, pageSize, sortField, sortOrder = 'ASC') => {    
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM ${table}`;
        const values = [];

        // Nếu có sortField, thêm mệnh đề ORDER BY
        if (sortField) {
            query += ` ORDER BY ${sortField} ${sortOrder}`;
        }

        // Nếu có page và pageSize, thêm mệnh đề LIMIT và OFFSET
        if (page && pageSize) {
            const skip = (page - 1) * pageSize;
            query += ` LIMIT ? OFFSET ?`;
            values.push(pageSize, skip);
        }

        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const getByRole = (role, table1,table2, page, pageSize, sortField, sortOrder = 'ASC') => {    
    return new Promise((resolve, reject) => {
        const values = [];
        let query = `SELECT * FROM ${table1} q INNER JOIN ${table2} p ON q.MaQuanLy = p.MaQuanLy WHERE p.MaVaiTro = ${role}`;
        // Nếu có sortField, thêm mệnh đề ORDER BY
        if (sortField) {
            query += ` ORDER BY q.${sortField} ${sortOrder}`;
        }

        // Nếu có page và pageSize, thêm mệnh đề LIMIT và OFFSET
        if (page && pageSize) {
            const skip = (page - 1) * pageSize;
            query += ` LIMIT ? OFFSET ?`;
            values.push(pageSize, skip);
        }

        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const getById = (table,dataId, id) => {    
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${table} WHERE ${dataId} = ${id}`;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            }
        });
    });
}

const create = (table, newUser) => {
    return new Promise((resolve, reject) => {
        const keys = Object.keys(newUser).join(', ');
        const placeholders = Object.keys(newUser).map(() => '?').join(', ');
        const values = Object.values(newUser);
        const query = `INSERT INTO ${table}(${keys}) VALUES(${placeholders})`;
        
        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ id: result.insertId, ...newUser });
            }
        });
    });
};

const updateById = (table,update, tableId, id) => {
    return new Promise((resolve, reject) => {
        const setUpdates = Object.keys(update).map( key => `${key} = ?`).join(', ');
        const values = Object.values(update);
        values.push(id);
        const query = `UPDATE ${table} SET ${setUpdates} WHERE ${tableId} = ?`;
        db.query(query, values, (err, result) => {
            if (err) {
                reject({msg: err, success: false});
            }else if(result.affectedRows === 0) {
                reject({msg: 'Update Not Found',success: false});
            }else {
                const selectQuery = `SELECT * FROM ${table} where ${tableId} = ?`;
                db.query(selectQuery, id, (err, result) => {
                    if (err) {
                        reject({msg: err, success: false});
                    } else {
                        resolve({msg: 'Update sucessfully', result: result[0]});
                    }
                });
            }
        });
    });
}

const deleteById = (table,tableId,id) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM ${table} WHERE ${tableId} =?`;
        db.query(query, id, (err, result) => {
            if (err) {
                reject(err);
            }else if(result.affectedRows === 0) {
                reject({msg: 'Update Not Found',success: false});
            }else {
                resolve({msg: 'Delete sucessfully!',success: true});
            }
        });
    });
}

const findOne = (table, finds) => {
    return new Promise((resolve, reject) => {
        const objectFind = Object.keys(finds).map(key => `${key} = ? `).join(' AND ');
        const values = Object.values(finds);
        const query = `SELECT * FROM ${table} WHERE ${objectFind}`;
        db.query(query,values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            }
        });
    });
}
 
const getInfoWithJoin = (table1,table2,nameInfo, nameJoin, idName, id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT ${table2}.${nameInfo} FROM ${table1} INNER JOIN ${table2} ON ${table1}.${nameJoin} = ${table2}.${nameJoin} where ${idName} = ${id}`;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            }
        });
    });
}

const updateRole = (table,nameRole, role,nameid, id) => {
    return new Promise((resolve, reject) => {
        const values = [];
        values.push(role,id);
        const query = `UPDATE \`${table}\` set \`${nameRole}\` =  ? WHERE \`${nameid}\` = ?`; 
        db.query(query,values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

export {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    findOne,
    getInfoWithJoin,
    getByRole,
    updateRole
}
