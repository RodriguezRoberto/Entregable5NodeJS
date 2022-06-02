const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const { Repair } = require( '../models/repair.model' );
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { storage } = require('../utils/firebase');
const { Email } = require('../utils/email');

const getAllRepairs = catchAsync(async ( req, res ) => {
    const repairs = await Repair.findAll({
        include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    // Map async: you will use this techinque everytime that you need some async operations inside of an array
    const repairsPromises = repairs.map(async repair => {
        // Create firebase img ref and get the full path
        const imgRef = ref(storage, repair.imgPath);
        const url = await getDownloadURL(imgRef);

        // Update the repair's imgPath property
        repair.imgPath = url;
        return repair;
    });

    // Resolve every promise that map gave us ([ Promise { <pending> }, Promise { <pending> } ])
    const repairsResolved = await Promise.all(repairsPromises);

    res.status(200).json({ repairs: repairsResolved });
})

const createRepair = catchAsync(async ( req, res ) => {
    const { date, computerNumber, comments, userId } = req.body;
    const imgRef = ref(storage, `repairs/${req.file.originalname}`);
    const imgResult = await uploadBytes(imgRef, req.file.buffer);

    const newRepair = await Repair.create({ 
        date, 
        computerNumber, 
        comments, 
        userId,
        imgPath: imgResult.metadata.fullPath
    });
    res.status(201).json({ newRepair });
})

const getRepairById = catchAsync(async ( req, res ) => {
    const { repair }= req;
    const imgRef = ref(storage, repair.imgPath);
    const url = await getDownloadURL(imgRef);

    repair.imgPath = url;

    res.status(200).json({ repair, url });
});

const updateRepairById = catchAsync(async ( req, res ) => {
    const { repair } = req;
    const user = await User.findOne({
        where: { id: repair.userId }
    });
    await repair.update({ status: "completed" });
    await new Email( user.email ).sendCompletedNotice( user.name );
    res.status(200).json({ staus: "success" });
});

const deleteRepairById = catchAsync(async ( req, res ) => {
    const { repair } = req;
    const user = await User.findOne({
        where: { id: repair.userId }
    });
    await repair.update({ status: "cancelled" });
    await new Email( user.email ).sendCancelledNotice( user.name );
    res.status(200).json({ status: "success" });
});

module.exports = { 
    getAllRepairs, 
    createRepair,
    getRepairById,
    updateRepairById,
    deleteRepairById
};