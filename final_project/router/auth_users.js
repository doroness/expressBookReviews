const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
	{username:'doron',password:'1234'},
	{username:'user2',password:'password2'},
];

module.exports = users;

const isValid = (username)=>{ //returns boolean
  //username is only letters and numbers anf is in the users array
}

const authenticatedUser = (username,password)=>{
  
	let validusers = users.filter((user)=> {

	  return (user.username === username && user.password === password)

	});

	if(validusers.length > 0)
	  return true;

	 else 
	  return false;
	
 }

//only registered users can login
regd_users.post("/login", (req,res) => {

  const username = req.body.username;

  const password = req.body.password;

  if (!username || !password) 
      return res.status(404).json({message: "Error logging in"});
  
 if (authenticatedUser(username,password)) {

    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: '1h' });

    req.session.authorization = { accessToken,username};

    return res.status(200).send("User successfully logged in");

  } else 
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
 
  //get the isbn from the request
  const isbn = req.params.isbn;

  //get the review from the request
  const review = req.body.review;

  //get the current user from the request
  const user = req.session.authorization.username;

  //check if the book exists
  let theBook = null;

  for (let book in books) {
        
        if (books[book].isbn == isbn) {
  
          theBook = books[book];
  
          break;
  
        }
    }

    if (theBook == null)
      return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
    else {
      theBook.reviews[user] = review;
      return res.status(200).json({message: `PUT review ${isbn}`, book: theBook});
    }

});

//Delete a book review from the user
regd_users.delete("/auth/review/:isbn", (req, res) => {

  //get the isbn from the request
  const isbn = req.params.isbn;

  //get the current user from the request
  const user = req.session.authorization.username;

  //check if the book exists
  let theBook = null;

  for (let book in books) {
        
        if (books[book].isbn == isbn) {
  
          theBook = books[book];
  
          break;
  
        }
    }

    if (theBook == null)
      return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
    else {
      delete theBook.reviews[user];
      return res.status(200).json({message: `DELETE review ${isbn}`, book: theBook});
    }


});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
module.exports.isValid = isValid;
