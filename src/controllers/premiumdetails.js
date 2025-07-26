const Premium=require("../models/premiumuser")
const mongoose = require("mongoose");





const createPremiumRecord = async (req, res) => {
  try {
    const { userId, courses } = req.body;

    if (!userId) {
  return res.status(400).json({ message: "User ID is required" });
}
    

    // 1. Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    // 2. Normalize courses to array
    let courseArray = [];
    if (courses) {
      // If single ID string, convert to array
      if (typeof courses === 'string') {
        courseArray = [courses];
      } 
      // If already array, use directly
      else if (Array.isArray(courses)) {
        courseArray = courses;
      }
    }

    // 3. Validate every course ID
    const invalidCourses = courseArray.filter(id => 
      !mongoose.Types.ObjectId.isValid(id)
    );
    if (invalidCourses.length > 0) {
      return res.status(400).json({ 
        message: "Invalid Course IDs", 
        invalidCourses 
      });
    }

    // 4. Check existing record
    const existingRecord = await Premium.findOne({ user: userId });
    
    // 5. Merge courses (remove duplicates)
    const existingCourseIds = existingRecord?.courses.map(id => id.toString()) || [];
    const updatedCourses = [
      ...new Set([...existingCourseIds, ...courseArray])
    ];

    // 6. Create/update record
    const premiumData = {
      user: userId,
      courses: updatedCourses,
      iscourse:true

    };

    const record = await Premium.findOneAndUpdate(
      { user: userId },
      premiumData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      message: "Premium access updated successfully",
    });
  } catch (err) {
    res.status(500).send({ // Use 500 for server errors
      message: "Failed to save courses",
      error: err.message // Send only error message for security
    });
  }
};


const premiumstatus = async (req, res) => {
  try {
    // Correctly extract ID from route parameters
    const { id } = req.params;

    // Validate ID format (example using Mongoose validation)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Update the document and get the updated version
    const updatedPremium = await Premium.findByIdAndUpdate(
      id,
      { isPremium: true },  // Update operation // Return updated doc and validate
    );

    // Handle document not found
    if (!updatedPremium) {
      return res.status(404).json({ error: "Premium record not found" });
    }

    // Send success response with updated data
    res.status(200).json({
      message: "Premium status updated successfully",
      premium: updatedPremium
    });

  } catch (error) {
    // Handle database errors
    console.error("Update error:", error);
    res.status(500).json({ 
      error: "Server error during update",
      details: error.message 
    });
  }
};



const premiumdetails = async (req, res) => {
  try {
    const { userid } = req.body;

    // 1. Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userid)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    // 2. Find by USER reference (not premium record ID)
    const data = await Premium.findOne({ user: userid }).populate('courses');

    // 3. Handle not found case properly
    if (!data) {
      return res.status(200).json({ 
        message: "You haven't purchased any premium courses",
        isPremium: false,
        courses: []
      });
    }

    // 4. Successful response
    res.status(200).json({
      id:data._id,
      isPremium: data.isPremium,
      courses: data.courses,
      purchasedDate: data.createdAt
    });
  } catch (err) {
    // 5. Proper error handling
    console.error("Premium details error:", err);
    res.status(500).json({
      message: "Failed to fetch premium details",
      error: err.message
    });
  }
};

module.exports={premiumdetails,createPremiumRecord,premiumstatus}