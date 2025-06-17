
const API_KEY = "AIzaSyA_JAbuOj_KfPt-_WWc2diP5FkGa-63NI4";
const SPREADSHEET_ID = "1wJUdLVDlWrankTY_sNTl7vlUsGEQZCPsNV4ct1NMV8E";
const RANGE = "CONSOLIDADO";

async function fetchData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.values;
}

function renderIndividualView(data) {
    const headers = data[0];
    const rows = data.slice(1);
    const gerenteLogado = "fernanda.lima";

    const dadosGerente = rows.filter(row => row[headers.indexOf("Gerente")] === gerenteLogado);

    const totalOportunidades = dadosGerente.length;
    const vgvTotal = dadosGerente.reduce((sum, row) => sum + parseFloat((row[headers.indexOf("VGV")] || "0").replace(/[^\d.-]/g, '')), 0);
    const vendas = dadosGerente.filter(row => row[headers.indexOf("Status")] === "Venda").length;
    const desistencias = dadosGerente.filter(row => row[headers.indexOf("Status")] === "Desistência").length;

    const el = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.innerText = value;
    };

    el("indOportunidades", totalOportunidades);
    el("indVgvTotal", vgvTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    el("indVendas", vendas);
    el("indDesistencia", desistencias);
}

async function initDashboard() {
    try {
        const data = await fetchData();
        renderIndividualView(data);
        document.getElementById("dashboard").classList.remove("hidden");
    } catch (e) {
        console.error("Erro ao carregar dados:", e);
    }
}

document.addEventListener("DOMContentLoaded", initDashboard);
