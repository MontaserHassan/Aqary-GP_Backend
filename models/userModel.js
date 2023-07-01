const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please tell us your first name!']
    },
    lastName: {
        type: String,
        required: [true, 'Please tell us your last name!']
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        default: 3
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,  'Please provide a valid email']
    },
    password:{
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }

    },
    passwordChangedAt: Date
});

userSchema.pre('save', async function(next){
    //Only run this function if password was actually modified
    if(!this.isModified('password')){
        return next();
    }

    //Hash the password with cost 12
    this.password = await bcrypt.hash(this.password, 12);

    //Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();

});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.method.changedPasswordAfter = function(JWTTimeStamp) {
    if(this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimeStamp < changedTimeStamp;
    };

    //False means not changed
    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;