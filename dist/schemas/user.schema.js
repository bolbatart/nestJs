"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 255
    },
    firstName: {
        type: String,
        maxlength: 255
    },
    lastName: {
        type: String,
        maxlength: 255
    },
    bio: {
        type: String,
        maxlength: 255
    },
    resetPasswordKey: {
        type: String,
        maxlength: 255
    },
    keyExpires: {
        type: String,
        maxlength: 255
    }
});
//# sourceMappingURL=user.schema.js.map