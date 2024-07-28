import DangKyHoc from '../models/dangkyhoc.model.js';

const handleStripeWebhook = async (req, res) => {
    try {
        const { registrationId } = req.body;
        const MaDangKy = registrationId;  
        const updateDangKy = await DangKyHoc.update(
            { TrangThaiThanhToan: true, clientSecret: null }, MaDangKy);
        
        res.status(200).json({ received: true, success: true, update: updateDangKy });
    } catch (error) {
        console.error('Error updating registration:', error);
        res.status(500).json({ received: true, success: false, error: 'Internal Server Error' });
    }
};

export { handleStripeWebhook };
