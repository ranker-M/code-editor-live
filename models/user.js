const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const projectSchema = new Schema({
    projectName: { type: String, required: true },
    language: { type: String, required: true },
    text: { type: String, required: true }
}, { timestamps: true });

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, sparse: true },
    projects: [projectSchema]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
