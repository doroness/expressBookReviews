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

  let getBooksPromise = new Promise((resolve, reject) => {

    if (books) 
      resolve(books);
    else 
      reject("No books available");

  });

  getBooksPromise.then((books) => {

    return res.status(300).json({message: "OK", books:books});  

  });
  
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    let GetBookByISBN = new Promise((resolve, reject) => {

      const isbn = req.params.isbn;

      let theBook = null;

      for (let book in books) {
        
        if (books[book].isbn == isbn) {
  
          theBook = books[book];
  
          break;
  
        }
      }

      if (theBook == null)
        reject(`Book with ISBN ${isbn} not found`);
      else 
        resolve(theBook);

    });

    GetBookByISBN.then((book) => {

      return res.status(200).json({message: `GET ISBN ${book.isbn}`, book: book});

    }).catch((error) => {

      return res.status(404).json({message: error});

    });

 });

 // Get book details based on ISBN
public_users.get('/test/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "GET TEST"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  let GetBookByAuthor = new Promise((resolve, reject) => {

    const author = req.params.author;

    let theBook = null;

    for (let book in books) {
        
      if (books[book].author == author) {

        theBook = books[book];

        break;

      }
    }

    if (theBook == null)
      reject(`Book with author ${author} not found`);
    else 
      resolve(theBook);

  });

  GetBookByAuthor.then((book) => {
    
    return res.status(200).json({message: `GET author ${book.author}`, book: book});
  
    }).catch((error) => {

    return res.status(404).json({message: error});
  
  });

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  let GetBookByTtile = new Promise((resolve, reject) => {

    const title = req.params.title;

    let theBook = null;

    for (let book in books) {
        
      if (books[book].title == title) {

        theBook = books[book];

        break;

      }
    }

    if (theBook == null)
      reject(`Book with title ${title} not found`);
    else 
      resolve(theBook);

  });

  GetBookByTtile.then((book) => {
      
      return res.status(200).json({message: `GET title ${book.title}`, book: book});
    
      }
    ).catch((error) => {

      return res.status(404).json({message: error});
    
    });


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
