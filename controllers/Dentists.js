//@desc Get all dentists
//@route Get /api/v1/dentists
//@access Public
exports.getDentists=(req,res,next)=>{
    res.status(200).json({success:true,msg:'Show all Dentists'});
}

//@desc Get one dentist
//@route Get /api/v1/dentists/:id
//@access Public
exports.getDentist=(req,res,next)=>{
    res.status(200).json({success:true,msg:`Show dentist ${req.params.id}`});
}

//@desc Create new dentists
//@route POST /api/v1/dentists
//@access Private
exports.createDentist=(req,res,next)=>{
    res.status(200).json({success:true,msg:'Create new Dentist'});
}

//@desc Update one dentist
//@route PUT /api/v1/dentists/:id
//@access Priavte
exports.updateDentist=(req,res,next)=>{
    res.status(200).json({success:true,msg:`Update dentist ${req.params.id}`});
}

//@desc Delete one dentist
//@route Get /api/v1/dentists/:id
//@access Private
exports.deleteDentist=(req,res,next)=>{
    res.status(200).json({success:true,msg:`Delete dentist ${req.params.id}`});
}