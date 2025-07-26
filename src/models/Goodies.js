const mongoose = require("mongoose"); 
const { Schema } = mongoose;  

const GoodiesSchema = new Schema({  
  productName: {
    type: String,
    required: true,
    minLength: 5  
  },
  productDescription: {
    type: String,
    required: true,
    minLength: 10
  },
  productPrice: {  
    type: Number,
    required: true,
    min: 0  //
  },
  quantity: {
  type: Number,
  min: 0,
  default: 0
},
  productImage: {  
    type: String,
    required: true  
  }
}, {
  timestamps: true  
});

const Goodies = mongoose.model("Goodies", GoodiesSchema);
module.exports = Goodies; 