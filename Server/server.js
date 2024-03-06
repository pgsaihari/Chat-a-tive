const colors = require("colors");
const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/data");
const cors = require("cors");
const connection = require("./config/db");
dotenv.config();

// requiring routers
const userRouter=require("./routes/userRoutes")
const chatRouter=require('./routes/chatRouter')
const messageRouter=require('./routes/messageRoutes')
const {notFound,errorHandler}=require('./middlewares/errorMiddlewarre')

// database connection
connection();
// express app
const app = express();
const port = process.env.PORT || 8080;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors()
);

app.get("/", (req, res) => res.send("Hello World!"));

// routes middlewares

app.use("/api/user",userRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)
app.use(notFound)
app.use(errorHandler)
const server=app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`.bgMagenta)
);

const io=require("socket.io")(server,{
  pingTimeOut:60000,
  cors:{
    origin:"http://localhost:5173",
 
  }
})

io.on("connection", (socket) => {
  // console.log("Client connected:", socket.id);

  socket.on("setup", (user) => {
    console.log("User setup:", user);
    socket.join(user._id);
    socket.emit("connected");
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log("User joined Room:", room);
  });

  // TODO implement typing functionalitty
  // socket.on('typing',(room)=>{
  //   socket.in(room).emit("typing")
  // })
  // socket.on('stop typing',(room)=>{
  //   socket.in(room).emit("typing")
  // })

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
