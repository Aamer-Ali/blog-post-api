const express = require("express");
const cors = require("cors");
const connection = require("./connection");
const category = require("./routes/category");
const post = require("./routes/posts");
const user = require("./routes/users");
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/category", category);
app.use("/api/posts", post);
app.use("/api/users", user);

app.listen(3000);
