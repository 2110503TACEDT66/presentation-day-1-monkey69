const User = require('../models/User');

exports.register = async (req,res,next)=>{
    try{
        const {name,telephone,email,password,role} = req.body;

        const user = await User.create({
            name:name,
            telephone:telephone,
            email:email,
            password:password,
            role:role
        });

        const token = user.getSignedJwtToken();

        res.status(200).json({
            success:true,
            message:'Register finish!',
            token
        });
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

    const token = user.getSignedJwtToken();
    res.status(200).json({
        success:true,
        message:'Login finish',
        token
    });
};