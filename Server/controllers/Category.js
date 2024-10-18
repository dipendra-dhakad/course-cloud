const Category = require("../models/Category");

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

//create tag ka handler function
exports.createCategory = async (req,res)=>{
    try {
        //fetch data
         const {name,description} = req.body;
         //validation
        if(!name || !description){
             return res.status(400).json({
                success:false,
                message:"All fields are required",
             })   
        }

        //create entry at db
        const CategoryDetails = await Category.create({
            name:name,
            description:description,
        });
        console.log(CategoryDetails);

        //return response
        return res.status(200).json({
            success:true,
            message:"Category Created Successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//get All tags handler function
  exports.showAllCategory = async (req,res) =>{
    try {
        const allCategory = await Category.find({},{name:true,description:true});
        res.status(200).json({
            success:true,
            data:allCategory,
            message:"All Category returned successfully",
            
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
  }

  //get Categorypagedetails
  exports.categoryPageDetails = async (req, res) => {
    try {
      //get category id
      const { categoryId } = req.body;
  
      //get course for specified categoryId
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: "ratingAndReviews",
        })
        .exec();
  
        //validation
      if (!selectedCategory) {
        console.log("Category not found.");
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }
  
      
      if (selectedCategory.courses.length === 0) {
        console.log("No courses found for the selected category.");
        return res.status(200).json({
          success: true,
          message: "No courses found for the selected category.",
        });
      }
  
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      });

      //get courses for different categories 
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec();
      console.log();
  
      const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec();

        //top selling courses
      const allCourses = allCategories.flatMap((category) => category.courses);
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10);
  
        //return response
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };