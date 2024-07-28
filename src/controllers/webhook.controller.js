import DangKyHoc from '../models/dangkyhoc.model.js';
import db from '../connectData/connectSql.js';
const handleStripeWebhook = async (req, res) => {
    try {
        const { registrationId } = req.body;
        const MaDangKy = registrationId;  
        const updateDangKy = await DangKyHoc.update(
            { TrangThaiThanhToan: true, clientSecret: null }, MaDangKy);
        const sql = 'CALL taoLopHocVaThemHocVien()';
        db.query(sql, (err, results) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).json(results[0]);
          }
        });
        res.status(200).json({ received: true, success: true, update: updateDangKy });
    } catch (error) {
        console.error('Error updating registration:', error);
        res.status(500).json({ received: true, success: false, error: 'Internal Server Error' });
    }
};

export { handleStripeWebhook };
