let registros = JSON.parse(localStorage.getItem("ponto")) || [];

/* =========================
   SALVAR
========================= */
function salvar() {
  localStorage.setItem("ponto", JSON.stringify(registros));
  carregarTabela();
}

/* =========================
   FORMATAR MINUTOS
========================= */
function formatarMinutos(min) {
  const h = String(Math.floor(min / 60)).padStart(2, "0");
  const m = String(min % 60)).padStart(2, "0");
  return `${h}:${m}`;
}

/* =========================
   ENTRADA (BATIDA DE PONTO)
========================= */
function registrarEntrada() {
  const nome = document.getElementById("nome").value.trim();
  if (!nome) return alert("Digite o nome");

  const agora = Date.now(); // timestamp REAL

  registros.push({
    nome,
    entradaTs: agora, // milissegundos
    saidaTs: null,
    minutos: 0
  });

  salvar();
}

/* =========================
   SAÍDA (CALCULA TEMPO REAL)
========================= */
function registrarSaida() {
  const nome = document.getElementById("nome").value.trim();
  if (!nome) return alert("Digite o nome");

  for (let i = registros.length - 1; i >= 0; i--) {
    const r = registros[i];

    if (r.nome === nome && r.saidaTs === null) {
      r.saidaTs = Date.now();

      const diferencaMs = r.saidaTs - r.entradaTs;
      const minutosTrabalhados = Math.floor(diferencaMs / 60000);

      r.minutos = minutosTrabalhados;

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
        <td>${new Date(r.entradaTs).toLocaleTimeString()}</td>
        <td>${r.saidaTs ? new Date(r.saidaTs).toLocaleTimeString() : ""}</td>
        <td>${formatarMinutos(r.minutos)}</td>
        <td>
          <button onclick="excluirRegistro(${index})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

/* =========================
   EXCLUIR
========================= */
function excluirRegistro(index) {
  if (!confirm("Excluir registro?")) return;
  registros.splice(index, 1);
  salvar();
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", carregarTabela);
