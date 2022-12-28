require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// initialize express
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// routes

app.use("/api/v1", require("./routes/newsletterRouter"));
app.use("/api/v1", require("./routes/userRouter"));
app.use("/api/v1", require("./routes/listRouter"));
app.use("/api/v1", require("./routes/agentRouter"));
app.use("/api/v1", require("./routes/notificationRouter"));

// app.get("/", (req, res) => {
//   res.json({ Text: "Hapartment API", Version: "1.0.0" });
// });

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
const PORT = process.env.PORT || 8000;

app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// listen to port
app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
