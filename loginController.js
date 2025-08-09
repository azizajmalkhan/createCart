const jwt = require('jsonwebtoken');
const users = [{
    id: "1",
    username: "Mhesh",
    password: "mhesh",
    isAdmin: true
}, {
    id: "2", // Changed ID to make sure it's unique
    username: "hesh",
    password: "hesh",
    isAdmin: false
}];

// Middleware to verify JWT
const verifyUser = function (req, res, next) {
    const userToken = req.headers.authorization;
    if (userToken) {
        const token = userToken.split(" ")[1];
        jwt.verify(token, 'your-secret-key', function (err, user) {
            if (err) {
                return res.status(403).json({ err: "Token is not valid" });
            }
            req.user = user; // Assign the user to req.user after successful token verification
            next();
        });
    } else {
        res.status(401).json("You are not authenticated");
    }
}

// // POST route for login
// app.post('/api/login', (req, res) => {
let loginApi = function(req, res){
    //console.log(req);
    
    const { username, password } = req.body;
    const user = users.find(function (person) {
        return person.username === username && person.password === password;
    });

    if (user) {
        // Generate a JWT token here
        const token = jwt.sign({ id: user.id, username: user.username, isAdmin: user.isAdmin }, 'your-secret-key', { expiresIn: '1h' });
        res.json({ token, user }); // Sending token and user data in response
    } else {
        res.status(401).json("User credentials don't match");
    }
};








// Hello World @@22


// Extra Worls mm ss
module.exports = {
    loginApi:loginApi,
    verifyUser:verifyUser
}