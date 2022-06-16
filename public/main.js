const socket =  io();

const crearProducto = () => {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const thumbnail = document.getElementById("thumbnail").value;

  const producto = {title, price, thumbnail}

  socket.emit("agregarProducto", producto);
  return false;
};

socket.on("leerProductos", (productos) => {
  if(productos.length > 0){
      document.getElementById("tbodyProductos").innerHTML = "";
      document.getElementById("divErrors").innerHTML = "";

      for(let i = 0; i < productos.length; i++){
          let producto = productos[i];
          let productoHTML = `
           <tr>
           	<td>${producto.title}</td>
           	<td>${producto.price}</td>
           	<td><img style="width: 50px; height:50px" src=${thumbnail} alt=""></td>
           </tr>
           `;
					document.getElementById("tbodyProductos").innerHTML += productoHTML;
        }
    }
})



const onMessage = () => {
  const mail = document.getElementById("mail").value;
  const message = document.getElementById("message").value;
  let date = new Date().toLocaleDateString();
  let time = new Date().toLocaleTimeString();

  const mensaje = { mail, message, date: date + " " + time };

  socket.emit("agregarMensaje", mensaje);
  return false;
};

socket.on("leerMensajes", (mensajes) => {
  if (mensajes.length > 0) {
    document.getElementById("messagesDiv").innerHTML = "";
    
    for (let i = 0; i < mensajes.length; i++) {
      let mensaje = mensajes[i];
      let mensajeHTML = `
      <p><spam><strong>${mensaje.mail}</strong> </spam>
      <spam class="date">${mensaje.date} </spam> :
      <spam class="message">${mensaje.message}</spam></p>
      `;
      document.getElementById("messagesDiv").innerHTML += mensajeHTML;
    }
  } else {
    document.getElementById("messagesDiv").innerHTML =
      "<h1>No hay Mensajes</h1>";
  }
});