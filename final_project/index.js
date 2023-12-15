const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// esto escuchad las peticiones de objetos json
app.use(express.json());

// esto crea un objeto secreto para cada sesion en la ruta /customer. si un cliente se quiere logear 
// va a utilizar una sesion obligatoria
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

//cuando 
app.use("/customer/auth/*", function auth(req,res,next){

    if (req.session.authorization) { //si el objeto de autorizacion existe entonces, toma el token de este objeto.
        // Get the authorization object stored in the session
        token = req.session.authorization['accessToken'];
        // Retrieve the token from the authorization object
        jwt.verify(token, "access", (err, user) => { // esto verifica que el token asignado a un usuario, y el tiempo de acceso se cumplen.
          // Use JWT to verify the token
          if (!err) {
            req.user = user;
            next();
          } else {
            return res.status(403).json({ message: "User not authenticated" });
          }
        });
      } else {
        return res.status(403).json({ message: "User not logged in" });
      }
    });
 
const PORT =5000;

app.use("/customer", customer_routes); // para las peticiones de  "/customer" va a utilizar el archivo "/router/auth_users"
app.use("/", genl_routes); // este va a ser el url  que va  a utilizar por defecto y luego en el archivo "se ven los complementos de las url"

app.listen(PORT,()=>console.log("Server is running"));
