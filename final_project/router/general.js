const express   = require('express');
let books       = require("./booksdb.js");
let isValid     = require("./auth_users.js").isValid;
let users       = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {

  const username = req.body.username;

  const password = req.body.password;

  if (username && password) {

    if (!doesExist(username)) {
      
      users.push({"username":username,"password":password});

      return res.status(200).json({message: "User successfully registred. Now you can login"});

    } else {

      return res.status(404).json({message: "User already exists!"});

    }
  }

  return res.status(404).json({message: "Unable to register user."});
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  return res.status(300).json({message: "OK", books:books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  const isbn = req.params.isbn;

  let theBook = null;
  //iterate through the books object

  for (let book in books) {
      
      if (books[book].isbn == isbn) {

        theBook = books[book];

        break;

      }
  }

  if (theBook == null) 
    return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  else 
    return res.status(200).json({message: `GET isbn ${isbn}`, book: theBook});

 });

 // Get book details based on ISBN
public_users.get('/test/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "GET TEST"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  const author = req.params.author;

  let theBook = null;

  for (let book in books) {
        
        if (books[book].author == author) {
  
          theBook = books[book];
  
          break;
  
        }
    }

    if (theBook == null)
      return res.status(404).json({message: `Book with author ${author} not found`});
    else 
      return res.status(200).json({message: `GET author ${author}`, book: theBook});

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  const title = req.params.title;

  let theBook = null;

  for (let book in books) {
        
        if (books[book].title == title) {
  
          theBook = books[book];
  
          break;
  
        }
    }

    if (theBook == null)
      return res.status(404).json({message: `Book with title ${title} not found`});
    else 
      return res.status(200).json({message: `GET title ${title}`, book: theBook});

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  const isbn = req.params.isbn;

  let theBook = null;

  for (let book in books) {
        
        if (books[book].isbn == isbn) {
  
          theBook = books[book];
  
          break;
  
        }
    }

    if (theBook == null)
      return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
    else 
      return res.status(200).json({message: `GET review ${isbn}`, book: theBook.reviews});


});

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

module.exports.general = public_users;
