const express = require('express');
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controller/category');

const bankRouter = require('./bank');

const router = express.Router();

// delegating request on a route to another router
router.use('/:categoryId/banks', bankRouter);


router.route('/').get(getCategories).post(createCategory);
router.route('/:id').get(getCategory).put(updateCategory).delete(deleteCategory);

module.exports = router;