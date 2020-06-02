const mongoose = require('mongoose');
const Category = require('./Category');
const slugify = require('slugify');

const url_re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
const BankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add bank name.'],
        trim: true,
        unique: true
    },
    slug: String,
    category: {
        type: mongoose.Schema.ObjectId,
        ref: Category,
        required: true
    },
    head_office: {
        type: String,
        required: [true, 'Please add head office location.'],
    },
    emails: {
        type: [String],
        validate: {
            validator: (emails) => {
                let flag = true;
                let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                emails.forEach(email => {
                    if (!re.test(email)) {
                        flag = false;
                    }
                })
                return flag;
            },
            message: "Not valid email addresses!"
        }
    },
    website: {
        type: String,
        match: [url_re, 'Please use a valid URL with HTTP or HTTPS']
    },
    socials: {
        facebook: {
            type: String,
            match: [url_re, 'Please use a valid URL with HTTP or HTTPS']
        },
        instagram: {
            type: String,
            match: [url_re, 'Please use a valid URL with HTTP or HTTPS']
        },
        linkedin: {
            type: String,
            match: [url_re, 'Please use a valid URL with HTTP or HTTPS']
        },
        twitter: {
            type: String,
            match: [url_re, 'Please use a valid URL with HTTP or HTTPS']
        },
        youtube: {
            type: String,
            match: [url_re, 'Please use a valid URL with HTTP or HTTPS']
        }
    },
    contact: {
        type: [String],
        required: [true, 'Please add a contact number']
    },
    logo: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

BankSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
})

module.exports = mongoose.model('Bank', BankSchema);