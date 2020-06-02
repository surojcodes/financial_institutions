const mongoose = require('mongoose');
const Category = require('../model/Category');
const ErrorHandler = require('../utils/ErrorHandler');
const asyncHandler = require('../middlware/async');
const slugify = require('slugify');

// USE : Get all the categories
// Route : GET /api/v1/categories
exports.getCategories = asyncHandler(
    async (req, res, next) => {
        const categories = await Category.find().populate({
            path: 'banks',
            select: 'name'
        });
        res.status(200).json({ success: true, count: categories.length, data: categories });
    }
)

// USE : Get single categories
// Route : GET /api/v1/categories/:id
exports.getCategory = asyncHandler(
    async (req, res, next) => {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return next(new ErrorHandler(`Resource not Found!`, 404));
        }
        res.status(200).json({ success: true, data: category })
    }
);

// USE : Create a category
// Route : POST /api/v1/categories
exports.createCategory = asyncHandler(
    async (req, res, next) => {
        const category = await Category.create(req.body);
        res.status(201).json({ success: true, data: category });
    }
);

// USE : Update a category
// Route : PUT /api/v1/categories/:id
exports.updateCategory = asyncHandler(
    async (req, res, next) => {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return next(new ErrorHandler(`Category with id ${req.params.id} not found`, 404));
        }
        // updating slug
        req.body.slug = slugify(req.body.title, { lower: true });
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({ success: true, data: updatedCategory })
    }
);

// USE : Delete a category
// Route : DELETE /api/v1/categories/:id
exports.deleteCategory = asyncHandler(
    async (req, res, next) => {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    }
)