const Stripe = require('stripe');
const dotenv = require('dotenv');
const Booking = require('../models/Booking');

dotenv.config({path:'./config/config.env'});

const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

exports.createStripeCustomer = async (email, name)=>{
    try {
        const customer = await stripe.customers.create({
          email: email,
          name: name,
        });
        return customer;
    } catch (err) {
        console.error(err.message);
        return null;
    }
};

exports.getPrices = async (req,res,next)=>{
    try{
        const prices = await stripe.prices.list();

        res.status(200).json({
            success:true,
            data:prices
        });
    }
    catch(err){
        res.status(400).json({
            success:false,
            error: err.message
        });
    }
};

exports.createPrice = async (req,res,next)=>{
    try{
        const {name,description,amount} = req.body;

        const product = await stripe.products.create({
            name:name,
            description:description,
        });

        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: amount,
            currency: "thb",
        });

        res.status(200).json({
            success: true,
            message: "Product and price created successfully",
            product: product,
            price: price
        });
    }
    catch(err){
        res.status(400).json({
            success:false,
            error: err.message
        });
    }
};

exports.createPaymentSession = async (req, res) => {
    try {
        const stripeCustomerId = req.user.customerId;
        const {bookingId} = req.body;

        if(!bookingId)
            return res.status(400).json({
                success:false,
                message:'Invalid booking ID'
            });
        
        const booking = await Booking.findById(bookingId);

        if(!booking)
            return res.status(400).json({
                success:false,
                message:'Not found booking'
            });

        if(booking.status === 'finish')
            return res.status(400).json({
                success:false,
                message:'This booking is paid'
            });

        if(req.user.id !== booking.user.toString() && req.user.role !== 'admin'){
            console.log(req.user.id);
            console.log(booking.user.id.toString());
            return res.status(400).json({
                success:false,
                message:'Not same user'
            });
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["promptpay","card"], 
            line_items: [{
                price: booking.priceId,
                quantity: 1,
            }],
            success_url: "http://localhost:5000/api/v1/payment/success",
            cancel_url: "http://localhost:5000/api/v1/payment/cancel",
            customer: stripeCustomerId,
        });

        booking.status = 'finish';
        await booking.save();
  
        res.status(200).json({
            success: true,
            sessionUrl: session.url,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.paymentSuccess = async (req, res) => {
    try {
        res.status(200).send("Payment successful!");
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.paymentCancel = async (req, res) => {
    try {
        res.status(200).send("Payment canceled.");
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
