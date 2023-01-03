const socket = io();

// Envia mensajes al backend

function enviarMsg() {
    const emailId = document.getElementById("email-id").value;
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const edad = document.getElementById("edad").value;
    const alias = document.getElementById("alias").value

    const avatar = document.getElementById("avatar").value;
    const msgParaEnvio = document.getElementById("inputMsg").value;
    const userData = {
        id: emailId,
        nombre: nombre,
        apellido: apellido,
        edad: edad,
        alias: alias,
        avatar: avatar,
        text: msgParaEnvio,
    }
    console.log(userData);
    socket.emit("msg", userData); /* AQUI TE QUEDASTE  */
    return false;
}

// Recibe mensajes del back y los renderiza en el DOM

socket.on("msg-list", (data) => {
    console.log(`msg-list: ${data}`);
    let html = '';
    data.forEach(item => {
        html +=
            `
        <div class="msj-container" >
        <p class="p-email">${item.timestamp} ${item.email} dice: <br> <span> ${item.mensaje}</span> </p>
        </div> 
        `
    })
    document.getElementById("mgs-area").innerHTML = html;

});


// Funcion para enviar productos el backend

/* function postProducto() {
    const numeroDeProductos = document.getElementById("numeroDeProductos").value;
    socket.emit("numeroDeProductos", numeroDeProductos);
    return false;
} */

// Recibe productos del back y los renderiza en el DOM

socket.on("product-list", (data) => {
    /* console.log("product-list:" + data); */
    let html = '';
    data.forEach(item => {
        html +=
            `
        <div class="products-card">
            <img src="${item.thumbnail}" class="product-img"/>
            <p>Producto: ${item.title}</p>
            <p>Precio: $ ${item.price}</p>
        </div>
        `
    })
    document.getElementById("productsContainer").innerHTML = html;

});

// Previene la recarga de la pagina onSubmit del form

document.getElementById("myAnchor").addEventListener("click", function (event) {
    event.preventDefault()
});



