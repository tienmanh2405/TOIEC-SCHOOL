import stripe from '../configs/stripe.config.js';
import DangKyHoc from '../models/dangkyhoc.model.js';

const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            // Update registration status in your database
            const { MaKhoaHoc, MaQuanLy } = paymentIntent.metadata;
            await DangKyHoc.create({ MaKhoaHoc, MaQuanLy });
            break;
        case 'payment_intent.payment_failed':
            // Handle failed payment
            break;
        default:
            // Unexpected event type
            return res.status(400).end();
    }

    res.status(200).json({ received: true });
};

export { handleStripeWebhook };
