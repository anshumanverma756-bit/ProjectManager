import { ApiResponse } from "../uitles/api_response.js";
// as we have async handler 
import { asyncHandler } from "../uitles/async_handler.js";

/**
const healthCheck = async (req, res ,next) =>{
  try {
    const user = await getUserFromDB()

    res
    .status(200)
    .json(
      new ApiResponse(200, {message: "Server is running"})
    )
  } catch (error){
    next(err)
  }
};
 */

//writing the same function by=ut with async handler now 

const healthCheck = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { message: "Server is running" }));
});
// this is the better peace of code as we do not have to write the cathc  fucntion

export { healthCheck };

