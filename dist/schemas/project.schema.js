"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.ProjectSchema = new mongoose.Schema({
    name: String,
    location: String,
    professionalsNeeded: [String],
    area: [String],
    shortDescription: String,
    description: String,
    userId: String,
    comments: [{ userId: String, comment: String }],
    like: [String],
    dislike: [String]
});
//# sourceMappingURL=project.schema.js.map