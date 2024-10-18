const Section = require("../models/Section")
const Course = require("../models/Course")
const SubSection = require("../models/Subsection")
// CREATE a new section
exports.createSection = async (req, res) => {
  try {
    // Extract the required properties from the request body
    const { sectionName, courseId } = req.body

    
    // Validate the input
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required properties",
      })
    }

    // Create a new section with the given name
    const newSection = await Section.create({ sectionName })

    // Add the new section to the course's content array
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )

      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    // Return the updated course object in the response
    res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourseDetails,
    })
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// UPDATE a section

exports.updateSection = async (req, res) => {
    try {
        //data input
      const { sectionName, sectionId, courseId } = req.body


      //data validation
      if (!sectionName || !courseId) {
        return res.status(400).json({
          success: false,
          message: "Missing required properties",
        })
      }
      //update data
      const section = await Section.findByIdAndUpdate(
        sectionId,
        { sectionName },
        { new: true }
      )
      const course = await Course.findById(courseId)
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
      console.log(course)

      //return res
      res.status(200).json({
        success: true,
        message: section,
        data: course,
      })
    } catch (error) {
      console.error("Error updating section:", error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }
  
  //delete section
  exports.deleteSection = async (req,res) =>{
    try {
        //get ID - assuming that we are sending Id in params
        const { sectionId, courseId } = req.body

        //use find by id and delete 
        await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });
    const section = await Section.findById(sectionId);
    console.log(sectionId, courseId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    await SubSection.deleteMany({ _id: { $in: section.subSection } });

    await Section.findByIdAndDelete(sectionId);

    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

        //return response
        res.status(200).json({
            success: true,
            message: "Section deleted Successfully",
            data: course,
          })
    } catch (error) {
        console.error("Error deleting section:", error)
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        })
    }
  }