/* =========================================
   ACESSIBILIDADE
   - Tamanho da fonte, tema preto e branco, espaçamento,
     destaque de links, pausa de animações, leitura em voz alta
   Preferências salvas no navegador (localStorage)
========================================= */
(function () {
    "use strict";

    const html = document.documentElement;
    const CHAVE = "cep-acess";
    let pref = {};
    try { pref = JSON.parse(localStorage.getItem(CHAVE) || "{}"); } catch (e) { pref = {}; }

    function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(pref)); } catch (e) {} }

    const anunciador = document.createElement("div");
    anunciador.className = "sr-only";
    anunciador.setAttribute("aria-live", "polite");
    document.body.appendChild(anunciador);
    function anunciar(t) { anunciador.textContent = ""; setTimeout(() => (anunciador.textContent = t), 50); }

    const btn = (a) => document.querySelector('.barra-acess [data-acao="' + a + '"]');

    function aplicar() {
        html.setAttribute("data-tema", pref.tema || "padrao");
        html.style.setProperty("--escala", pref.fonte || 1);
        html.classList.toggle("a11y-espaco", !!pref.espaco);
        html.classList.toggle("a11y-links", !!pref.links);
        html.classList.toggle("a11y-sem-movimento", !!pref.movimento);

        const pb = pref.tema === "pb";
        btn("tema").setAttribute("aria-pressed", String(pb));
        btn("tema").querySelector(".tema-rotulo").textContent = pb ? "Tema colorido" : "Tema preto e branco";
        btn("espaco").setAttribute("aria-pressed", String(!!pref.espaco));
        btn("links").setAttribute("aria-pressed", String(!!pref.links));
        btn("movimento").setAttribute("aria-pressed", String(!!pref.movimento));

        document.querySelector('meta[name="theme-color"]').setAttribute("content", pb ? "#000000" : "#123f59");
        document.querySelectorAll("video").forEach((v) => { if (pref.movimento && !v.paused) v.pause(); });
    }

    const acoes = {
        "fonte-mais":  () => { pref.fonte = Math.min(1.5, +((pref.fonte || 1) + 0.1).toFixed(2)); anunciar("Texto aumentado"); },
        "fonte-menos": () => { pref.fonte = Math.max(0.85, +((pref.fonte || 1) - 0.1).toFixed(2)); anunciar("Texto diminuído"); },
        "fonte-reset": () => { pref.fonte = 1; anunciar("Tamanho de texto padrão"); },
        "tema":        () => { pref.tema = pref.tema === "pb" ? "padrao" : "pb"; anunciar(pref.tema === "pb" ? "Tema preto e branco ativado" : "Tema colorido ativado"); },
        "espaco":      () => { pref.espaco = !pref.espaco; anunciar(pref.espaco ? "Espaçamento ampliado" : "Espaçamento normal"); },
        "links":       () => { pref.links = !pref.links; anunciar(pref.links ? "Links destacados" : "Destaque de links desativado"); },
        "movimento":   () => { pref.movimento = !pref.movimento; anunciar(pref.movimento ? "Animações pausadas" : "Animações ativadas"); },
        "reset":       () => { pref = {}; pararLeitura(); anunciar("Preferências restauradas"); },
        "ler":         () => alternarLeitura()
    };

    document.querySelectorAll(".barra-acess [data-acao]").forEach((b) => {
        b.addEventListener("click", () => {
            const a = b.dataset.acao;
            acoes[a]();
            if (a !== "ler") { salvar(); aplicar(); }
        });
    });

    // Atalho: Alt + C alterna o tema preto e branco
    document.addEventListener("keydown", (e) => {
        if (e.altKey && (e.key === "c" || e.key === "C")) { e.preventDefault(); acoes.tema(); salvar(); aplicar(); }
    });

    /* ---------- LEITURA EM VOZ ALTA ---------- */
    const temVoz = "speechSynthesis" in window;
    let lendo = false;

    function vozPtBr() {
        const vozes = speechSynthesis.getVoices();
        return vozes.find((v) => /pt-BR/i.test(v.lang) && /google|luciana|francisca|natural/i.test(v.name))
            || vozes.find((v) => /pt-BR/i.test(v.lang))
            || vozes.find((v) => /^pt/i.test(v.lang));
    }
    window.vozPtBr = vozPtBr;

    function pararLeitura() {
        if (!temVoz) return;
        speechSynthesis.cancel();
        lendo = false;
        document.querySelectorAll(".lendo").forEach((el) => el.classList.remove("lendo"));
        const b = btn("ler");
        b.setAttribute("aria-pressed", "false");
        b.textContent = "🔊 Ler página";
        document.querySelectorAll(".btn-narrar").forEach((n) => { n.setAttribute("aria-pressed", "false"); n.textContent = "🔊 Ouvir narração"; });
    }
    window.pararLeitura = pararLeitura;

    function lerBlocos(blocos, aoTerminar) {
        let i = 0;
        const proximo = () => {
            document.querySelectorAll(".lendo").forEach((el) => el.classList.remove("lendo"));
            if (!lendo || i >= blocos.length) { pararLeitura(); if (aoTerminar) aoTerminar(); return; }
            const el = blocos[i++];
            const texto = el.innerText.trim();
            if (!texto) return proximo();
            el.classList.add("lendo");
            if (el.getBoundingClientRect().top < 0 || el.getBoundingClientRect().bottom > innerHeight) {
                el.scrollIntoView({ block: "center", behavior: pref.movimento ? "auto" : "smooth" });
            }
            const u = new SpeechSynthesisUtterance(texto);
            u.lang = "pt-BR"; u.rate = 1;
            const v = vozPtBr(); if (v) u.voice = v;
            u.onend = proximo; u.onerror = proximo;
            speechSynthesis.speak(u);
        };
        proximo();
    }

    function alternarLeitura() {
        if (!temVoz) { anunciar("Seu navegador não suporta leitura em voz alta"); return; }
        if (lendo) { pararLeitura(); return; }
        pararLeitura();
        lendo = true;
        const b = btn("ler");
        b.setAttribute("aria-pressed", "true");
        b.textContent = "⏹ Parar leitura";
        const blocos = Array.from(document.querySelectorAll(
            "main h1, main h2, main .hero p, main .destaque, main .secao p:not(.sim-aviso), main .card h3, main .card > p, main .fluxo-item, main .etapa, main .pergunta summary, main .pergunta p, main .lista-beneficios li"
        )).filter((el) => el.offsetParent !== null);
        lerBlocos(blocos);
    }

    // Narração da transcrição do vídeo
    document.querySelectorAll(".btn-narrar").forEach((n) => {
        n.addEventListener("click", () => {
            if (!temVoz) { anunciar("Seu navegador não suporta leitura em voz alta"); return; }
            if (lendo) { pararLeitura(); return; }
            pararLeitura();
            lendo = true;
            n.setAttribute("aria-pressed", "true");
            n.textContent = "⏹ Parar narração";
            const alvo = document.getElementById(n.dataset.alvo);
            alvo.open = true;
            lerBlocos(Array.from(alvo.querySelectorAll(".transcricao-texto p")));
        });
    });

    if (temVoz) speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    window.addEventListener("beforeunload", () => { if (temVoz) speechSynthesis.cancel(); });

    aplicar();
})();
