This is an API/server example, using nodeJS, express, sequelize and postgres. Made during my stay at Academlo Bootcamp, May 2022.
It is about a computer repair service database with relational models, where the employes can consult their own information as well as all the pending repairs, just one by ID, update one by ID or delete one by ID.

To run this project you gotta have an installation of Postgres and nodeJS, then just run the following two comands in proyects's root folder:
npm install
npm start

Users endpoints:
http://localhost:400/api/v1/users (GET all users)
http://localhost:400/api/v1/users/:id (GET user by ID)

User verbs body:
POST (create a new user in "/users"):
{
    "name": "name",
    "email": "email@email.com",
    "password": "password",
    "role": "role"
}
PATCH (update user info by id in "/users/:id"):
{
    "name": "name",
    "email": "email@email.com"
}
DELETE (disable user by id in "/users/:id"):
NO BODY REQUIRED

Repairs endpoints:
http://localhost:400/api/v1/repairs (GET all repairs)
http://localhost:400/api/v1/repairs/:id (GET repair by ID)

Repair verbs body:
POST (create a new repair in "/repairs"):
{
    "date": "YYYY-MM-DD",
    "computerNumber": number,
    "comments": "comments",
    "userId": id
}
PATCH (update repair status by id in "/repairs/:id"):
{
    "status": "status"
}
DELETE (Cancell repair by id in "/repairs/:id"):
NO BODY REQUIRED

- Roberto Rodríguez