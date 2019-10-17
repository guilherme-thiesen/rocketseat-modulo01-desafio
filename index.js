/*
Desafio
Desenvolver uma api rest para tasks
*/

const express = require("express");

const server = express();


const projects = [
{ id : 1, title : "Módulo 01", tasks : []},
{ id : 2, title : "Módulo 01 - Desafio", tasks : []}
];

var numRequests = 0;

server.use(express.json());

function logRequests(req,res,next){

  numRequests++;
  console.log(`Total of requests: ${numRequests}`);
  next();

}

server.use(logRequests);

function checkProject(req,res,next){

  const {id} = req.params;

  const project = projects.find( p => p.id == id);

  if(!project){
    return res.status(400).json({message : "Project not found"});
  }

  req.project = project;

  next();

}

function checkTitle(req,res,next){
  const {title} = req.body;

  if(!title){
    return res.status(400).json({message : "Title is mandatory"});
  }

  next();

}





// list all projects
server.get('/projects',(req,res) => {
  res.json(projects);
});

// add a project
server.post('/projects',checkTitle,(req,res) => {
  const {id,title} = req.body;

  if(!id){
    return res.status(400).json({message : "id is mandatory"});
  }

  const findProject = projects.find( p => p.id == id);
  if(findProject){ 
    return res.status(400).json({message : "Project id already exists"});

  }

  const project = {
    id,
    title,
    tasks : []
  };

  projects.push(project);
  res.json(projects);
})

// add a task
server.post('/projects/:id/tasks',checkProject,checkTitle,(req,res) => {
  const {title} = req.body;
  req.project.tasks.push(title);
  res.json(projects);
})

// update a projects
server.put('/projects/:id',checkTitle,checkProject,(req,res) => {
  const {title} = req.body;

  req.project.title = title;
  
  res.json(projects);
})

// delete a projects
server.delete('/projects/:id',checkProject,(req,res) => {
  const {id} = req.params;
  const index = projects.findIndex( p => p.id == id);
  projects.splice(index,1);
  
  res.send();
})


server.listen(3001);

