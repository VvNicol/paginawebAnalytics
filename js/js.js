//PARA VERIFICAR SI EXISTEN LOS ID
document.addEventListener("DOMContentLoaded", function() {

    //******************************PAGINA COMPRA**************************//

    //*BOTON FORMULARIO */
    // Verificar si el elemento "siguiente" existe antes de agregar el event listener
    var siguienteBtn = document.getElementById("siguiente");
    if (siguienteBtn) {
        siguienteBtn.addEventListener("click", function() {
            var nombre = document.getElementById("inputNombre").value.trim();
            var apellidos = document.getElementById("inputApellidos").value.trim();
            var direccion = document.getElementById("inputAddress").value.trim();
            var ciudad = document.getElementById("inputCity").value.trim();
            var cp = document.getElementById("inputZip").value.trim();
            var provincia = document.getElementById("inputState").value.trim();
            var aceptarTerminos = document.getElementById("aceptarTerminos").checked;

            if (nombre === "" || apellidos === "" || direccion === "" || ciudad === "" || cp === "" || provincia === "" || !aceptarTerminos) {
                alert("Por favor complete todos los campos requeridos (Nombre, Apellidos, Dirección, Ciudad, CP y Provincia) y acepte los términos y condiciones para proceder al pago.");
                return; // Detener la ejecución del código si falta algún campo o no se han aceptado los términos y condiciones
            }

            // Si todos los campos están completos y se han aceptado los términos y condiciones, continuar con la redirección
            window.location.href = "pago.html";
        });
    }

    /*BOTON BORRAR FORMULARIO*/
    var borrarBtn = document.getElementById("borrar");
    if (borrarBtn) {
        borrarBtn.addEventListener("click", function() {
            document.getElementById("inputNombre").value = "";
            document.getElementById("inputApellidos").value = "";
            document.getElementById("inputEmail4").value = "";
            document.getElementById("inputAddress").value = "";
            document.getElementById("inputAddress2").value = "";
            document.getElementById("inputState").value = "";
            document.getElementById("inputZip").value = "";
            document.getElementById("inputCity").value = "";
        });
    }

    //***********************PAGINA PAGO.HTML******************************//

    /*Agregar al carrito las compras de la tienda*/
    iniciarCarrito();

    function iniciarCarrito() {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        let total = carrito.reduce((acc, item) => acc + item.valor, 0);

        mostrarCarrito();

        const botonesCompra = document.querySelectorAll('.compra');
        botonesCompra.forEach(boton => {
            boton.addEventListener('click', () => {
                const valor = parseInt(boton.value);
                const titulo = boton.dataset.titulo;
                carrito.push({ titulo, valor });
                total += valor;
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarCarrito();
                alert("Se ha agregado al carrito");  // Mostrar alerta
            });
        });

        function mostrarCarrito() {
            const listaCarrito = document.getElementById('carrito');
            const totalElement = document.getElementById('total');
            let carritoHTML = "";

            if (listaCarrito && totalElement) { // Verificar que los elementos existan en la página antes de continuar
                carrito = JSON.parse(localStorage.getItem('carrito')) || []; // Recalcular el carrito
                total = carrito.reduce((acc, item) => acc + item.valor, 0); // Recalcular el total

                if (carrito.length > 0) {
                    carrito.forEach((item, index) => {
                        carritoHTML += `
                            <li class="list-group-item d-flex justify-content-between lh-condensed">
                                <div>
                                    <h6 class="my-0">${item.titulo}</h6>
                                </div>
                                <span class="text-muted">${item.valor} €</span>
                                <div>
                                    <button class="btn btn-sm btn-danger eliminar-item" data-indice="${index}">Eliminar</button>
                                    <button class="btn btn-sm btn-success agregar-item" data-indice="${index}">Agregar</button>
                                </div>
                            </li>
                        `;
                    });
                } else {
                    carritoHTML += "<p>No hay artículos en el carrito.</p>";
                }

                listaCarrito.innerHTML = carritoHTML;
                totalElement.textContent = `${total} €`;

                // Escuchar eventos de clic en los botones de eliminar
                const botonesEliminar = document.querySelectorAll('.eliminar-item');
                botonesEliminar.forEach(boton => {
                    boton.addEventListener('click', () => {
                        const indice = boton.dataset.indice;
                        // Restar el valor del artículo al total
                        total -= carrito[indice].valor;
                        // Eliminar el elemento correspondiente del carrito
                        carrito.splice(indice, 1);
                        // Actualizar el contenido del carrito en el almacenamiento local
                        localStorage.setItem('carrito', JSON.stringify(carrito));
                        // Volver a mostrar el carrito
                        mostrarCarrito();
                    });
                });

                // Escuchar eventos de clic en los botones de agregar
                const botonesAgregar = document.querySelectorAll('.agregar-item');
                botonesAgregar.forEach(boton => {
                    boton.addEventListener('click', () => {
                        const indice = boton.dataset.indice;
                        // Incrementar el total con el valor del artículo
                        total += carrito[indice].valor;
                        // Agregar el mismo artículo de nuevo al carrito
                        carrito.push(carrito[indice]);
                        // Actualizar el contenido del carrito en el almacenamiento local
                        localStorage.setItem('carrito', JSON.stringify(carrito));
                        // Volver a mostrar el carrito
                        mostrarCarrito();
                    });
                });
            }
        }

        /*Boton pago*/
        var pagoBtn = document.getElementById("pago");
        if (pagoBtn) {
            pagoBtn.addEventListener("click", function(event) {
                event.preventDefault();
                // Obtener los valores de los campos de entrada
                var numeroTarjeta = document.getElementById("numero_tarjeta").value;
                var mesVencimiento = document.getElementById("mes").value;
                var anoVencimiento = document.getElementById("ano").value;
                var cvv = document.getElementById("ccv").value;
                var nombreTarjeta = document.getElementById("nombre_tarjeta").value;

                // Expresión regular para verificar que solo se ingresen números
                var regexNumeros = /^\d+$/;
                // Variable para verificar si todas las condiciones se cumplen
                var validacionExitosa = true;

                // Verificación de las celdas
                if (!regexNumeros.test(numeroTarjeta) || numeroTarjeta.length !== 16) {
                    alert("El número de tarjeta debe contener solo números y tener 16 numeros.");
                    validacionExitosa = false;
                } else if (!regexNumeros.test(mesVencimiento) || parseInt(mesVencimiento) < 1 || parseInt(mesVencimiento) > 12) {
                    alert("El mes de vencimiento debe contener solo números y estar en el rango válido (01-12).");
                    validacionExitosa = false;
                } else if (!regexNumeros.test(anoVencimiento) || anoVencimiento.length !== 4) {
                    alert("El año de vencimiento debe contener solo números y tener 4 caracteres.");
                    validacionExitosa = false;
                } else if (!regexNumeros.test(cvv) || cvv.length !== 3) {
                    alert("El CVV debe contener solo números y tener exactamente 3 caracteres.");
                    validacionExitosa = false;
                } else if (nombreTarjeta.trim() === "") {
                    alert("Por favor, ingrese el nombre de la tarjeta.");
                    validacionExitosa = false;
                }

                // Verificar si la tarjeta está caducada
                var fechaActual = new Date();
                var mesActual = fechaActual.getMonth() + 1; // Se suma 1 porque los meses van de 0 a 11
                var anoActual = fechaActual.getFullYear();

                if (anoActual > parseInt(anoVencimiento) || (anoActual == parseInt(anoVencimiento) && mesActual > parseInt(mesVencimiento))) {
                    alert("La tarjeta está caducada. Por favor, introduzca una tarjeta válida.");
                    validacionExitosa = false;
                }

                // Si todas las verificaciones son exitosas
                if (validacionExitosa) {
                    // Limpiar el carrito
                    localStorage.removeItem('carrito');

                    // Vaciar los campos de entrada después de mostrar el mensaje de éxito
                    document.getElementById("numero_tarjeta").value = "";
                    document.getElementById("mes").value = "";
                    document.getElementById("ano").value = "";
                    document.getElementById("ccv").value = "";
                    document.getElementById("nombre_tarjeta").value = "";
                    
                    // Volver a mostrar el carrito vacío
                    mostrarCarrito();

                    alert("¡Pago procesado correctamente, se ha enviado un correo!");
                    
                    window.location.href = "pagoMensaje.html";
                }
            });
        }

        console.log("Validación exitosa:", validacionExitosa);

        //BOTON BORRAR CELDAS PAGO
        var cancelarBtn = document.getElementById("cancelar");
        if (cancelarBtn) {
            cancelarBtn.addEventListener("click", function() {
                document.getElementById("numero_tarjeta").value = "";
                document.getElementById("mes").value = "";
                document.getElementById("ano").value = "";
                document.getElementById("ccv").value = "";
                document.getElementById("nombre_tarjeta").value = "";
            });
        }
    }
});
