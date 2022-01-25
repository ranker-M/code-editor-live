const dotenv = require('dotenv');
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
dotenv.config();
// start express app
const PORT = process.env.PORT || 3001;
const app = express();
const path = require('path');

// connect to mongodb
const mongoDB_URI = process.env.MONGODB_URI;
mongoose.connect(mongoDB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then((result) => {
    console.log("Connected to mongo database");

    // listen for request after connecting database
    app.listen(PORT, () => {
        console.log(`Server listening on ${PORT}`);
    });
})
    .catch((err) => { console.log("Could not connected to server:", err); })

//middleware
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, './client/build')));

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

//routes
app.get("/get-one-project/:username/:projectId", (req, res) => {
    console.log("One project request for:", req.params);
    User.findOne({ username: req.params.username })
        .then((result) => {
            if (result == null) throw "Project couldn't find";
            else res.send(result.projects.filter(project => project._id == req.params.projectId));
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
})

app.get("/all-projects/:username", (req, res) => {
    console.log("All project request for:", req.params);
    User.findOne({ username: req.params.username })
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
});

app.get("/add-user/:username", (req, res) => {
    console.log("Add user request:", req.params.username);
    const user = new User({
        username: req.params.username,
        projects: []
    });

    user.save()
        .then((result) => {
            res.send(result);
            console.log("User added to database");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err.message);
        });
});

app.post("/add-project", (req, res) => {
    console.log("Add new project request for:", req.body);
    const project = {
        projectName: req.body.projectName,
        language: req.body.language,
        text: req.body.code
    };

    User.findOne({ username: req.body.username })
        .then(user => {
            if (user.projects.filter(el => el.projectName == project.projectName).length != 0) { throw "Project names must be unique!" }
            else {
                user.projects.push(project);
                user.save()
                    .then((result) => {
                        // console.log(project._id);
                        let saved = user.projects.filter(el => el.projectName == project.projectName)[0];
                        res.send(saved);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).send(err);
                    });
            }
        }).catch(err => {
            console.log(err);
            res.status(400).send(err);
        })
});

