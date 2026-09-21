//this is to avoid lots of tyr catch and errror handling 
//this is a high order function as in the input we are taking the whole fucntion itslef

//this will automatically handle all the errors and will pass it to express's inbuild error and  now all the function that i will pass will be automatically promesified 


const asyncHandler = (requetHandler) => {
  return (req, res, next) => {
    Promise
    .resolve(requetHandler(req, res, next))
    .catch((err) => next(err))

  }; 


};
export { asyncHandler };