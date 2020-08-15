# EBANX Take-Home Coding Assignment
This project is my solution to EBANX's take home assignment for their Software Developer Role. **_It is an app that was created to PASS ALL TEST requirements as given in the coding instructions._**

# Tech/Languages
* TypeScript
* JavaScript
* Node.js
* ExpressJS
* PostgreSQL
* Mocha, Expect, and SuperTest for BDD Testing

# Features
The simplest description for this project is that it's **an ExpressJS application written with TypeScript (but tests were written in JavaScript)**. Upon compilation, the app can be started and tested without deployment using ngrok

# Directory Structure
2 key directories exist for this project. They are:
* test
* engine

The **test** directory holds all test files and will be the target folder when testing with Mocha.

The **engine** directory contains the folder structure for the project, as well as all files that do not deal with base configuration. It contains 4 folders:
* **schema**: This holds all SQL queries. For this project, only one file exists which is _tables.sql_. This file holds the query for creating the basic account table needed for the app
* **query-helpers**: This folder holds all the logic regarding PostgreSQL setup and query functions. This abstraction ensures that manipulation of query behaviour can be done independent of other parts of the app. It contains one file for this project - _queries.ts_
* **controller**: This directory is to hold separate sub-folders for individual business modules in the app. As an example, the _event-controller_ subfolder was created here which hosts the files _event.controller.ts_ and _event.router.ts_
* **routers**: This holds the file _all-routers.ts_. This file is a where all module-specific routes defined in the controller are grouped appropriately before being connected to the entry point of the app.
The engine folder also holds _server.ts_ which is the entry point of the application.

# Getting Started
Ensure the following on your computer before starting the application:
* Git
* Node v10 or greater
* PostgresSQL database defined as a string in the format: postgresql://<username>:<password>@<host>:<port>/<database name>
* account table has been created in your PostgreSQL database using the query in tables.sql
 * ngrok installed
 
 
 # Installation
 1. `git clone https://github.com/jiobiagba/dev-assignment-ebanx.git`
 2. `cd dev-assignment-ebanx`
 3. `npm install`
 4. `npm run test` (to ensure all endpoints are working fine)
 5. `npm run dev` (A console message should show after this saying app is running on port 3002
 6. While app is still on, open a new terminal and run `ngrok http 3002`. The URL to test on IpKiss can then be extracted to test live accordingly