app.delete("/delete-project", (req, res) => {
    console.log("Delete project request for:", req.body);
    //  Find the user from database
    User.findOne({ username: req.body.username })
        .then(result => {
            // Remove Project from array
            let filter = result.projects.filter(el => el.projectName != req.body.projectName);
            // Check if project exist otherwise throw error
            if (result.projects.length == filter.length) { throw "There is no project named '" + req.body.projectName + "'"; }
            // Save new project array to db
            result.projects = filter;
            result.save()
                .then(() => {
                    console.log("Project deleted");
                    res.send("Project deleted");
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).send(err);
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});

app.put("/update-projectText/:username/:projectId", (req, res) => {
    console.log("Update project text request for:", req.params, req.body);
    User.updateOne({ username: req.params.username, "projects._id": req.params.projectId },
        {
            $set: {
                "projects.$.text": req.body.text,
                "projects.$.language": req.body.language
            }
        }
    ).then(result => {
        console.log("Project text updated");
        res.send("Project text updated");
    }).catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
});

app.put("/update-projectName/:username/:projectId", (req, res) => {
    console.log("Update projectName request for:", req.params, req.body);
    User.findOne(
        {
            $and: [{ username: req.params.username },
            { "projects._id": req.body.projectId }
            ]
        })
        .then(result => {
            // console.log(result);
            if (result != null) {
                console.log("Request failed: There is already a project named " + req.body.projectName);
                res.status(400).send("There is already a project named " + req.body.projectName);
            }
            else User.updateOne({ username: req.params.username, "projects._id": req.params.projectId },
                {
                    $set: {
                        "projects.$.projectName": req.body.projectName
                    }
                }
            ).then(result => {
                console.log("Project name updated");
                res.send("Project name updated");
            }).catch(err => {
                // console.log(err);
                res.status(500).send(err);
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(500).send(err);
        });
});

// compiler 
var request = require('request');

// define access parameters
var accessToken = process.env.SPHERE_ENGINE_ACCESS_TOKEN;
var endpoint = process.env.SPHERE_ENGINE_ENDPOINT;

const compilers = {
    cpp: {
        id: 1,
        name: 'C++ [GCC]',
        short: 'C++',
    },
    html: "",
    java: {
        id: 55,
        name: 'Java - legacy',
        short: 'JAVA7',
    },
    javascript: {
        id: 35,
        name: 'JavaScript [Rhino]',
        short: 'Rhino',
    },
    php: {
        id: 29,
        name: 'PHP',
        short: 'PHP',
    },
    python: {
        id: 116,
        name: 'Python 3.x',
        short: 'PYTH3',
    },
    rust: {
        id: 93,
        name: 'Rust',
        short: 'rust',
    },
    "sql-schema": {
        id: 40,
        name: 'SQLite - schema',
        short: 'SQLITE3',
    }, "sql-queries": {
        id: 52,
        name: 'SQLite - queries',
        short: '',
    },
    typescript: {
        id: 57,
        name: 'TypeScript',
        short: 'TCS',
    },
}


app.post("/compile-project", (req, responseClient) => {
    console.log("Compile project(plain) request for:", req.body);
    let project = req.body.project;
    // console.log("Result:", project, "compiler:", compilers[project.language])
    //Compile request(submission) so sphere engine
    // define request parameters
    var submissionData = {
        compilerId: compilers[project.language].id,
        source: project.text,
        input: req.body.input
    };

    // send request
    request({
        url: 'https://' + endpoint + '/api/v4/submissions?access_token=' + accessToken,
        method: 'POST',
        form: submissionData
    }, function (error, response, body) {

        if (error) {
            console.log('Connection problem');
            throw ('Connection problem');
        }

        // process response
        if (response) {
            if (response.statusCode === 201) {
                let responseObj = JSON.parse(response.body);
                // console.log("Submission created:", responseObj); // submission data in JSON

                // Fetch submission result

                // define request parameters
                var submissionId = responseObj.id;
                // regularly check status until compiler is done
                let interval = setInterval(() => {
                    // send request
                    request({
                        url: 'https://' + endpoint + '/api/v4/submissions/' + submissionId + '?access_token=' + accessToken,
                        method: 'GET'
                    }, function (error, response, body) {

                        if (error) {
                            console.log('Connection problem');
                            throw ('Connection problem');
                        }

                        // process response
                        if (response) {
                            if (response.statusCode === 200) {
                                let submission = JSON.parse(response.body);
                                // if (submission.executing) console.log("Submission status:", submission); // submission data in JSON
                                if (!submission.executing) {
                                    // console.log("Compiler result:", submission);
                                    // console.log("source:", submission.result.streams.source)
                                    // console.log("output:", submission.result.streams.output)
                                    clearInterval(interval);
                                    interval = null;
                                    console.log("Time:", submission.result.time);
                                    let uri = submission.result.streams.output?.uri;
                                    if (submission.result.status.code === 11) {
                                        request(submission.result.streams.cmpinfo.uri, (err, res, body) => {
                                            if (err) console.log(err);
                                            console.log("Compilation error:", body);
                                            let obj = { time: submission.result.time, output: submission.result.status.name + "\n" + body }
                                            responseClient.send(JSON.stringify(obj));
                                        });
                                    }
                                    else if (submission.result.status.code !== 15) {
                                        request(submission.result.streams.error.uri, (err, res, body) => {
                                            if (err) console.log(err);
                                            console.log("Error:", body);
                                            let obj = { time: submission.result.time, output: submission.result.status.name + "\n" + body }
                                            responseClient.send(JSON.stringify(obj));
                                        });
                                    }
                                    else if (uri) request(uri, (err, res, body) => {
                                        if (err) console.log(err);
                                        console.log("Output:", body);
                                        let obj = { time: submission.result.time, output: body }
                                        responseClient.send(JSON.stringify(obj));
                                    });

                                    else {
                                        let obj = { time: submission.result.time, output: "No output" }
                                        responseClient.send(JSON.stringify(obj));
                                    }
                                }
                            } else {
                                if (response.statusCode === 401) {
                                    console.log('Invalid access token');
                                    throw ('Invalid access token');
                                }
                                if (response.statusCode === 403) {
                                    console.log('Access denied');
                                    throw ('Access denied');
                                }
                                if (response.statusCode === 404) {
                                    console.log('Submision not found');
                                    throw ('Submision not found');
                                }
                            }
                        }
                    });
                }, 500);

            } else {
                if (response.statusCode === 401) {
                    console.log('Invalid access token');
                    throw ('Invalid access token');
                } else if (response.statusCode === 402) {
                    console.log('Unable to create submission');
                    throw ('Unable to create submission');
                } else if (response.statusCode === 400) {
                    var body = JSON.parse(response.body);
                    console.log('Error code: ' + body.error_code + ', details available in the message: ' + body.message)
                    throw ('Error code: ' + body.error_code + ', details available in the message: ' + body.message)
                }
            }
        }
    });

});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});