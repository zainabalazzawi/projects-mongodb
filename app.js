const express = require("express");
const { getDb, connectToDb } = require("./db");
const { ObjectId } = require("mongodb");
const cors = require("cors");

// init app & middleware
const app = express();
app.use(cors());
app.use(express.json());

// db connection
let db;

connectToDb((err) => {
  if (!err) {
    app.listen("8000", () => {
      console.log("app listening on port 8000");
    });
    db = getDb();
  }
});

// routes
app.get("/projects", (req, res) => {
  // const page = req.query.p || 0;
  // const projectPerPage = 1;

  let projects = [];

  db.collection("projects")
    .find()
    .sort({ projectName: 1 })
    // .skip(page * projectPerPage)
    // .limit(projectPerPage)
    .forEach((project) => projects.push(project))
    .then(() => {
      res.status(200).json(projects);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the documents" });
    });
});

app.get("/projects/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("projects")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not fetch the document" });
      });
  } else {
    res.status(500).json({ error: "The id is not valid" });
  }
});
// Create
app.post("/projects", (req, res) => {
  const project = req.body;

  db.collection("projects")
    .insertOne(project)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not create new document" });
    });
});
// Update
app.patch("/projects/:id", (req, res) => {
  const updateProject = req.body;
  if (ObjectId.isValid(req.params.id)) {
    db.collection("projects")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateProject })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not update the document" });
      });
  } else {
    res.status(500).json({ error: "Could not update the document" });
  }
});
// Delete
app.delete("/projects/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("projects")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not delete the document" });
      });
  } else {
    res.status(500).json({ error: "The id is not valid" });
  }
});
