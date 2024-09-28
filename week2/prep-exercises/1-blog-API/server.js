const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello World");
});

// create a new blog
app.post("/blogs", (req, res) => {
  const { title, content } = req.body;
  fs.writeFileSync(title, content);
  res.end("ok");
});

//Update an existing blog
app.put("/posts/:title", (req, res) => {
  const { title } = req.params;
  const { content } = req.body;
  if (fs.existsSync(title)) {
    fs.writeFileSync(title, content);
    res.end("ok");
  } else {
    res.status(404).send("This blog does not exist!");
  }
});

// delete a blog
app.delete("/blogs/:title", (req, res) => {
  const { title } = req.params;
  console.log(title);
  if (fs.existsSync(title)) {
    fs.unlinkSync(title);
    res.end("ok");
  } else {
    res.status(404).send("This blog does not exist!");
  }
});

// Read a blog
app.get("/blogs/:title", (req, res) => {
  const { title } = req.params;
  if (fs.existsSync(title)) {
    const post = fs.readFileSync(title);
    res.status(200).send(post);
  } else {
    res.status(404).send("This blog does not exist!");
  }
});

// Get titles of all existing blogs
app.get("/blogs", (req, res) => {
  const dirPath =
    "C:/Users/user1/Desktop/Node.js-Cohort49/week2/prep-exercises/1-blog-API";
  fs.readdir(dirPath, (error, files) => {
    if (error) {
      res.status(404).send("This blog does not exist!");
    } else {
      const blogsList = files.filter((file) => path.extname(file) === ".txt");
      const blogs = blogsList.map((blog) => ({
        Title: path.parse(blog).name,
      }));
      console.log(blogs);
      res.send(blogs);
    }
  });
});

app.listen(3000);
