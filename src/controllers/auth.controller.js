import { User } from "../modles/user.models.js";
import { ApiResponse } from "../utils/api_response.js";
import { ApiError } from "../utils/api_error.js";
import { asyncHandler } from "../utils/async_handler.js";

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
  return res.status(201).json(
    new ApiResponse(201, { user }, "User registered successfully")
  );
});

export { registerUser };