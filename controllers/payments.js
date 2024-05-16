const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
    try {
        const { products, order_id } = req.body;

        if (!products || !order_id) {
            return res.status(400).json({ message: 'Products and order_id are required' });
        }

        const line_items = products.map((product) => {
            return {
                price_data: {
                    currency: 'mxn',
                    product_data: {
                        name: product.title
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
            success_url: `${process.env.CLIENT_URL}/success?order_id=${order_id}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel?order_id=${order_id}`
        });

        res.json({ id: session.id });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createCheckoutSession
};
