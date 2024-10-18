// const mongoose = require("mongoose");
// // const { type } = require("os");

// const courseProgress = new mongoose.Schema({
//   courseID: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Course",
//   },
//   completedVideos: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "SubSection",
//     },
//   ],
// });

// module.exports = mongoose.model("CourseProgress", courseProgress);


const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true, // Make sure this is required
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // This will link the progress to a specific user
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

module.exports = mongoose.model("CourseProgress", courseProgressSchema);
