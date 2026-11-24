/* =========================================
   SIMULADOR DA USINA FOTOVOLTAICA
   Modelo didático:
   - Volume = C × L × P
   - Energia p/ 1 °C = massa × 4,186 kJ/kg°C ÷ 3600 (kWh)
   - Perda térmica diária = área × perda específica (kWh/m²·dia)
   - Consumo elétrico = perda ÷ COP (bomba de calor) | ÷ 1 (resistência)
   - kWp = consumo diário ÷ (HSP × 0,80 rendimento do sistema)
========================================= */
(function () {
    "use strict";

    const $ = (id) => document.getElementById(id);
    const campos = ["sim-comp", "sim-larg", "sim-prof", "sim-perda", "sim-cop", "sim-hsp", "sim-painel"];
    const nf = (n, d = 0) => n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
    const AREA_PAINEL = 2.58; // m² de um módulo de ~550 W
    const PR = 0.8;           // rendimento global do sistema

    function num(id, min, max, padrao) {
        const v = parseFloat($(id).value);
        if (!isFinite(v)) return padrao;
        return Math.min(max, Math.max(min, v));
    }

    function calcular() {
        const c = num("sim-comp", 1, 200, 50);
        const l = num("sim-larg", 1, 100, 25);
        const p = num("sim-prof", 0.3, 10, 2);
        const perda = parseFloat($("sim-perda").value);
        const cop = parseFloat($("sim-cop").value);
        const hsp = parseFloat($("sim-hsp").value);
        const wp = parseFloat($("sim-painel").value);

        $("sim-cop-val").textContent = nf(cop, 1);
        $("sim-hsp-val").textContent = nf(hsp, 1);

        const area = c * l;
        const volume = area * p;                       // m³
        const kwh1grau = (volume * 1000 * 4.186) / 3600;
        const termicaDia = area * perda;               // kWh térmicos/dia
        const eletBC = termicaDia / cop;               // kWh elétricos/dia
        const eletRes = termicaDia;                    // resistência: COP ≈ 1
        const kwp = eletBC / (hsp * PR);
        const paineis = Math.ceil((kwp * 1000) / wp);
        const areaPaineis = paineis * AREA_PAINEL * (wp / 550);

        $("r-kwp").textContent = nf(kwp, 0) + " kWp";
        $("r-paineis").textContent = "≈ " + nf(paineis) + " painéis de " + wp + " W";
        $("r-vol").textContent = nf(volume) + " m³ (" + nf(volume / 1000, 2) + " mi L)";
        $("r-1grau").textContent = nf(kwh1grau) + " kWh";
        $("r-termica").textContent = nf(termicaDia) + " kWh";
        $("r-area").textContent = "≈ " + nf(areaPaineis) + " m²";

        const mesRes = eletRes * 30, mesBC = eletBC * 30;
        $("r-res").textContent = nf(mesRes) + " kWh";
        $("r-bc").textContent = nf(mesBC) + " kWh";
        $("b-res").style.width = "100%";
        $("b-bc").style.width = Math.max(2, (mesBC / mesRes) * 100) + "%";
        $("r-barras-desc").setAttribute("aria-label",
            "Consumo mensal: resistência elétrica " + nf(mesRes) + " kWh; bomba de calor " + nf(mesBC) +
            " kWh, " + nf(cop, 1) + " vezes menos.");
    }

    campos.forEach((id) => $(id).addEventListener("input", calcular));
    $("sim-form").addEventListener("submit", (e) => e.preventDefault());
    calcular();
})();
