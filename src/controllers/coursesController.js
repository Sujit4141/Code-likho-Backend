const Course = require("../models/courses");
const mongoose = require('mongoose');


const Addcourse = async (req, res) => {
  try {
    const { CourseName, CourseDescription, CoursePrice, validityDays, CourseMentor,CourseThumbnail } = req.body;
    
    
    if (!CourseName || !CourseDescription || !CoursePrice || !validityDays) {
      return res.status(400).send("Missing required fields: CourseName, CourseDescription, CoursePrice, validityDays");
    }

    
    if (typeof CoursePrice !== 'number' || CoursePrice <= 0) {
      return res.status(400).send("CoursePrice must be a positive number");
    }

    
    if (!Number.isInteger(validityDays) || validityDays <= 0) {
      return res.status(400).send("validityDays must be a positive integer");
    }

  
    if (CourseName.length < 4 || CourseName.length > 50) {
      return res.status(400).send("CourseName must be between 4-50 characters");
    }

    
    const newCourse = await Course.create({
      CourseName,
      CourseMentor,
      CourseDescription,
      CoursePrice,
      validityDays,
      CourseThumbnail: CourseThumbnail  // Default if not provided
    });
    
    // Return created course in response
    res.status(201).json({
      message: "Course created successfully",
      course: newCourse
    });
  } catch (err) {
    // Handle mongoose validation errors separately
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ error: messages });
    }
    
    // Handle other errors
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

const Updatecourse=async(req,res)=>{


   try {
    
    const {id}=req.params
    const { CourseName, CourseDescription, CoursePrice, validityDays, CourseMentor,CourseThumbnail } = req.body;
    
    
    if (!CourseName || !CourseDescription || !CoursePrice || !validityDays) {
      return res.status(400).send("Missing required fields: CourseName, CourseDescription, CoursePrice, validityDays");
    }

    
    if (typeof CoursePrice !== 'number' || CoursePrice <= 0) {
      return res.status(400).send("CoursePrice must be a positive number");
    }

    
    if (!Number.isInteger(validityDays) || validityDays <= 0) {
      return res.status(400).send("validityDays must be a positive integer");
    }

  
    if (CourseName.length < 4 || CourseName.length > 50) {
      return res.status(400).send("CourseName must be between 4-50 characters");
    }

    
    const updatedCourse = await Course.findByIdAndUpdate(id,{
      CourseName,
      CourseMentor,
      CourseDescription,
      CoursePrice,
      validityDays,
      CourseThumbnail: CourseThumbnail  // Default if not provided
    });
    
    // Return created course in response
    res.status(201).json({
      message: "Course Updated successfully",
      course: updatedCourse
    });
  } catch (err) {
    // Handle mongoose validation errors separately
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ error: messages });
    }
    
    // Handle other errors
    res.status(500).json({ error: "Server error: " + err.message });
  }
}

const getcoursebyid=async(req,res)=>{
 try {
    const { id } = req.params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid course ID format" });
    }

    const course = await Course.findById(id);
    
    // Check if course exists
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    res.status(200).json(course);
  }
  catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ error: "Internal server error" });
  }


}

const Deletecourse=async(req,res)=>{
  try{
    const {id}=req.params
 if (!id) {
      return res.status(400).json({ error: "Course ID is required" });
    }
    const deletedCourse = await Course.findByIdAndDelete(id);
      if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
 res.status(200).json({ 
      message: "Course deleted successfully",
    
    }
  )
  }catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ error: "Internal server error" });
  }
 
    
}



const  getallcourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }
    
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};



module.exports = { Addcourse,Updatecourse,getcoursebyid,Deletecourse,getallcourses };