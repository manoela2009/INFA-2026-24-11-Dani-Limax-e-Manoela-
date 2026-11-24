/* =========================================
   ASSISTENTE VIRTUAL "MARINA" — IA GRATUITA
   1) IA online gratuita (Pollinations.ai — sem chave, sem cadastro)
   2) Se a internet/IA falhar: base de conhecimento local (funciona offline)
   Voz: síntese de fala do próprio navegador (gratuita)
   Microfone: reconhecimento de voz do navegador (Chrome/Edge)
========================================= */
(function () {
    "use strict";

    const IA_URL = "https://text.pollinations.ai/openai";
    const IA_URL_GET = "https://text.pollinations.ai/";
    const TEMPO_LIMITE = 20000;

    const CONTEXTO = `Você é a Marina, assistente virtual simpática do projeto escolar "Sol na Piscina — Aquecimento Fotovoltaico" do Colégio Estadual do Paraná (Curitiba), feito pelos alunos Manoela, Andreas e Daniella.

Foco do projeto: aquecer a piscina olímpica do colégio (50 m × 25 m = 1.250 m², cerca de 2,5 milhões de litros) com energia solar FOTOVOLTAICA alimentando uma BOMBA DE CALOR.
- Painéis fotovoltaicos: células de silício, efeito fotovoltaico, geram corrente contínua; inversor converte para corrente alternada.
- Bomba de calor: retira calor do ar e passa para a água; COP de 4 a 6 (1 kWh elétrico vira 4 a 6 kWh de calor). Resistência elétrica tem COP ≈ 1.
- Sistema on-grid: excedente vira créditos de energia com a distribuidora (Copel), pela Lei 14.300/2022.
- Capa térmica reduz a evaporação, maior fonte de perda de calor.
- Estimativa didática do simulador do site: piscina coberta sem capa, perda de 2 kWh/m²·dia → 2.500 kWh térmicos/dia; com COP 5 → 500 kWh elétricos/dia; Curitiba ~4,3 h de sol pleno e rendimento 80% → ~145 kWp, ~265 painéis de 550 W, ~680 m² de painéis.
- Alternativas comparadas: resistência elétrica, aquecedor a gás, solar térmico e fotovoltaico + bomba de calor (recomendado).
- Caminho da água: captação → filtragem → aquecimento → retorno. Temperatura ideal 26 °C a 28 °C.
- Metodologia: Ilha de Racionalidade (Física, Química, Matemática, Geografia, Sociologia).

Responda em português do Brasil, de forma clara, amigável e curta (no máximo 3 parágrafos curtos, sem markdown), com linguagem para alunos do ensino médio. Se a pergunta fugir do tema energia/aquecimento/piscina/projeto, diga gentilmente que só pode ajudar com esse assunto.`;

    /* ---------- BASE DE CONHECIMENTO LOCAL (modo offline) ---------- */
    const BASE = [
        { k: ["painel", "placa", "modulo", "fotovolt", "funciona o painel", "celula", "silicio", "efeito"],
          r: "Os painéis fotovoltaicos são feitos de células de silício. Quando a luz do Sol chega até elas, os fótons dão energia aos elétrons, que começam a se movimentar e formam uma corrente elétrica contínua. Isso é o efeito fotovoltaico: sem peças móveis, sem barulho e sem queimar nada." },
        { k: ["bomba de calor", "cop", "heat pump", "como aquece", "ar condicionado"],
          r: "A bomba de calor funciona como um ar-condicionado ao contrário: ela retira o calor do ar e transfere para a água da piscina. O segredo é o COP: para cada 1 kWh de eletricidade, ela entrega de 4 a 6 kWh de calor. Uma resistência elétrica entrega só 1 kWh. Por isso ela é a parceira ideal dos painéis solares." },
        { k: ["quantos painei", "quantas placa", "tamanho da usina", "kwp", "dimension", "quantos modulo"],
          r: "No nosso simulador, considerando a piscina olímpica coberta e sem capa térmica, a perda é de cerca de 2.500 kWh de calor por dia. Com uma bomba de calor de COP 5, isso vira 500 kWh de eletricidade por dia, o que exige uma usina de aproximadamente 145 kWp — por volta de 265 painéis de 550 W. É uma estimativa didática: você pode mudar os valores no simulador do site!" },
        { k: ["inversor", "corrente continua", "corrente alternada", "cc", "ca"],
          r: "O inversor é o 'tradutor' do sistema: os painéis geram corrente contínua (CC), mas os equipamentos do colégio usam corrente alternada (CA). O inversor faz essa conversão e ainda permite monitorar a geração pelo celular." },
        { k: ["credito", "rede", "on-grid", "on grid", "noite", "nublado", "chuva", "14.300", "copel", "distribuidora"],
          r: "O sistema é conectado à rede (on-grid). Durante o dia, a energia que sobra vai para a rede da distribuidora e vira créditos, conforme a Lei 14.300/2022. À noite ou em dias nublados, o colégio usa esses créditos. Por isso a piscina continua aquecida mesmo sem Sol." },
        { k: ["termico", "coletor", "diferença", "diferenca", "solar termico"],
          r: "O solar térmico aquece a água diretamente em coletores no telhado, mas depende muito do clima e só serve para a piscina. O fotovoltaico gera eletricidade, que alimenta a bomba de calor e também pode ser usada no resto do colégio. É uma energia mais versátil." },
        { k: ["gas", "eletrico", "resistencia", "comparar", "comparacao", "melhor", "qual sistema", "recomenda", "custo beneficio", "custo-beneficio"],
          r: "Comparamos quatro opções: resistência elétrica (barata de instalar, mas gasta muita energia), aquecedor a gás (rápido, mas usa combustível fóssil e tem custo alto), solar térmico (renovável, mas muito dependente do clima) e fotovoltaico + bomba de calor. Este último foi o recomendado: exige investimento inicial maior, mas tem o menor custo de operação e é o mais sustentável." },
        { k: ["custo", "preco", "caro", "economia", "conta de luz", "payback", "retorno do invest"],
          r: "O investimento inicial do fotovoltaico é maior, mas a conta de energia cai muito. A bomba de calor gasta cerca de 5 vezes menos eletricidade que uma resistência, e essa eletricidade vem do Sol. Assim o investimento tende a se pagar em poucos anos, e os painéis duram mais de 25 anos." },
        { k: ["capa", "evapora", "perda", "cobrir"],
          r: "A maior parte do calor da piscina se perde pela evaporação na superfície. Usar uma capa térmica fora do horário de uso reduz muito essa perda, e então o sistema pode ser menor e mais barato." },
        { k: ["temperatura", "graus", "quente", "ideal"],
          r: "Para treinos e competições, a temperatura ideal da água fica entre 26 °C e 28 °C. A bomba de calor tem um termostato que liga e desliga automaticamente para manter essa faixa." },
        { k: ["caminho da agua", "processo", "etapa", "circula", "filtro", "captacao", "retorno"],
          r: "A água faz um ciclo contínuo: 1) captação pelos ralos e skimmers; 2) filtragem para retirar impurezas; 3) aquecimento na bomba de calor, alimentada pela energia solar; 4) retorno para a piscina pelos bocais." },
        { k: ["manutencao", "limpeza", "cuidado", "seguranca", "vida util", "dura"],
          r: "Os painéis duram mais de 25 anos e pedem basicamente limpeza periódica. Também é importante a instalação por profissional habilitado, com aterramento e proteções elétricas, a manutenção do filtro e da bomba de calor, e o acompanhamento da geração pelo aplicativo do inversor." },
        { k: ["curitiba", "sol", "irradia", "inverno", "frio", "clima", "parana"],
          r: "Curitiba recebe em média cerca de 4,3 kWh de energia solar por m² por dia ao longo do ano. No inverno a geração diminui e a demanda de aquecimento aumenta, por isso os créditos acumulados no verão ajudam a equilibrar o ano." },
        { k: ["volume", "litros", "tamanho da piscina", "olimpica", "dimensao"],
          r: "Uma piscina olímpica tem 50 m de comprimento por 25 m de largura, ou seja, 1.250 m² de superfície. Com cerca de 2 m de profundidade média, são aproximadamente 2,5 milhões de litros. Só para subir 1 °C dessa água são necessários cerca de 2.900 kWh de calor!" },
        { k: ["metodologia", "ilha de racionalidade", "disciplina"],
          r: "O projeto usa a metodologia Ilha de Racionalidade: juntamos conhecimentos de Física, Química, Matemática, Geografia e Sociologia para resolver uma situação real, o aquecimento da piscina do nosso colégio." },
        { k: ["equipe", "aluno", "quem fez", "integrante", "autor"],
          r: "O projeto foi desenvolvido pelos alunos Manoela, Andreas e Daniella, do Colégio Estadual do Paraná." },
        { k: ["sustent", "ambiente", "co2", "poluicao", "limpa", "renovavel"],
          r: "A energia fotovoltaica é renovável e não emite poluentes durante o funcionamento. Trocar gás ou resistência elétrica por painéis com bomba de calor reduz as emissões de CO₂ e ainda ensina os alunos, na prática, sobre energia limpa." },
        { k: ["oi", "ola", "bom dia", "boa tarde", "boa noite", "tudo bem"],
          r: "Olá! Que bom ter você aqui ☀️ Posso explicar como os painéis solares, o inversor e a bomba de calor trabalham juntos para aquecer a piscina do colégio. O que você quer saber?" },
        { k: ["obrigad", "valeu"],
          r: "Por nada! Se tiver mais alguma dúvida sobre energia solar ou sobre o projeto, é só perguntar." }
    ];

    const normalizar = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

    function respostaLocal(pergunta) {
        const p = normalizar(pergunta);
        let melhor = null, pontos = 0;
        BASE.forEach((item) => {
            const s = item.k.reduce((acc, k) => acc + (p.includes(normalizar(k)) ? k.length : 0), 0);
            if (s > pontos) { pontos = s; melhor = item; }
        });
        return melhor ? melhor.r
            : "Boa pergunta! No momento estou no modo offline e só sei responder sobre o projeto: painéis fotovoltaicos, bomba de calor, inversor, créditos de energia, comparação entre sistemas, custos e o caminho da água. Tente perguntar sobre um desses temas!";
    }

    /* ---------- IA ONLINE GRATUITA ---------- */
    const historico = [];

    async function comTempo(promessa, ms) {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), ms);
        try { return await promessa(ctrl.signal); } finally { clearTimeout(t); }
    }

    async function perguntarIA(pergunta) {
        const mensagens = [{ role: "system", content: CONTEXTO }, ...historico.slice(-6), { role: "user", content: pergunta }];

        // Tentativa 1: endpoint compatível com OpenAI
        try {
            const res = await comTempo((signal) => fetch(IA_URL, {
                method: "POST", signal,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ model: "openai", messages: mensagens, private: true, referrer: "cep-sol-na-piscina" })
            }), TEMPO_LIMITE);
            if (res.ok) {
                const dados = await res.json();
                const txt = dados && dados.choices && dados.choices[0] && dados.choices[0].message && dados.choices[0].message.content;
                if (txt && txt.trim()) return txt.trim();
            }
        } catch (e) { /* tenta o próximo */ }

        // Tentativa 2: endpoint simples (GET)
        try {
            const url = IA_URL_GET + encodeURIComponent(pergunta) + "?model=openai&private=true&system=" + encodeURIComponent(CONTEXTO);
            const res = await comTempo((signal) => fetch(url, { signal }), TEMPO_LIMITE);
            if (res.ok) {
                const txt = (await res.text()).trim();
                if (txt && !/^\s*[{<]/.test(txt)) return txt;
            }
        } catch (e) { /* cai para o modo local */ }

        return null;
    }

    const limpar = (t) => t.replace(/\*\*(.*?)\*\*/g, "$1").replace(/^#+\s*/gm, "").replace(/^\s*[-*]\s+/gm, "• ").trim();

    /* ---------- INTERFACE ---------- */
    const painel = document.getElementById("assistente");
    const btnAbrir = document.getElementById("assistente-botao");
    const btnFechar = document.getElementById("assistente-fechar");
    const btnVoz = document.getElementById("assistente-voz");
    const form = document.getElementById("assistente-form");
    const campo = document.getElementById("assistente-campo");
    const btnMic = document.getElementById("assistente-mic");
    const lista = document.getElementById("assistente-mensagens");
    const status = document.getElementById("assistente-status");
    const avatar = painel.querySelector(".avatar-mini");
    let vozLigada = true;
    let ocupado = false;

    function abrir() {
        painel.hidden = false;
        btnAbrir.hidden = true;
        btnAbrir.setAttribute("aria-expanded", "true");
        campo.focus();
    }
    function fechar() {
        painel.hidden = true;
        btnAbrir.hidden = false;
        btnAbrir.setAttribute("aria-expanded", "false");
        pararFala();
        btnAbrir.focus();
    }
    btnAbrir.addEventListener("click", abrir);
    btnFechar.addEventListener("click", fechar);
    painel.addEventListener("keydown", (e) => { if (e.key === "Escape") fechar(); });

    btnVoz.addEventListener("click", () => {
        vozLigada = !vozLigada;
        btnVoz.setAttribute("aria-pressed", String(vozLigada));
        btnVoz.setAttribute("aria-label", vozLigada ? "Resposta em voz ligada" : "Resposta em voz desligada");
        btnVoz.textContent = vozLigada ? "🔊" : "🔇";
        if (!vozLigada) pararFala();
    });

    function adicionar(texto, tipo, fonte) {
        const div = document.createElement("div");
        div.className = "msg msg-" + tipo;
        div.textContent = texto;
        if (fonte) {
            const s = document.createElement("span");
            s.className = "fonte-msg";
            s.textContent = fonte;
            div.appendChild(s);
        }
        lista.appendChild(div);
        lista.scrollTop = lista.scrollHeight;
        return div;
    }

    /* Voz (gratuita, do navegador) */
    function pararFala() {
        if ("speechSynthesis" in window) speechSynthesis.cancel();
        avatar.classList.remove("falando");
    }
    function falar(texto) {
        if (!vozLigada || !("speechSynthesis" in window)) return;
        if (window.pararLeitura) window.pararLeitura();
        pararFala();
        const u = new SpeechSynthesisUtterance(texto.replace(/[☀️🔆•]/g, ""));
        u.lang = "pt-BR"; u.rate = 1.03; u.pitch = 1.05;
        const v = window.vozPtBr ? window.vozPtBr() : null;
        if (v) u.voice = v;
        u.onstart = () => avatar.classList.add("falando");
        u.onend = u.onerror = () => avatar.classList.remove("falando");
        speechSynthesis.speak(u);
    }

    async function processar(texto) {
        texto = (texto || "").trim();
        if (!texto || ocupado) return;
        ocupado = true;
        adicionar(texto, "user");
        campo.value = "";
        const pensando = adicionar("Marina está pensando…", "bot");
        pensando.classList.add("pensando");
        status.textContent = "Pensando…";

        let resposta = await perguntarIA(texto);
        let fonte = "IA online gratuita";
        if (!resposta) { resposta = respostaLocal(texto); fonte = "Modo offline · base do projeto"; }
        resposta = limpar(resposta);

        historico.push({ role: "user", content: texto }, { role: "assistant", content: resposta });
        pensando.remove();
        adicionar(resposta, "bot", fonte);
        status.textContent = fonte === "IA online gratuita" ? "Online · gratuita" : "Modo offline";
        falar(resposta);
        ocupado = false;
    }

    form.addEventListener("submit", (e) => { e.preventDefault(); processar(campo.value); });
    painel.querySelectorAll(".sugestoes button").forEach((b) => b.addEventListener("click", () => processar(b.textContent)));

    /* Microfone (reconhecimento de voz do navegador) */
    const Reconhecimento = window.SpeechRecognition || window.webkitSpeechRecognition;
    let rec = null, ouvindo = false;
    if (Reconhecimento) {
        rec = new Reconhecimento();
        rec.lang = "pt-BR";
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        rec.onresult = (e) => processar(e.results[0][0].transcript);
        rec.onend = () => { ouvindo = false; btnMic.setAttribute("aria-pressed", "false"); btnMic.setAttribute("aria-label", "Perguntar por voz"); };
        rec.onerror = (e) => {
            if (e.error === "no-speech") adicionar("Não consegui te ouvir. Pode tentar de novo?", "bot");
            else if (e.error === "not-allowed") adicionar("Permita o uso do microfone no navegador para falar comigo.", "bot");
        };
    }
    btnMic.addEventListener("click", () => {
        if (!rec) { adicionar("Seu navegador não suporta reconhecimento de voz. Use o Chrome ou o Edge, ou digite sua pergunta.", "bot"); return; }
        if (ouvindo) { rec.stop(); return; }
        try {
            pararFala();
            rec.start();
            ouvindo = true;
            btnMic.setAttribute("aria-pressed", "true");
            btnMic.setAttribute("aria-label", "Ouvindo… clique para parar");
        } catch (e) { /* já iniciado */ }
    });
})();
