const mongoose = require("mongoose");

const connection = async () => {
  try {
    mongoose
      .connect(
        process.env.MONGO_URI
      )
      .then(() => {
        console.log("Database is connected".bgYellow);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

// const connectDB = mongoose
//   .connect(
//     "mongodb+srv://saihari:1234@cluster0.nd1zcik.mongodb.net/chatactive?retryWrites=true&w=majority "
//   )
//   .then(() => {
//     console.log("Database is connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = connection
