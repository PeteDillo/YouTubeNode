require("dotenv").config();
const connectDb = require("./startup/db");
const express = require("express");
const cors = require("cors");
const app = express();

const comments = require("./routes/comments");
const replies = require("./routes/replies");

connectDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/comments', comments)
app.use('/api/replies',  replies);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running. Listening on PORT: ${PORT}`);
});