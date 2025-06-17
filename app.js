
const SHEET_ID = "1wJUdLVDlWrankTY_sNTl7vlUsGEQZCPsNV4ct1NMV8E";
const API_KEY = "AIzaSyA_JAbuOj_KfPt-_WWc2diP5FkGa-63NI4";
const SHEET_NAME = "CONSOLIDADO";

async function fetchSheetData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const rows = data.values;
    const headers = rows[0];
    return rows.slice(1).map(row => {
        let obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index] || "";
        });
        return obj;
    });
}

function renderIndividualView(data, gerenteSelecionado) {
    const gerenteData = data.filter(item => item["Gerente"] === gerenteSelecionado);
    const oportunidades = gerenteData.length;
    const vgvTotal = gerenteData.reduce((sum, item) => sum + parseFloat(item["VGV"] || 0), 0);
    const vendas = gerenteData.filter(item => item["Status"] === "Vendido").length;
    const desistencias = gerenteData.filter(item => item["Status"] === "Perdido").length;

    document.getElementById("indOportunidades").innerText = oportunidades;
    document.getElementById("indVgvTotal").innerText = vgvTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    document.getElementById("indVendas").innerText = vendas;
    document.getElementById("indDesistencia").innerText = desistencias;

    // Atualiza o seletor
    const select = document.getElementById("gerenteSelect");
    const nomesUnicos = [...new Set(data.map(item => item["Gerente"]))];
    select.innerHTML = '<option value="">Selecione um Gerente</option>';
    nomesUnicos.forEach(nome => {
        const opt = document.createElement("option");
        opt.value = nome;
        opt.textContent = nome;
        select.appendChild(opt);
    });

    select.onchange = () => {
        renderIndividualView(data, select.value);
    };
}

async function initDashboard() {
    const data = await fetchSheetData();
    renderIndividualView(data, data[0]["Gerente"]);
}

document.addEventListener("DOMContentLoaded", initDashboard);
