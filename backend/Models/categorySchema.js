// Models/category.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Category schema
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
}); 

// Create and export the model
module.exports = mongoose.model("Category", categorySchema);
