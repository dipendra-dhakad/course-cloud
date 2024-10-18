const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/courseEnrollmentEmail");
const {default :mongoose} = require("mongoose");

//capture the payment and intiate the razorpay order
exports.capturePayment = async (req, res) => {
  //get courseId and userID
  const { course_id } = req.body;
  const userId = req.user.id;

  //validation
  //valid courseId
  if (!course_id) {
    return res.json({
      success: false,
      message: "Please provide valid course id",
    });
  }
  //valid courseDEtail
  let course;
  try {
    course = await Course.findById(course_id);
    if (!course) {
      return res.json({
        success: false,
        message: "Could not find the course",
      });
    }
    //user already pay for the same course
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentsEnroled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "Student is already enrolled",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  //order created
  const amount = Course.price;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: course_id,
      userId,
    },
  };

  try {
    //intialize the payment using response
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);
    res.json({
      success: true,
      courseName:course.courseName,
      courseDescription:course.courseDescription,
      thumbnail:course.thumbnail,
      orderId:paymentResponse.currency,
      amount:paymentResponse.amount,
    //   data: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." });
  }
};


//verify signature or payment of razorpay and server

exports.verifyPayment = async (req,res)=>{
     const webhookSecret = "12345678";

     const signature = req.headers ["x-razorpay-signature"];

     const shasum = crypto.createHmac("sha256" , webhookSecret);
     shasum.update(JSON.stringify(req.body));
     const digest = shasum.digest("hex");

     if(signature === digest) {
        console.log("Payment is Authorised");

        const {courseId , userId} = req.body.payload.payment.entity.notes;

        try {
            //fulfill the action

            //find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                                           {_id:courseId},
                                           {$push:{studentsEnrolled : userId}},
                                           {new:true},
            );

            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:'Course not found',
                });
               
            }
            console.log(enrolledCourse);
            //find the student and add the course to their list enrolled course me
            const enrolledStudent = await User.findOneAndUpdate(
                                             {_id:userId},
                                             {$push:{courses:courseId}},
                                             {new:true},
           ) ;

           console.log(enrolledStudent);

           //mail send krdo comfirmation vala
           const emailResponse = await mailSender(
                                 enrolledStudent.email,
                                 "Congratulations from CodeHelp",
                                 "Congratulations you are onboarded into new codeHelp Course",
           );
           console.log(emailResponse);

           return res.status(200).json({
            success:true,
            message:'Signature verified and course Added',
        });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
     }
     else{
        return res.status(400).json({
            success:false,
            message:'Invalid request ',
        });
     }
}