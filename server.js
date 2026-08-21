const express = require("express");
const basicAuth = require("basic-auth");

const app = express();
const port = 3000;

// Middleware for HTTP Basic Authentication
const auth = (req, res, next) => {
    const user = basicAuth(req);

    if (user && user.name === "admin" && user.pass === "admin") {
        return next(); // Grant access
    }

    res.set("WWW-Authenticate", 'Basic realm="Restricted Area"');
    return res.status(401).send("Not authorized");
};

// Apply authentication middleware
app.use(auth);

// Serve static HTML page after authentication
app.use(express.static("public"));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
