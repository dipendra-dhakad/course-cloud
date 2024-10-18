// const mongoose = require ("mongoose");
// require("dotenv").config();

// exports.connect = ()=>{
//   mongoose.connect(process.env.MONGODB_URL
//   )

//   .then(() => {
//     console.log("Db connected successfully")
//   }).catch((err) => {
//        console.log("Db connection error");
//       //  console.log("error is" +err);
//        console.error(err);
//        process.exit(1);

//   });

// }

// const mongoose = require("mongoose");



// exports.connect =()=>{
//     mongoose.connect(process.env.MONGODB_URL)

//     .then(console.log("DB connected successfully"))
//     .catch((error)=>{
//           console.log("DB connection Issues");
//           console.log(error);
//           process.exit(1);
//     })

// }

const mongoose = require("mongoose");
require("dotenv").config();
exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB connected successfully");
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
};


