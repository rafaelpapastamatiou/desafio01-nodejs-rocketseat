const express = require("express");
const server = express();
let projects = [];
let reqNumber = 0;

server.use(express.json());

server.use((req, res, next) => {
  console.log(`Número atual de requisições: ${++reqNumber}`);
  return next();
});

const projectExists = (req, res, next) => {
  const { id } = req.params;
  if (!projects.find(p => p.id === parseInt(id))) {
    return res.status(404).json({ error: "Project does not exists." });
  }
  return next();
};

const projectAlreadyExists = (req, res, next) => {
  const { id } = req.body;
  if (projects.find(p => p.id === parseInt(id))) {
    return res.status(400).json({ error: "Project already exists." });
  }
  return next();
};

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", projectExists, (req, res) => {
  const { id } = req.params;
  const project = projects.find(p => p.id === parseInt(id));
  return res.json(project);
});

server.post("/projects", projectAlreadyExists, (req, res) => {
  const { id, title } = req.body;
  projects.push({ id: id, title: title, tasks: [] });
  return res.json(projects);
});

server.put("/projects/:id", projectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  projects.forEach(project => {
    if (project.id === parseInt(id)) project.title = title;
  });
  return res.json(projects);
});

server.delete("/projects/:id", projectExists, (req, res) => {
  const { id } = req.params;
  projects = projects.filter(p => p.id !== parseInt(id));
  return res.json(projects);
});

server.post("/projects/:id/tasks", projectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  projects.forEach(project => {
    if (project.id === parseInt(id)) project.tasks.push(title);
  });
  return res.json(projects);
});

server.listen(3000);
