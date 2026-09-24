import { User } from "../modles/user.models.js";
import { ApiResponse } from "../utils/api_response.js";
import { ApiError } from "../utils/api_error.js";
import { asyncHandler } from "../utils/async_handler.js";

const generateAccessAndRefreshToken = async (userID) => {
  try{
    const user = await User.findById(userID)
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})
    return {accessToken, refreshToken}
  }catch (error){

    500,
    "Something went wrong while generting access token "
  };

}

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  
  const user = await User.create({
    email,
    username,
    password,
    role,
    isEmailVerified: false,
  });
 const {unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken();
  

 user.emailVerificationToken = hashedToken
 user.emailVerificationexpiry = tokenExpiry

 await user.save({validateBeforeSave: false})
});

export { registerUser };