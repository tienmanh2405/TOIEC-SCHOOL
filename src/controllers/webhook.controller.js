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

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;

        // Get the DangKyHocId from the paymentIntent metadata
        const DangKyHocId = paymentIntent.metadata.DangKyHocId;

        // Update the DangKyHoc record to set the payment status to 'da thanh toan'
        await DangKyHoc.update({ TrangThaiThanhToan: 'da thanh toan' }, DangKyHocId);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
};

export { handleStripeWebhook };
