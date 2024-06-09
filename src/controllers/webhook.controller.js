import stripe from '../configs/stripe.config.js';
import DangKyHoc from '../models/dangkyhoc.model.js';

const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;

        const MaDangKy = paymentIntent.metadata.MaDangKy;

        await DangKyHoc.update({ TrangThaiThanhToan: true }, MaDangKy);
    }

    res.json({ received: true });
};

export { handleStripeWebhook };
