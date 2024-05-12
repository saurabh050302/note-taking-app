const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    err ? console.log(err.message) : res.render("index", { files: files });
  });
});

app.post("/create", (req, res) => {
  let fileTitle = `files/${req.body.title
    .split(".txt")[0]
    .split(" ")
    .join("")}.txt`;
  let data = req.body.details;
  fs.writeFile(fileTitle, data, (err) => {
    err && console.log(err.message);
    res.redirect("/");
  });
});

app.get("/:action/:file", (req, res) => {
  if (req.params.action == "files") {
    fs.readFile(`files/${req.params.file}`, "utf-8", (err, data) => {
      err
        ? console.log(err.message)
        : res.render("show", {
            file: req.params.file.split(".txt")[0],
            details: data,
          });
    });
  } else if (req.params.action == "delete") {
    fs.unlink(`files/${req.params.file}.txt`, (err, data) => {
      err && console.log(err.message);
      res.redirect("/");
    });
  } else if (req.params.action == "edit") {
    fs.readFile(`files/${req.params.file}.txt`, "utf-8", (err, data) => {
      err
        ? console.log(err.message)
        : res.render("edit", {
            file: req.params.file.split(".txt")[0],
            details: data.trim(),
          });
    });
  }
});

app.post("/edit", (req, res) => {
  fs.rename(
    `files/${req.body.prev}.txt`,
    `files/${req.body.new}.txt`,
    (err) => {
      err && console.log(err);
    }
  );
  res.redirect("/");
});

app.listen(2000);
