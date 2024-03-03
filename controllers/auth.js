const User = require('../models/User');
const stripe = require('../controllers/stripe');

const sendTokenResponse = (user,statusCode,res,msg) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires:new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly:true
    } 
    
    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        message:msg,
        token
    });

};

exports.register = async (req,res,next)=>{
    try{
        const {name,telephone,email,password,role} = req.body;

        const customer = await stripe.createStripeCustomer(email,name);

        const user = await User.create({
            name:name,
            telephone:telephone,
            email:email,
            password:password,
            role:role,
            customerId:customer.id
        });

        sendTokenResponse(user,200,res,'Register complete');
    }
    catch(err){
        res.status(400).json({
            success:false,
            message:err.message
        });
        console.log(err.stack)
    }
};

exports.login = async (req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password)
        return res.status(400).json({
            success:false,
            message:'Email or password are invalid'
        });

    const user = await User.findOne({email}).select('+password');

    if(!user)
        return res.status(400).json({
            success:false,
            message:'Invalid credential'
        });

    const isMatch = await user.matchPassword(password);

    if(!isMatch)
        return res.status(401).json({
            success:false,
            message:'Invalid credential'
        });

    sendTokenResponse(user,200,res,'Login complete');
};

exports.getMe = async (req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        data:user
    });
};