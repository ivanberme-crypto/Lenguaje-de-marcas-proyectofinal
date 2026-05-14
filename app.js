
class Cliente {
  constructor(id, nombre, email, telefono, direccion) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.direccion = direccion;
  }
}

class Producto {
  constructor(id, nombre, marca, talla, color, precio, stock, categoria) {
    this.id = id;
    this.nombre = nombre;
    this.marca = marca;
    this.talla = talla;
    this.color = color;
    this.precio = parseFloat(precio);
    this.stock = parseInt(stock);
    this.categoria = categoria;
  }
}

class Venta {
  constructor(id, idCliente, idUsuario, estado, total) {
    this.id = id;
    this.idCliente = idCliente;
    this.idUsuario = idUsuario;
    this.estado = estado;
    this.total = parseFloat(total);
    this.fecha = new Date().toLocaleDateString("es-ES");
  }
}

class Usuario {
  constructor(id, nombre, email, rol) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.rol = rol;
  }
}

const DATA_DEFAULT = {
  clientes: [
    new Cliente(1,"Miguel Fernández","miguel@gmail.com","600111222","Madrid"),
    new Cliente(2,"Sara González","sara@gmail.com","600333444","Barcelona")
  ],
  productos: [
    new Producto(1,"Mercurial","Nike",42,"Rojo",199.99,10,"Fútbol"),
    new Producto(2,"Predator","Adidas",41,"Negro",229.99,5,"Fútbol")
  ],
  ventas: [
    new Venta(1,1,1,"Completada",199.99)
  ],
  usuarios: [
    new Usuario(1,"Admin","admin@crm.com","Administrador")
  ],
  nextId: { clientes: 3, productos: 3, ventas: 2, usuarios: 2 }
};

let db = JSON.parse(sessionStorage.getItem("crm")) || DATA_DEFAULT;

const save = () => {
    sessionStorage.setItem("crm", JSON.stringify(db));
    updateCounts();
};

const updateCounts = () => {
    document.getElementById("clientes-count").textContent = `${db.clientes.length} clientes`;
    document.getElementById("productos-count").textContent = `${db.productos.length} productos`;
    document.getElementById("ventas-count").textContent = `${db.ventas.length} ventas`;
    document.getElementById("usuarios-count").textContent = `${db.usuarios.length} usuarios`;
};


document.querySelectorAll(".header__btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".header__btn").forEach(b => b.classList.remove("header__btn--activo"));
    document.querySelectorAll(".seccion").forEach(s => s.classList.add("seccion--oculta"));

    btn.classList.add("header__btn--activo");
    document.getElementById("seccion-" + btn.dataset.seccion).classList.remove("seccion--oculta");
  };
});


const modal = document.getElementById("modal");
const title = document.getElementById("modal-title");
const body = document.getElementById("modal-body");
let cb = null;

function openModal(t, html, callback) {
  title.textContent = t;
  body.innerHTML = html;
  cb = callback;
  modal.classList.add("modal--activo");
}

function closeModal() {
  modal.classList.remove("modal--activo");
  cb = null;
}

document.getElementById("modal-close").onclick = closeModal;
document.getElementById("modal-cancel").onclick = closeModal;
document.getElementById("modal-save").onclick = () => { if(cb) cb(); };


function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("toast--activo");
  setTimeout(() => t.classList.remove("toast--activo"), 2000);
}


function renderClientes() {
  const tbody = document.getElementById("tabla-clientes");
  tbody.innerHTML = db.clientes.map(c => `
    <tr>
      <td>${c.id}</td><td>${c.nombre}</td><td>${c.email}</td><td>${c.telefono}</td><td>${c.direccion}</td>
      <td class="acciones">
        <button onclick="editCliente(${c.id})">Editar</button>
        <button onclick="deleteCliente(${c.id})">Borrar</button>
      </td>
    </tr>`).join("");
}

document.getElementById("btn-nuevo-cliente").onclick = () => {
  openModal("Nuevo Cliente", `
    <input id="n" class="form__input" placeholder="Nombre">
    <input id="e" class="form__input" placeholder="Email">
    <input id="t" class="form__input" placeholder="Teléfono">
    <input id="d" class="form__input" placeholder="Dirección">
  `, () => {
    db.clientes.push(new Cliente(db.nextId.clientes++, n.value, e.value, t.value, d.value));
    save(); renderClientes(); closeModal(); toast("Cliente añadido");
  });
};

