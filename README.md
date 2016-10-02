# A Cleanslate for developing our app

Hey, I tried to make a blank project (with some small samples) to get us started. 
I want to make sure we have a good foundation so we can kickstart our development. 

## Running the project

To fire up the server, pull down the repo, open the directory, and run

    npm start

This should install any packages you need, then fire up the server to listen
on port 3003. If this conflicts with something you already have running, you 
can change the port in server.js. Then take any browser and head to 

    localhost:3003

You should see 3 links, which each do something when clicked. 

## What's included here

1. node.js - server written in js
2. npm - node package manager
3. Angular - js client side framework
4. Angular UI router - client side routing
5. Express - node server framework
6. Lodash - js utility library (successor of underscore)

Thing's we still need to add:

7. Webpack - bundling 


## 1. Node

Node is javascript runtime environment. The primary use of node is as a webserver, 
but you can use it for any kind of script (I have data transformation scripts that
I run for my [personal project](http://github.com/ryanechternacht/witches-data) 
that all run in node. 

server.js is the file that node runs to build the server. You can see that it 
imports some libraries, sets some stuff up, then listens on a port. The reference
to env.PORT is so that when deployed to Azure, it listens to whatever port Azure
wants.

## 2. NPM

npm is the primary package manager used by Node. It also has some additional 
features for task scripting. 

To install a package (e.g. lodash), you'd do the following

    npm install lodash --save

The save flag tells it to add this entry to your package.json file (more on that 
later). 

Sometimes, if you're installing a package that isn't specific to a project, but a 
more general utility (e.g. Azure-cli), you'll use

    npm install -g azure-cli

The g flag tells npm to install it globally (vs. in this package)

Additionally, npm has some simple scripting ability. Most projects (including this 
one), are kicked off with 

    npm start

To understand what controls this, you'll need to open up package.json. In here, you
can see which scripts are configured and which packages npm will try to install. 



## 3. Angular

Angular is installed (via npm) and configured for this project. Look at js/app.js 
to checkout angular. Notice a few things

1. angular.module is how you create the angular project and load any necessary 
modules. 
2. angular.config is normally used for configuring high level routing. Here I am
configuring the state providers as well, but you should typically configure these
in separate files. Write some good, and we can fix the layout later. 
3. Notice you when you want to inject something, you write it as 

    angular.method('thing1', 'thing2', function(thing1, thing2) { ...})


## 4. Angular UI Router

Angular UI router is included in the project in the .module method, and injected
into a function with $stateProvider. A couple of things

1. .state configures a state. 
    1. url configures which url will be in the location bar.
    2. views configures which views should be inserted where (see below)
    3. templateUrl is which file should be loaded for the view
    4. controller lets you define a controller to inject code
2. index.html file has a few things worth noting as well
    1. ui-sref is how you send change the current page state
    2. the current loaded state is 'index'
    3. ui-view shows where the views are injected. 

## 5. Express

Express 

Express is a node.js server side framework. there is a test routes at 
localhost:3003/data/test that currently works. You can trace the express code
through server.js, express/routes.js, and express/demo.js. 

The module.exports is a format designed to work with node's require() method to 
give a clean way of modularizing code. 

## 6. Lodash

Lodash is the successor of Underscore.js, which is a great utility library for 
js. find more [here](https://lodash.com/).


## 7. Webpack

Webpack is a bundling tool designed to make pages load faster for users by 
combining all of the code we send to the client into a few files and compressing
those. While important, we can integrate this later.


