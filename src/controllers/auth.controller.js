import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api_response.js";
import { ApiError } from "../utils/api_error.js";
import { asyncHandler } from "../utils/async_handler.js";
import { sendEmail } from "../utils/mail.js";
import { emailVerificationMailgenContent } from "../utils/mail.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    email,
    username,
    password,
    role,
    isEmailVerified: false,
  });

  const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationexpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
    ),
  });

  const createdUser = await User.findById(user._id).select(
  "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
);
  if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering a user")
  }
  return res
  .status(201)
  .json(
    new ApiResponse(
      200,
      {user: createdUser} ,"User registered successfully and verifiaction email has been sent on your email "
    ),
  )
});

const login = asyncHandler(async (req, res) => {
  const{email, password, username} =  req.body
 if (!username && !email) {
  throw new ApiError(400, "Username or email is required");
}
console.log("1. login hit", req.body);

  const user = await User.findOne({email});
  console.log("2. user found:", !!user);
  if (!user){
    throw new ApiError(400, "User does not exit ")
  }
  
  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log("3. password checked");

  if (!isPasswordValid){
    throw new ApiError(400, "Invalid cerdentials");
  }


  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
  console.log("4. tokens generated");

   const loggedInUser = await User.findById(user._id).select(
  "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
);
const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};
return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      { user: loggedInUser, accessToken, refreshToken },
      "User logged in successfully"
    )
  );
});


const logoutUser = asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:"",
      },
    },
    {
      new:true,
    },
  );
 const options = {
  httpOnly:true,
 };
 return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200,{},"User logged out"));
});

const getCurrentUser = asyncHandler (async (req,res) =>{
 return res
 .status(200)
 .json(
  new ApiResponse(
    200,
    req.user,
    "Current user fetched successfully"
  )
 )
});

const verifyEmail = asyncHandler (async(req,res) => {
  const {verificationtoken} =  req.params

  if(!verificationtoken){
    throw new ApiError(400, "Email verification token is missing")
  }

  let hashedToken = crypto
    .createHash("sha256")
    .update(verificationtoken)
    .digest("hex")

    const user = await User.findOne({
      emailVerficationToken: hashedToken, 
      emailVerficationExpiry: {$gt: Date.now()}, 
    })

    if(!user){
      throw new ApiError(400, "Token is invalid or expiry")
    }
    
    user.emailVerficationToken = undefined 
    user.emailVerficationExpiry= undefined



    user.isEmailVerified = true
    await useReducer.save({validateBeforeSave: false})

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            isEmailVerified: true,
          },
          "Email is verified",
        )
      )
});

const resendEmailVerfication = asyncHandler (async (req,res) =>{
  const user =  await User.findById(req.user?._id);

  if(!user){
    throw new ApiError(404,"User does not exit")
  }
  if (user.isEmailVerified){
    throw new ApiError(409,"Email is already verified")
  }

  const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
    ),
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Mail has been sent to your email ID"
      )
    )

});

const refreshAccessToken = asyncHandler(async (req, res) =>{
  const incomingRefreshToken = req.cookies.refreshAccessToken || req.body.refreshToken
  
  if(!incomingRefreshToken){
     throw new ApiError(401, "Unauhtorized access")
  }
  try{
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

   const user = await User.findById(decodedToken?._id);
   if(!user){
    throw new ApiError(401,"Invalid refresh token");
   }
   if(incomingRefreshToken !== user?.refreshToken){
     throw new ApiError(401,"Refresh token is expired");
   }
   const options = {
    httpOnly: true,
    secure: true
   }
   const{accessToken, refreshAccessToken: newRefreshToken}= await generateAccessAndRefreshToken(user._id)

   user.refreshToken = newRefreshToken;
   await user.save()

   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken", newRefreshToken,options)
   .json(
    new ApiResponse(
      200,
      {accessToken, refreshToken: newRefreshToken},
      "Access token refreshed"
    )
   )

  } catch (error){
    throw new ApiError(401, "Invalid refresh token")

  }
  

})


export { registerUser, login ,logoutUser,getCurrentUser, verifyEmail, resendEmailVerfication ,refreshAccessToken};
