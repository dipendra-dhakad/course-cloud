import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa"
import HighLightedText from '../components/core/HomePage/HighLightedText'



const Home = () => {
  return (
    <div>
        {/* section-1 */}
         <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
             <Link to={"/signup"}>
               <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
                 <div  className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
                    <p>Become an instructor</p>
                    <FaArrowRight />
                 </div>
               </div>
             </Link>

             <div>
                   Empower Your Future with
                   <HighLightedText text={"Coding Skills"}/>
             </div>
         </div>

        {/* section-1 */}
 

        {/* section-1 */}


        {/* footer */}


    </div>
  )
}

export default Home