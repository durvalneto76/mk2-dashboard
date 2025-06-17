const apiKey = "AIzaSyA_JAbuOj_KfPt-_WWc2diP5FkGa-63NI4";
const sheetId = "1wJUdLVDlWrankTY_sNTl7vlUsGEQZCPsNV4ct1NMV8E";
const sheetName = "CONSOLIDADO";

// Credenciais locais
const users = {
  "admin": { password: "admin123", role: "admin" },
  "fernanda.lima": { password: "gerente123", role: "gerente" }
};

// Login
function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const userData = users[user];
  if (!userData || userData.password !== pass) {
    document.getElementById("loginError").innerText = "Usuário ou senha inválidos";
    return;
  }
  localStorage.setItem("mk2_user", user);
  localStorage.setItem("mk2_role", userData.role);
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  if (userData.role === "admin") {
    document.getElementById("adminSection").classList.remove("hidden");
  }
  fetchSheetData().then(renderIndividualView);
}

function logout() {
  localStorage.clear();
  location.reload();
}

function fetchSheetData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const rows = data.values;
      const headers = rows[0];
      const entries = rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((key, i) => {
          obj[key.trim()] = row[i] ? row[i].trim() : '';
        });
        return obj;
      });
      return entries;
    });
}

function renderIndividualView(data) {
  const user = localStorage.getItem("mk2_user");
  const dados = data.filter(d => d["Gerente"]?.toLowerCase() === user.toLowerCase());

  const oportunidades = dados.length;
  const vgvTotal = dados.reduce((acc, d) => acc + (parseFloat(d["VGV"]?.replace(/[R$.\s]/g, '').replace(',', '.') || 0)), 0);
  const vendas = dados.filter(d => d["Status"] === "Vendido").length;
  const desistencias = dados.filter(d => d["Status"] === "Desistência").length;

  document.getElementById("indOportunidades").innerText = oportunidades;
  document.getElementById("indVgvTotal").innerText = `R$ ${vgvTotal.toLocaleString("pt-BR", {minimumFractionDigits: 2})}`;
  document.getElementById("indVendas").innerText = vendas;
  document.getElementById("indDesistencia").innerText = desistencias;
}

document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("mk2_user");
  const role = localStorage.getItem("mk2_role");
  if (user && role) {
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    if (role === "admin") {
      document.getElementById("adminSection").classList.remove("hidden");
    }
    fetchSheetData().then(renderIndividualView);
  }
});
