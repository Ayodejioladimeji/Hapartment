require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// initialize express
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// routes

app.use("/api/v1", require("./routes/newsletterRouter"));
app.use("/api/v1", require("./routes/userRouter"));

app.get("/", (req, res) => {
  res.json({ Text: "Welcome to our websites" });
});

// connect to mongo db
const URI = process.env.MONGO_URI;
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("connected to database");
  }
);

// port
const PORT = process.env.PORT || 6000;

// listen to port
app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
