# About
This application is Model-Controller based RESTful server, which serves the function of tasker backend.


# Routing
HTTP request -> requestVerifier.js -> bodyParser (JSON) -> sessionRegister.js -> policy -> controller

When HTTP request arrives, server lookups routes defined in routes.json
First thing that is being checked is HTTP method. If there is a defined route
for specific path and method then it's being passed to requestVerifier.js
which takes care of HTTP headers.

It's then being passed to express JSON body parser which transform request body
into JavaScript object and assigns it to req.body

sessionRegister.js, which is the next step, checks if client sent token, if yes
then appropiate session object is being assigned to req.session

The next step is policy defined in routes.json. Server lookups if there is already
such policy defined in policies.json, if yes, then the request is being redirected to
appropapiate .js file in policies.
Policy is basically a function that decides if request should be passed to controller
or blocked.

If request is successfully verified by policy, it's then being passed to
appropiate controller specified in routes.json which takes care of the request.



# DB models

# Sessions handling

# Initialization
