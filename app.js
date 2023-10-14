
// detalles de producto
class Producto {
  constructor(id, nombre, precio, categoria, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.imagen = imagen;
  }
}

// Base de datos
class BaseDeDatos {
  constructor() {
    this.productos = [];
    this.agregarRegistro(1, "Code 502", 400, "Claro", "a.jpg");
    this.agregarRegistro(2, "Code 505", 600, "Color", "b.jpg");
    this.agregarRegistro(3, "Code 103", 400, "Oscuro", "c.jpg");
    this.agregarRegistro(4, "Code 401", 400, "Oscuro", "d.jpg");
    this.agregarRegistro(5, "Code 102", 600, "Color", "j.jpg");
    this.agregarRegistro(6, "Code 302", 600, "Color", "i.jpg");
  }

  agregarRegistro(id, nombre, precio, categoria, imagen) {
    const producto = new Producto(id, nombre, precio, categoria, imagen);
    this.productos.push(producto);
  }
  
  traerRegistros() {
    return this.productos;
  }
 
  registroPorId(id) {
    return this.productos.find((producto) => producto.id === id);
  }
  
  // filtro para buscar
  registrosPorNombre(palabra) {
    return this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(palabra.toLowerCase())
    );
  }
}

//carrito de compras
class Carrito {
  constructor() {
    const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
    this.carrito = carritoStorage || [];
    this.total = 0; 
    this.cantidadProductos = 0; 
    this.listar();
  }

  estaEnCarrito({ id }) {
    return this.carrito.find((producto) => producto.id === id);
  }

  agregar(producto) {
    const productoEnCarrito = this.estaEnCarrito(producto);
    if (!productoEnCarrito) {
      this.carrito.push({ ...producto, cantidad: 1 });
      document.querySelector("section").classList.remove("ocultar");  
   } else {
      productoEnCarrito.cantidad++;
    }

    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.listar();
  }

 
  quitar(id) {
    const indice = this.carrito.findIndex((producto) => producto.id === id);
  if (this.carrito[indice].cantidad > 1) {
      this.carrito[indice].cantidad--;
    } else {
      this.carrito.splice(indice, 1);
    }
  
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
     this.listar();
  }

  // Insertamos HTML
  listar() {
    
    this.total = 0;
    this.cantidadProductos = 0;
    divCarrito.innerHTML = "";

    for (const producto of this.carrito) {
      divCarrito.innerHTML += `
        <div class="productoCarrito">
          <h4>${producto.nombre}</h4>
          <p>$${producto.precio}</p>
          <p>Cantidad: ${producto.cantidad}</p>
          <a href="#" class="btnQuitar" data-id="${producto.id}">Quitar del carrito</a>
        </div>
      `;
      
      this.total += producto.precio * producto.cantidad;
      this.cantidadProductos += producto.cantidad;
    }
   
    const botonesQuitar = document.querySelectorAll(".btnQuitar");
    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault(); 
        const idProducto = Number(boton.dataset.id);
        this.quitar(idProducto);
      });
    }
   
    spanCantidadProductos.innerText = this.cantidadProductos;
    spanTotalCarrito.innerText = this.total;
  }
}

// Instanciamos la base de datos
const bd = new BaseDeDatos();

// Elementos
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("section h1");
const botoncomprar = document.querySelector("#botoncomprar");

// Instaciamos la clase Carrito
const carrito = new Carrito();


cargarProductos(bd.traerRegistros());

function cargarProductos(productos) {
  divProductos.innerHTML = "";
  
  for (const producto of productos) {
    divProductos.innerHTML += `
      <div class="producto">
        <h2>${producto.nombre}</h2>
        <p class="precio">$${producto.precio}</p>
        <div class="imagen">
          <img src="img/${producto.imagen}" />
        </div>
        <a href="#" class="btnAgregar" data-id="${producto.id}">Agregar al carrito</a>
      </div>
    `;
}
        

  // botones del catálogo y evento click
  const botonesAgregar = document.querySelectorAll(".btnAgregar");

  for (const boton of botonesAgregar) {
    boton.addEventListener("click", (event) => {
       event.preventDefault();
       const idProducto = Number(boton.dataset.id);
       const producto = bd.registroPorId(idProducto);
       carrito.agregar(producto);
    });
  }
}

// Buscador
inputBuscar.addEventListener("input", (event) => {
  event.preventDefault();
  const palabra = inputBuscar.value;
  const productos = bd.registrosPorNombre(palabra);
  cargarProductos(productos);
});

// Toggle para ocultar/mostrar el carrito
botonCarrito.addEventListener("click", (event) => {
  document.querySelector("section").classList.toggle("ocultar");
});

//filtro de botones colores y todos
const botonesFiltro = document.querySelectorAll('.filtro');

botonesFiltro.forEach((boton) => {
  boton.addEventListener('click', (event) => {
    const categoriaFiltro = event.target.getAttribute('data-categoria');
    const productosFiltrados = bd.productos.filter((producto) => producto.categoria === categoriaFiltro);
    cargarProductos(productosFiltrados);
  });
});

const mostrarTodosBtn = document.getElementById('mostrarTodos');
mostrarTodosBtn.addEventListener('click', () => {
   cargarProductos(bd.productos);
});

botoncomprar.addEventListener("click", (event) =>{
  event.preventDefault();
  Swal.fire({
    title: 'Gracias por su compra 🎸!',
    text: 'CUBO Indumentaria',
    icon: 'success',
    customClass: {
      confirmButton: 'boton-rojo'
    },
    buttonsStyling: false
  });
});