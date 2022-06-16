const express = require("express");

const { engine} = require("express-handlebars");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8080;

const {Server:  HttpServer} = require("http");
const {Server: IoServer} = require("socket.io");
const httpServer = new HttpServer(app);
const ioSocket = new IoServer(httpServer);

//BD
const  knexSqlite3  = require("./db/dbConfigSqlLite");
const knexMysql = require("./db/dbCongifMDB");

//CONTENEDOR
const Contenedor = require("./model/Contenedor");
const contenedorProductos = new Contenedor(knexMysql, "productos");
const contenedorMensajes = new Contenedor(knexSqlite3, "mensajes");


//Midlleware
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


//App Views
app.engine(
    "hbs",
    engine({
        extname:"hbs",
        defaultLayout:"main",
        layoutsDir: __dirname + "/views/layouts", ///Posiblee barra si no anda
        partialsDir: __dirname + "/views/partials"
    })
);

app.set("view engine", "hbs");
app.set("views", "./views");

app.get("/", (req, res)=>{
    res.redirect("/api/productos");
});

app.get("/api/productos", (req, res)=>{
    res.render("formProducts")
});

//--------SOKETS-------------
ioSocket.on("connection", async (socket) =>{
    console.log("New cliente connected");
   
    socket.emit("leerProductos", await contenedorProductos.getAll());
    socket.emit("leerMensajes", await contenedorMensajes.getAll());

    //Prodcutos 
    socket.on("agregarProducto", async (producto) =>{
        const idProducto = await contenedorProductos.save(producto);
        console.log(idProducto)
        if(idProducto) ioSocket.sockets.emit("leerProductos", await contenedorProductos.getAll());
    })

    //Chat
    socket.on("agregarMensaje", async (mensaje)=> {
        const idMensaje = await contenedorMensajes.save(mensaje);
        if(idMensaje) ioSocket.sockets.emit("leerMensajes", await contenedorMensajes.getAll());
        
    })
})


httpServer.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});

