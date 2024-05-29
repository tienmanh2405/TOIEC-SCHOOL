import db from '../connectData/connectSql.js';

function Product(product) {
    this.MaSp = product.MaSp;
    this.TenSP = product.TenSP;
    this.GiaGoc = product.GiaGoc;
    this.GiaBan = product.GiaBan;
    this.HinhAnh = product.HinhAnh;
    this.MaTH = product.MaTH;
}

Product.getAll = (callback) => {    
    db.query('SELECT * FROM nguoidung', (err, result) => {
        if (err){
            console.log(err);
        }
        else{
            callback(result);
        }
    });
}

export default Product;
