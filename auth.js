const jwt = require("jsonwebtoken");
const secret = "kitra-api";

// JSON Web Tokens
// JWT is a way of securely passing information from the server to the frontend or to other parts of the server

// Token creation

module.exports.createAccessToken = (user) => {
  // Data from the user will be recieved through forms/req.body
  // When the user logs in, a TOKEN will be created with the user's information

  const data = {
    id: user._id,
    email: user.email,
  };
  return jwt.sign(data, secret, {});
};

module.exports.verify = (req, res, next) => {
  console.log("This is from req.headers.authorization");
  console.log(req.headers.authorization);
  let token = req.headers.authorization;

  if (typeof token === "undefined") {
    return res.send({ auth: "Failed. No token" });
  } else {
    /*
              slice() is a method which can be used on strings and arrays\
              slice(<startingPosition>, <endPosition>)
  
              Bearer dasdasdfs123sfaa
  
              "Peter"
              slice(3, string.length)
              "er"
          */

    console.log("With bearer prefix");
    console.log(token);
    token = token.slice(7, token.length);
    console.log("No bearer prefix");
    console.log(token);

    // Token decryption
    /*
              Open the gift and get the content
          */

    jwt.verify(token, secret, function (err, decodedToken) {
      // Validate the token using the verify method decrypting the token using the secret code
      // err will contain the error from decoding your token. This will contain the reason why we will reject the token

      console.log("data that will be assigned to the req.user");
      console.log(decodedToken);

      req.user = decodedToken;
      next();
      // middleware function
      // next() will let us proceed to the next middleware OR controller
    });
  }
};
