const express = require('express');
let books = require("./booksdb.js"); // here we do not have to specify what we are importing because in the file "booksdb" there is just one export and corresponds to "books" object.
let isValid = require("./auth_users.js").isValid; // from the file "auth_user" we are importing the function "isValid" and stored it in "isValid"
let users = require("./auth_users.js").users; // from the file "auth_user" we are importing the "users" array and store it in "users"
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      // Add user to the users array
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const get_books = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify({books}, null, 4)));
  });

  get_books.then(() => console.log("Promise for Task 10 resolved"));

});
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const get_books_isbn = new Promise((resolve, reject) => {
    resolve(res.send(books[isbn]));
  });

  get_books_isbn.then(() => console.log("Promise for Task 11 resolved")); // this will send a message in the terminal

});


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let booksbyauthor = [];
  let isbns = Object.keys(books);

  const get_book_author = new Promise((resolve,reject) => {
    resolve(isbns.forEach((isbn) => {
    if(books[isbn]["author"] === req.params.author) {
      booksbyauthor.push({"isbn":isbn,
                          "title":books[isbn]["title"],
                          "reviews":books[isbn]["reviews"]});
    }
    
    }));
    res.send(JSON.stringify({booksbyauthor}, null, 4));
  });
  get_books_author.then(() => console.log("Promise for Task 12 resolved"));

  
});

// Get all books based on title
/**Add the code for getting the book details based on Title (done in Task 4) using Promise callbacks or async-await with Axios */
public_users.get('/title/:title',function (req, res) {
  const get_book_title=new Promise((resolve,reject) => {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      }
    });
    res.send(JSON.stringify({booksbytitle}, null, 4));

  })

  get_book_title.then(() => console.log("Promise for Task 13 resolved"))
 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let book_review = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["reviews"] === req.params.reviews) {
      book_review.push({"isbn":isbn,
                          "reviews":books[isbn]["reviews"]});
    }
  });
  res.send(JSON.stringify({book_review}, null, 4));
});

module.exports.general = public_users; 