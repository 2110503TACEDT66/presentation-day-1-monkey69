const Dentist = require('../models/Dentist');

//@desc Get all dentists
//@route GET /api/v1/dentists
//@access Public
exports.getDentists= async (req,res,next)=> {
    let query;
    const reqQuery={...req.query};

    const removeFields=['select','sort','page','limit'];

    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);

    let queryStr=JSON.stringify(reqQuery);
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`);

    query = Dentist.find(JSON.parse(queryStr)).populate('bookings');

    //select
    if(req.query.select) {
        const fields=req.query.select.split(',').join(' ');
        query=query.select(fields);
    }

    //sort
    if(req.query.sort) {
        const sortBy=req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    //Pagination
    const page=parseInt(req.query.page,10)||1;
    const limit=parseInt(req.query.limit,10)||25;
    const startIndex=(page-1)*limit;
    const endIndex=page*limit;

    try {
        const total=await Dentist.countDocuments();
        query=query.skip(startIndex).limit(limit);

        const dentists = await query;

        //pagination result
        const pagination={};

        if(endIndex<total) {
            pagination.next={
                page:page+1,
                limit
            }
        }

        if(startIndex>0) {
            pagination.prev={
                page:page-1,
                limit
            }
        }
        
        res.status(200).json({success:true,count:dentists.length,data:dentists});
    } catch(err) {
        res.status(400).json({success:false,msg:err.msg});
    };
}

//@desc Get one dentists
//@route GET /api/v1/dentist/:id
//@access Public
exports.getDentist=async (req,res,next)=>{
    try {
        const dentist = await Dentist.findById(req.params.id);
        
        if(!dentist) {
            return res.status(400).json({success:false,msg:`Dentist ID ${req.params.id} not found`});
        }

        res.status(200).json({success:true,data:dentist});
    } catch (err) {
        res.status(400).json({success:false,msg:err.msg});
    }
}

//@desc Create new dentists
//@route POST /api/v1/dentists
//@access Private
exports.createDentist=  async (req,res,next)=>{
    const dentist = await Dentist.create(req.body);
    res.status(201).json({success:true, data:dentist});
}

//@desc Update one dentists
//@route PUT /api/v1/dentist/:id
//@access Private
exports.updateDentist=async(req,res,next)=>{
    try {
        const dentist = await Dentist.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators:true
        });

        if(!dentist) {
            return res.status(400).json({success:false});
        }

        res.status(200).json({succes:true,data:dentist});
    } catch (err) {
        res.status(400).json({succes:false,message:err.message});
    }
}

//@desc Delete one dentists
//@route DELETE /api/v1/dentist/:id
//@access Private
exports.deleteDentist=async(req,res,next)=>{
    try {
        const dentist = await Dentist.findById(req.params.id);

        if(!dentist) {
            res.status(400).json({success:false,message:'Not found'});
        }

        await dentist.deleteOne();
    
        res.status(200).json({success:true,data:{}});
    } catch (err) {
        res.status({success:false,message:err.message})
    }
}

module.exports