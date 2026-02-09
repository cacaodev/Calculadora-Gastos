let historialGastos = [];
let presupuestoTotal = 0;

function guardarEnStorage() {
  localStorage.setItem("misGastos", JSON.stringify(historialGastos));
  localStorage.setItem("miPresupuesto", presupuestoTotal.toString());
}

function cargarDatos() {
  const gastosGuardados = localStorage.getItem("misGastos");
  const presupuestoGuardado = localStorage.getItem("miPresupuesto");

  if (gastosGuardados) {
    historialGastos = JSON.parse(gastosGuardados);
  }
  if (presupuestoGuardado) {
    presupuestoTotal = parseFloat(presupuestoGuardado);
  }
}

cargarDatos();

const calcularIVA = (monto) => Math.round(monto * 0.19);
function calcularTotalGastos() {
  let total = 0;
  historialGastos.forEach((gasto) => {
    total += gasto.monto;
  });
  return total;
}
function obtenerSaldoRestante() {
  return presupuestoTotal - calcularTotalGastos();
}

function agregarGasto() {
  let nombre = prompt("¿En qué gastaste el dinero? (Por Ej: Almuerzo, transporte, etc.)");
  let monto = parseFloat(prompt("¿Cuánto costó?"));
  let saldoActual = obtenerSaldoRestante();
  if (isNaN(monto) || monto <= 0) {
    alert("Error: Por favor, ingresa un monto válido.");
    return;
  }
  if (monto > saldoActual) {
    alert(
      `Error: Gasto rechazado. ¡No puedes gastar más de lo que tienes! - Tu saldo actual es de $${saldoActual}.`,
    );
  } else {
    const nuevoGasto = {
      id: Date.now(),
      descripcion: nombre,
      monto: monto,
      iva: calcularIVA(monto),
    };
    historialGastos.push(nuevoGasto);
    guardarEnStorage();
    alert("Gasto registrado");
  }
}
function iniciarApp() {
  if (presupuestoTotal === 0) {
    let ingreso = prompt("Bienvenida. Ingresa tu presupuesto inicial:");
    presupuestoTotal = parseFloat(ingreso);
    guardarEnStorage();
  }

  let continuar = true;
  while (continuar) {
    let opcion = prompt(
      `Saldo Disponible: $${obtenerSaldoRestante()}\n\n` +
        "1. Agregar Gasto\n" +
        "2. Ver Historial\n" +
        "3. Modificar Presupuesto\n" +
        "4. Salir",
    );
    switch (opcion) {
      case "1":
        agregarGasto();
        break;
      case "2":
        mostrarResumen();
        break;
      case "3":
        modificarPresupuesto();
        break;
      case "4":
        alert("¡Hasta pronto!");
        continuar = false;
        break;
      default:
        alert("Error: Opción no válida.");
    }
  }
}

function mostrarResumen() {
  if (historialGastos.length === 0) {
    alert("No hay gastos registrados.");
  } else {
    let lista = "Historial de Gastos:\n";
    historialGastos.forEach((g) => {
      lista += `- ${g.descripcion}: $${g.monto} (IVA: $${g.iva})\n`;
    });
    alert(lista);
  }
}

function modificarPresupuesto() {
  let nuevoPresupuesto = parseFloat(
    prompt(
      `Presupuesto actual: $${presupuestoTotal}\nIngresa el nuevo presupuesto:`,
    ),
  );

  if (isNaN(nuevoPresupuesto) || nuevoPresupuesto <= 0) {
    alert("Error: Monto inválido.");
    return;
  }
  let gastadoHastaAhora = calcularTotalGastos();

  if (nuevoPresupuesto < gastadoHastaAhora) {
    alert(
      `No puedes bajar el presupuesto a $${nuevoPresupuesto} porque ya has gastado $${gastadoHastaAhora}.`,
    );
  } else {
    presupuestoTotal = nuevoPresupuesto;
    guardarEnStorage();
    alert("Presupuesto actualizado correctamente");
  }
}

document.getElementById("btnIniciar").addEventListener("click", iniciarApp);
