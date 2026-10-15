
const pedidosIniciales = [
    { id: 1, cliente: "Anahi Perez", modelo: "Snoopy", cantidad: 1, estado: "Pendiente" },
    { id: 2, cliente: "Jose Gonzales", modelo: "Corazones", cantidad: 2, estado: "En producción" }
];

let pedidos = [];


function guardarPedidosEnStorage() {
    localStorage.setItem("pedidosLlaveros", JSON.stringify(pedidos));
}


const contenedorPedidos = document.getElementById('contenedor-pedidos');
const datosPedidos = document.getElementById('formulario-pedido');
const inputBusqueda = document.getElementById("input-busqueda");
const botonTema = document.getElementById("btn-tema");
const mensajeFeedback = document.getElementById('mensaje-feedback');


function mostrarFeedback(texto, tipo) {
    mensajeFeedback.textContent = texto;
    mensajeFeedback.className = `mensaje-feedback ${tipo}`;

    setTimeout(() => {
        mensajeFeedback.className = 'mensaje-feedback';
        mensajeFeedback.textContent = '';
    }, 3000);
}


function renderizarPedidos(lista) {
    contenedorPedidos.innerHTML = "";

    lista.forEach(pedido => {
        const { id, cliente, modelo, cantidad, estado } = pedido;

        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-pedido');

        tarjeta.innerHTML = `
            <h3>Cliente: ${cliente}</h3>
            <p>Modelo: ${modelo}</p>
            <p>Cantidad: ${cantidad}</p>
            <p>
                Estado:
                <select class="select-estado">
                    <option value="Pendiente" ${estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
                    <option value="En producción" ${estado === "En producción" ? "selected" : ""}>En producción</option>
                    <option value="Listo para entrega" ${estado === "Listo para entrega" ? "selected" : ""}>Listo para entrega</option>
                    <option value="Entregado" ${estado === "Entregado" ? "selected" : ""}>Entregado</option>
                </select>
            </p>
            <button class="btn-eliminar">Eliminar</button>
        `;

        
        const botonEliminar = tarjeta.querySelector(".btn-eliminar");
        botonEliminar.addEventListener("click", () => {
            pedidos = pedidos.filter(item => item.id !== id);
            guardarPedidosEnStorage();
            renderizarPedidos(pedidos);
            mostrarFeedback(`Pedido de ${cliente} eliminado.`, 'eliminado');
        });

        
        const selectEstado = tarjeta.querySelector(".select-estado");
        selectEstado.addEventListener("change", (e) => {
            pedido.estado = e.target.value;
            guardarPedidosEnStorage();
        });

        contenedorPedidos.appendChild(tarjeta);
    });
}


try {
    const pedidosGuardados = localStorage.getItem("pedidosLlaveros");
    pedidos = pedidosGuardados ? JSON.parse(pedidosGuardados) : pedidosIniciales;
} catch (error) {
    console.error("Error al procesar los datos de localStorage:", error);
    pedidos = pedidosIniciales;
    mostrarFeedback("Hubo un problema al cargar los pedidos guardados. Se cargó la lista inicial.", "eliminado");
} finally {
    
    renderizarPedidos(pedidos);
}


datosPedidos.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombreCliente = document.getElementById("input-cliente").value;
    const modeloLlavero = document.getElementById("input-modelo").value;
    const cantidadLlavero = Number(document.getElementById("input-cantidad").value);

    const nuevoPedido = {
        id: Date.now(),
        cliente: nombreCliente,
        modelo: modeloLlavero,
        cantidad: cantidadLlavero,
        estado: "Pendiente"
    };

    pedidos.push(nuevoPedido);
    guardarPedidosEnStorage();
    renderizarPedidos(pedidos);
    datosPedidos.reset();

    mostrarFeedback(`¡Pedido de ${nombreCliente} agregado con éxito!`, 'exito');
});


inputBusqueda.addEventListener("input", (e) => {
    const termino = e.target.value.toLowerCase();
    
    const pedidosFiltrados = pedidos.filter(pedido => 
        pedido.cliente.toLowerCase().includes(termino) ||
        pedido.modelo.toLowerCase().includes(termino)
    );
    
    renderizarPedidos(pedidosFiltrados);
});


const temaGuardado = localStorage.getItem("tema");
if (temaGuardado === "dark") {
    document.body.classList.add("dark-mode");
    botonTema.textContent = "☀️ Modo Claro";
}

botonTema.addEventListener("click", () => {
    const esModoOscuro = document.body.classList.toggle("dark-mode");
    botonTema.textContent = esModoOscuro ? "☀️ Modo Claro" : "🌙 Modo Oscuro";
    localStorage.setItem("tema", esModoOscuro ? "dark" : "light");
});


setTimeout(() => {
    mostrarFeedback(" ¡Promo activa! 10% de descuento en pedidos de más de 5 llaveros.", "exito");
}, 2500);
