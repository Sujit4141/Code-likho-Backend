const Goodies=require("../models/Goodies")


const addGoodies=async(req,res)=>{
    try {
    const { productName, productDescription, productPrice, quantity, productImage } = req.body;

    // Validate required fields
    if (!productName || !productDescription || !productPrice || !quantity || !productImage) {
      return res.status(400).json({ 
        message: "All fields are required: productName, productDescription, productPrice, quantity, productImage" 
      });
    }

    // Validate data types
    if (typeof productPrice !== 'number' || productPrice <= 0) {
      return res.status(400).json({ 
        message: "Product price must be a positive number" 
      });
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({ 
        message: "Quantity must be a non-negative integer" 
      });
    }

    const newGoodies = await Goodies.create({ 
      productName, 
      productDescription, 
      productPrice, 
      quantity,
      productImage 
    });

    // 201 status for resource creation
    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newGoodies
    });
  } catch (err) {
    console.error("Add product error:", err);
    
    // Handle duplicate key errors
    if (err.code === 11000 && err.keyPattern?.productName) {
      return res.status(409).json({
        message: `Product with name '${req.body.productName}' already exists`
      });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        message: "Validation failed",
        errors
      });
    }

    // Generic server error
    return res.status(500).json({
      message: "Server error while adding product",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }

}







const updateGoodies = async (req, res) => {
  try {
    const { id } = req.params;
    

     const { productName, productDescription, productPrice, quantity, productImage} = req.body;


     
    if (!productName || ! productDescription || ! productPrice|| !quantity) {
      return res.status(400).send("Missing required fields: productName,  productDescription, productPrice, quantity");
    }

    
    if (typeof  productPrice !== 'number' ||  productPrice <= 0) {
      return res.status(400).send(" productPrice must be a positive number");
    }

    
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).send("quantity must be a positive integer");
    }

  
    if (productName.length < 4 || productName.length > 50) {
      return res.status(400).send("productName must be between 4-50 characters");
    }
  
  
  
    // Find and update the document
    const updatedGoodies = await Goodies.findByIdAndUpdate(
      id,
     {
       productName, productDescription, productPrice, quantity, productImage
     }
  
    );
  

    if (!updatedGoodies) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedGoodies
    });
    
  } catch (err) {
    console.error("Update product error:", err);
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    
    if (err.code === 11000 && err.keyPattern?.productName) {
      return res.status(409).json({
        message: `Product with name '${req.body.productName}' already exists`
      });
    }
    
    res.status(500).json({
      message: "Server error while updating product",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

const getAllGoodies=async(req,res)=>{
   try {
    const goodies = await Goodies.find({});
    
    if (!goodies || goodies.length === 0) {
      return res.status(404).json({ message: "No goodies found" });
    }
    
    res.status(200).json(goodies);
  } catch (err) {
    console.error("Error fetching goodies:", err);
    res.status(500).json({ error: "Internal server error" });
  }
  
}


const getGoodiesById=async(req,res)=>{
   try{
      const { id } = req.params;
      const goodies=await Goodies.findById(id);
        if (!goodies) {
      return res.status(404).json({ error: "goodies not found" });
    }
    
    res.status(200).json(goodies);

   }
   catch(err){
      console.error("Error fetching Goodies:", err);
    res.status(500).json({ error: "Internal server error" });
   }
}





const deleteGoodies=async(req,res)=>{

   try{
    const {id}=req.params
 if (!id) {
      return res.status(400).json({ error: "Course ID is required" });
    }
    const deletedGoodies = await Goodies.findByIdAndDelete(id);
      if (!deleteGoodies) {
      return res.status(404).json({ error: "Goodies not found" });
    }
 res.status(200).json({ 
      message: "Goodies deleted successfully",
    
    }
  )
  }catch (err) {
    console.error("Error deleting Goodies:", err);
    res.status(500).json({ error: "Internal server error" });
  }

}

 

module.exports={ addGoodies,
  updateGoodies,
  getAllGoodies,
  getGoodiesById,
  deleteGoodies}