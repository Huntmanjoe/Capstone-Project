# Phase 5 Full stack Solo Project

## Introduction

Hello and welcome to my project! if you somehow made it here, I'd like to thank you for your time spent checking this project out. My name is Hunter and this is my final  project for phase-5 of Flatiron School. The goal here was to come up with a website idea from scratch and build it out solo. It is full stack, requiring the use of javascript/React for the frontend and Python/Flask for the backend. 

The website is called GameList, and I intended it to be a sort of video game resume. You can log in, and then search for any game that has ever existed and put it on your profile if you have played (or own) it. If this were a fully explored and integrated website, you'd be able to send the link to your profile to friends and they can see your GameList at a glance. Instantly knowing all the games you've ever played.

## Setup

### `server/`

The `server/` directory contains all of your backend code.

Within `server/`, you'll find the 3 main python files, along with the database (app.db), and migrations. App.py runs all of the routing for the backend and a lot of setting up the main functional code. Config sets up all of the needed dependencies and whatnot without cluttering App. Models contain my class Models, needed for the project to work.

to get the backend running, you must install pipenv "pipenv install", then go into your virtual enviornment "pipenv shell". After this, cd into `sever/` and run 'python app.py'. Done!

### `client/`

the `client/` directory contains all of your frontend code.

within `client/` you'll find the src directory. Open that up and you'll be greeted with the beating heart of the application. You can see all of the css files, which are actively styling the website. If you cd into `/components`, you'll find every react javascript component. Each of these handle rendering different core components of the website, but app.js is the most important. Within app.js, you'll find the umbrella that holds everything together.

to get the frontend running, you must install npm "npm install", then cd into the `client/` directory and run "npm start". This will open up localhost/3000, where the website is run. Make sure you have the backend running or else it'll be blank!

### And that's that!

Thank you for taking the time to look at my code, it was a fun little project that I enjoyed doing, and I hope I showed you something new or gave you some sort of inspiration.
Until the next time!

- Hunter