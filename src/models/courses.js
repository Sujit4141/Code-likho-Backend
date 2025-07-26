const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  CourseName: {
    type: String,
    minLength: 4,
    maxLength: 50,
    required: true
  },
  CourseDescription: {  
    type: String,
    required: true
  },
  CourseMentor:{
    type:String,
    required:true,
    minLength:3


  },
  CoursePrice: {  
    type: Number,
    required: true
  },
  validityDays: {
    type: Number,
    required: true,
    min: 1,
    default: 30
  },
  CourseThumbnail: {
    type: String,  
    default:"https://www.coderarmy.in/assets/images/Imgwebp/cwebp/frontpage-bgimage-removebg-min_1.jpg"
  }
}, {
  timestamps: true
});

const Course = mongoose.model("Course", courseSchema);  

module.exports = Course;