window.deleteCliente = id => {
  db.clientes = db.clientes.filter(c => c.id !== id);
  save(); renderClientes();
};


function renderProductos() {
  const tbody = document.getElementById("tabla-productos");
  tbody.innerHTML = db.productos.map(p => `
    <tr>
      <td>${p.id}</td><td>${p.nombre}</td><td>${p.marca}</td><td>${p.talla}</td><td>${p.color}</td><td>${p.precio}€</td><td>${p.stock}</td><td>${p.categoria}</td>
      <td class="acciones"><button onclick="deleteProducto(${p.id})">Borrar</button></td>
    </tr>`).join("");
}

document.getElementById("btn-nuevo-producto").onclick = () => {
  openModal("Nuevo Producto", `
    <input id="p_nom" class="form__input" placeholder="Nombre">
    <input id="p_mar" class="form__input" placeholder="Marca">
    <input id="p_tal" class="form__input" placeholder="Talla">
    <input id="p_col" class="form__input" placeholder="Color">
    <input id="p_pre" class="form__input" type="number" placeholder="Precio">
    <input id="p_sto" class="form__input" type="number" placeholder="Stock">
    <input id="p_cat" class="form__input" placeholder="Categoría">
  `, () => {
    db.productos.push(new Producto(db.nextId.productos++, p_nom.value, p_mar.value, p_tal.value, p_col.value, p_pre.value, p_sto.value, p_cat.value));
    save(); renderProductos(); closeModal(); toast("Producto añadido");
  });
};

window.deleteProducto = id => {
  db.productos = db.productos.filter(p => p.id !== id);
  save(); renderProductos();
};


function renderVentas() {
  const tbody = document.getElementById("tabla-ventas");
  tbody.innerHTML = db.ventas.map(v => `
    <tr>
      <td>${v.id}</td><td>${v.idCliente}</td><td>Usuario ${v.idUsuario}</td><td>${v.estado}</td><td>${v.total}€</td><td>${v.fecha}</td>
      <td class="acciones"><button onclick="deleteVenta(${v.id})">Borrar</button></td>
    </tr>`).join("");
}

document.getElementById("btn-nueva-venta").onclick = () => {
  
    openModal("Nueva Venta", `
      <input id="v_cli" class="form__input" placeholder="ID Cliente">
      <input id="v_tot" class="form__input" type="number" placeholder="Total">
    `, () => {
      db.ventas.push(new Venta(db.nextId.ventas++, v_cli.value, 1, "Completada", v_tot.value));
      save(); renderVentas(); closeModal(); toast("Venta registrada");
    });
};

window.deleteVenta = id => {
    db.ventas = db.ventas.filter(v => v.id !== id);
    save(); renderVentas();
};


function renderUsuarios() {
  const tbody = document.getElementById("tabla-usuarios");
  tbody.innerHTML = db.usuarios.map(u => `
    <tr>
      <td>${u.id}</td><td>${u.nombre}</td><td>${u.email}</td><td>${u.rol}</td>
      <td class="acciones"><button onclick="deleteUsuario(${u.id})">Borrar</button></td>
    </tr>`).join("");
}

document.getElementById("btn-nuevo-usuario").onclick = () => {
    openModal("Nuevo Usuario", `
      <input id="u_nom" class="form__input" placeholder="Nombre">
      <input id="u_ema" class="form__input" placeholder="Email">
      <select id="u_rol" class="form__select">
        <option>Vendedor</option>
        <option>Administrador</option>
      </select>
    `, () => {
      db.usuarios.push(new Usuario(db.nextId.usuarios++, u_nom.value, u_ema.value, u_rol.value));
      save(); renderUsuarios(); closeModal(); toast("Usuario creado");
    });
};

window.deleteUsuario = id => {
    db.usuarios = db.usuarios.filter(u => u.id !== id);
    save(); renderUsuarios();
};

/* ================= INIT ================= */
renderClientes();
renderProductos();
renderVentas();
renderUsuarios();
updateCounts();