let registros = JSON.parse(localStorage.getItem("ponto")) || [];

/* =========================
   SALVAR
========================= */
function salvar() {
  localStorage.setItem("ponto", JSON.stringify(registros));
  carregarTabela();
}

/* =========================
   UTIL
========================= */
function horaParaMinutos(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

function minutosParaHora(min) {
  const h = String(Math.floor(min / 60)).padStart(2, "0");
  const m = String(min % 60).padStart(2, "0");
  return `${h}:${m}`;
}

/* =========================
   ENTRADA
========================= */
function registrarEntrada() {
  const nome = document.getElementById("nome").value.trim();
  if (!nome) return alert("Digite o nome");

  const agora = new Date();
  const hora = agora.toTimeString().slice(0, 5);

  registros.push({
    nome,
    data: agora.toLocaleDateString("pt-BR"),
    entrada: hora, // HH:MM
    saida: "",
    minutos: 0
  });

  salvar();
}

/* =========================
   SAÍDA
========================= */
function registrarSaida() {
  const nome = document.getElementById("nome").value.trim();
  if (!nome) return alert("Digite o nome");

  const agora = new Date();
  const horaSaida = agora.toTimeString().slice(0, 5);

  for (let i = registros.length - 1; i >= 0; i--) {
    const r = registros[i];

    if (r.nome === nome && r.saida === "") {
      r.saida = horaSaida;

      let total =
        horaParaMinutos(r.saida) -
        horaParaMinutos(r.entrada);

      // virou o dia
      if (total < 0) total += 1440;

      r.minutos = total;

      salvar();
      return;
    }
  }

  alert("Nenhuma entrada aberta encontrada");
}

/* =========================
   TABELA
========================= */
function carregarTabela() {
  const tabela = document.getElementById("tabela");
  tabela.innerHTML = "";

  registros.forEach((r, index) => {
    tabela.innerHTML += `
      <tr>
        <td>${r.nome}</td>
        <td>${r.data}</td>
        <td>${r.entrada}</td>
        <td>${r.saida}</td>
        <td>${minutosParaHora(r.minutos)}</td>
        <td class="acao">
          <button onclick="editarRegistro(${index})">✏️</button>
          <button onclick="excluirRegistro(${index})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

/* =========================
   EDITAR
========================= */
function editarRegistro(index) {
  const r = registros[index];

  const entrada = prompt("Entrada (HH:MM):", r.entrada);
  if (entrada === null) return;

  const saida = prompt("Saída (HH:MM):", r.saida);
  if (saida === null) return;

  r.entrada = entrada;
  r.saida = saida;

  let total =
    horaParaMinutos(saida) -
    horaParaMinutos(entrada);

  if (total < 0) total += 1440;

  r.minutos = total;

  salvar();
}

/* =========================
   EXCLUIR
========================= */
function excluirRegistro(index) {
  if (!confirm("Excluir este registro?")) return;
  registros.splice(index, 1);
  salvar();
}

/* =========================
   FILTRO
========================= */
function filtrar() {
  const termo = document.getElementById("filtro").value.toLowerCase();
  document.querySelectorAll("#tabela tr").forEach(linha => {
    linha.style.display = linha.innerText.toLowerCase().includes(termo)
      ? ""
      : "none";
  });
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", carregarTabela);


 
  
