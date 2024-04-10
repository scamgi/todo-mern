const express = require("express");
const taskRouter = require("./routes/task.route");
const path = require("path");
require("dotenv").config();

const app = express();

/* A middleware that parses the body of the request and makes it available in the req.body object. */
app.use(express.json());

// This code let you point to the index.html file during the production mode.
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
} else {
  /* This is the root route. It is used to check if the server is running. */
  app.get("/", (req, res) => {
    res.status(200).json({ alive: "True" });
  });
}

// use taskRouter
app.use("/api/tasks", taskRouter);

module.exports = app;
