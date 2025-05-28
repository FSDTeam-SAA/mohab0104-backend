// const handleDuplicateError = (error) => {
//   const statusCode = 400;
//   const field = Object.keys(error.keyValue || {})[0];
//   const value = error.keyValue?.[field];

//   const errorSource = [
//     {
//       path: field || "",
//       message: `${value} is already exist`,
//     },
//   ];

//   return {
//     statusCode,
//     message: `${field} must be unique`,
//     errorSource,
//   };
// };

// module.exports = handleDuplicateError;
