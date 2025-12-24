let registros = JSON.parse(localStorage.getItem("ponto")) || [];

/* =========================
   SALVAR / CARREGAR
========================= */
function salvar() {
  localStorage.setItem("ponto", JSON.stringify(registros));
  carregarTabela();
}

/* =========================
   ENTRADA
========================= */
function registrarEntrada() {
  const nome = document.getElementById("nome").value.trim();
  if (!nome) return alert("Digite o nome");

  const agora = new Date();

  registros.push({
    nome,
    data: agora.toISOString().split("T")[0], // yyyy-mm-dd
    entrada: agora.getTime(), // timestamp
    saida: "",
    horas: ""
  });

  salvar();
}

/* =========================
   SAÍDA
========================= */
function registrarSaida() {
  const nome = document.getElementById("nome").value.trim();
  if (!nome) return alert("Digite o nome");

  for (let i = registros.length - 1; i >= 0; i--) {
    if (registros[i].nome === nome && registros[i].saida === "") {
      const agora = new Date();
      registros[i].saida = agora.getTime();

      const totalMs = registros[i].saida - registros[i].entrada;
      registros[i].horas = (totalMs / (1000 * 60 * 60)).toFixed(2);

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
        <td>${new Date(r.entrada).toLocaleTimeString()}</td>
        <td>${r.saida ? new Date(r.saida).toLocaleTimeString() : ""}</td>
        <td>${r.horas}</td>
        <td class="acao">
          <button class="editar" onclick="editarRegistro(${index})">✏️</button>
          <button class="excluir" onclick="excluirRegistro(${index})">🗑️</button>
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

  const nome = prompt("Nome:", r.nome);
  if (nome === null) return;

  const entradaAtual = new Date(r.entrada).toLocaleTimeString().slice(0, 5);
  const entrada = prompt("Entrada (HH:MM):", entradaAtual);
  if (entrada === null) return;

  const saidaAtual = r.saida
    ? new Date(r.saida).toLocaleTimeString().slice(0, 5)
    : "";
  const saida = prompt("Saída (HH:MM):", saidaAtual);
  if (saida === null) return;

  r.nome = nome;

  if (entrada) {
    const [h, m] = entrada.split(":").map(Number);
    const novaEntrada = new Date(r.data);
    novaEntrada.setHours(h, m, 0, 0);
    r.entrada = novaEntrada.getTime();
  }

  if (saida) {
    const [h, m] = saida.split(":").map(Number);
    const novaSaida = new Date(r.data);
    novaSaida.setHours(h, m, 0, 0);
    r.saida = novaSaida.getTime();
  }

  if (r.entrada && r.saida) {
    const totalMs = r.saida - r.entrada;
    r.horas = (totalMs / (1000 * 60 * 60)).toFixed(2);
  }

  salvar();
}

/* =========================
   EXCLUIR
========================= */
function excluirRegistro(index) {
  if (!confirm("Deseja excluir este registro?")) return;
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
   EXPORTAR EXCEL
========================= */
function exportarExcel() {
  let csv = "Nome,Data,Entrada,Saída,Horas\n";

  registros.forEach(r => {
    csv += `${r.nome},${r.data},${new Date(r.entrada).toLocaleTimeString()},${r.saida ? new Date(r.saida).toLocaleTimeString() : ""},${r.horas}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "controle_ponto.csv";
  a.click();
}

/* =========================
   EXPORTAR PDF
========================= */
function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Relatório de Controle de Ponto", 14, 15);

  let y = 30;
  doc.setFontSize(10);

  registros.forEach(r => {
    doc.text(
      `${r.nome} | ${r.data} | ${new Date(r.entrada).toLocaleTimeString()} - ${r.saida ? new Date(r.saida).toLocaleTimeString() : ""} | ${r.horas}h`,
      14,
      y
    );
    y += 8;

    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("controle_ponto.pdf");
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", carregarTabela);

   
    


