const mongoose = require('mongoose');
const slugify = require("slugify");

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Please add a category title.']
    },
    slug: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

CategorySchema.pre('save', function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});
//to reverse populate with virtuals
CategorySchema.virtual('banks', {
    ref: 'Bank',
    localField: '_id',
    foreignField: 'category',
    justOne: false
});

module.exports = mongoose.model('Category', CategorySchema);