const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
    try {
        const { products } = req.body;

        const line_items = products.map((product) => {
            return {
                price_data: {
                    currency: 'mxn',
                    product_data: {
                        name: product.title,
                        images: [product.images[0]],
                    },
                    unit_amount: product.price * 100,
                },
                quantity: product.quantity,
            }
        }
        );

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        });

        res.json({ id: session.id });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createCheckoutSession
};
