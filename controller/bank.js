const mongoose = require('mongoose');
const ErrorHandler = require('../utils/ErrorHandler')
const asyncHandler = require('../middlware/async');
const Bank = require('../model/Bank');
const slugify = require('slugify');
const path = require('path');

// USE : Create a new bank under a category
// Route : POST /api/v1/categories/:categoryId/banks
exports.createBank = asyncHandler(
    async (req, res, next) => {
        req.body.category = req.params.categoryId;
        const bank = await Bank.create(req.body);
        res.status(201).json({ success: true, data: bank });
    }
);

// USE : Get all banks
// Routes 1: GET /api/v1/banks and 
// Route 2: GET /api/v1/categories/:categoryId/banks

exports.getBanks = asyncHandler(
    async (req, res, next) => {
        if (!req.params.categoryId) {
            res.status(200).json(res.advancedResults);
        } else {
            const banks = await Bank.find({ category: req.params.categoryId });
            res.status(200).json({ success: true, count: banks.length, data: banks });
        }
    }
);

// USE : Get a bank
// Route : GET /api/v1/banks/:id
exports.getBank = asyncHandler(
    async (req, res, next) => {
        const bank = await Bank.findById(req.params.id);
        if (!bank) {
            return next(new ErrorHandler(`Bank with id ${req.params.id} not found`, 404))
        }
        res.status(200).json({ success: true, data: bank });
    }
);

// USE : Update a bank
// Route : PUT /api/v1/banks/:id
exports.updateBank = asyncHandler(
    async (req, res, next) => {
        const bank = await Bank.findById(req.params.id);
        if (!bank) {
            return next(new ErrorHandler(`Bank with id ${req.params.id} not found`, 404))
        }
        // make new slug in case of name change
        if (req.body.name) {
            req.body.slug = slugify(req.body.name, { lower: true });
        }
        const updatedBank = await Bank.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({ success: true, data: updatedBank });
    }
);

// USE : Delete a bank
// Route : DELETE /api/v1/banks/:id
exports.deleteBank = asyncHandler(
    async (req, res, next) => {
        const bank = await Bank.findById(req.params.id);
        if (!bank) {
            return next(new ErrorHandler(`Bank with id ${req.params.id} not found`, 404))
        }
        await bank.remove();
        res.status(200).json({ success: true, data: {} });
    }
);

// USE : Upload bank logo
// Route : PUT /api/v1/banks/:id/logo
exports.uploadLogo = asyncHandler(
    async (req, res, next) => {
        //check if bank exists
        const bank = await Bank.findById(req.params.id);
        if (!bank) {
            return next(new ErrorHandler(`Bank with id ${req.params.id} does not exist.`, 404));
        }
        // check if file is uploaded
        if (!req.files) {
            return next(new ErrorHandler(`Please upload a file.`, 400));
        }
        // check if file is an image (check the mimetype prop)
        const file = req.files.files;
        if (!file.mimetype.startsWith('image')) {
            return next(new ErrorHandler(`Please upload a valid image file.`, 400));
        }
        // check the image size (maximum limit set in env file)
        if (!file.size > process.env.FILE_UPLOAD_LIMIT) {
            return next(new ErrorHandler(`Please upload file of maximum size ${process.env.FILE_UPLOAD_LIMIT}.`, 400));
        }
        // create the filename to store
        const nameToStore = `${bank.slug}-logo-${bank._id}${path.parse(file.name).ext}`;

        // upload the file
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${nameToStore}`, async (err) => {
            if (err) {
                return next(new ErrorHandler(`Something went wrong with the upload.`, 500));
            }
            // put the file name in the bank document
            await Bank.findByIdAndUpdate(req.params.id, { logo: nameToStore });
            res.status(200).json({ success: true, data: nameToStore });
        })
    }
);