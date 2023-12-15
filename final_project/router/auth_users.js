const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // this an array to store the users.

// Function to check if a user with a given username exists
const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid
let usersWithSameName = users.filter((user) => {
  return user.username === username;
});
if (usersWithSameName.length > 0){
  return true;
}else {
  return false;
}
}

/* esta funcion chequea si un usuario esta registrado, si el "username" y "password" se encuentra en el array
o en otro caso en la base de datos entonces retorna un valor "true" de lo contrario "false"
*/
const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login usamos el enrutador de usuarios registrados "regd_users", porque 
// el enrutador de usuarios publicos "public_users" es solo para usuarios que se quieren registrar. 
regd_users.post("/login", (req, res) => { 
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign( //  si el usuario esta registrado, se le asigna un token. que lleva el password y expira en una hora
          {
              data: password,
          },
          "access",
          { expiresIn: 60 * 60 }
      );

      req.session.authorization = { // esto crea un objeto que se guarda para la sesion en curso, el objeto de autorizacion json lleva el token("access","password") y el usuario "user".
          accessToken,
          username,
      
      };
      return res.status(200).send("User successfully logged in");
  } else {
      return res
          .status(208)
          .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
//Complete the code for adding or modifying a book review. Hint: You have to give a review as a request query & it must get posted with the username (stored in the session) posted.
// If the same user posts a different review on the same ISBN, it should modify the existing review. If another user logs in and posts a review on the same ISBN, it will get added as
// a different review under the same ISBN.
regd_users.put("/auth/review/:isbn", (req, res) => {
const isbn = req.params.isbn;
  let filtered_book = books[isbn]
  if (filtered_book) {
      let review = req.query.review; // este es el review que esta en el archivo  "booksdb.js"
      let reviewer = req.session.authorization['username']; // el objeto autorizacion tiene "token" y "username" aqui estamos retornado el usuario de la session.
      if(review) {
          filtered_book['reviews'][reviewer] = review; /*obser that reviews has the '' indicating it is an existing property of "filtered_books"
          *filtered_book['reviews'][reviewer] = review;: If the condition in the if statement is true, this line of code is executed. 
          It accesses the filtered_book object and assigns the value of review to a property inside the nested reviews object.
           The property name is determined by the value stored in the variable reviewer. */
          books[isbn] = filtered_book;
      }
      res.send(`The review for the book with ISBN  ${isbn} has been added/updated.`);
  }
  else{
      res.send("Unable to find this ISBN!");
  }
});


/**Hint: Filter & delete the reviews based on the session username, so that a user can delete only his/her reviews and not other users’. */
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
    let filtered_book = books[isbn]
    let reviewer=req.session.authorization['username']
    if (filtered_book) {
      delete filtered_book.reviews[reviewer];
      return res.status(200).json(filtered_book);
  }
  return res.status(404).json({ message: "Invalid ISBN" });
});


module.exports.authenticated = regd_users; // "check the file index.js" to understand this part of the code
module.exports.isValid = isValid; // this export is to made the function available in other files.
module.exports.users = users; // this export is to make the array "users" available in other files that are useful for this code.
