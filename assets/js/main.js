/* =========================================
   NAVEGAÇÃO, MENU MOBILE, VOLTAR AO TOPO
========================================= */
(function () {
    "use strict";

    const links = document.querySelectorAll("#menu-principal a");
    const secoes = document.querySelectorAll("main section[id]");
    const menu = document.getElementById("menu-principal");
    const toggle = document.querySelector(".menu-toggle");
    const botaoTopo = document.getElementById("voltar-topo");

    // Link ativo conforme a seção visível
    if ("IntersectionObserver" in window) {
        const obs = new IntersectionObserver((entradas) => {
            entradas.forEach((e) => {
                if (!e.isIntersecting) return;
                links.forEach((l) => {
                    const ativo = l.getAttribute("href") === "#" + e.target.id;
                    l.classList.toggle("ativo", ativo);
                    if (ativo) l.setAttribute("aria-current", "true"); else l.removeAttribute("aria-current");
                });
            });
        }, { rootMargin: "-45% 0px -50% 0px" });
        secoes.forEach((s) => obs.observe(s));
    }

    // Menu mobile
    function fecharMenu() {
        menu.classList.remove("aberto");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menu");
    }
    toggle.addEventListener("click", () => {
        const aberto = menu.classList.toggle("aberto");
        toggle.setAttribute("aria-expanded", String(aberto));
        toggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
        if (aberto) links[0].focus();
    });
    links.forEach((l) => l.addEventListener("click", fecharMenu));
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && menu.classList.contains("aberto")) { fecharMenu(); toggle.focus(); }
    });

    // Voltar ao topo
    window.addEventListener("scroll", () => { botaoTopo.hidden = window.scrollY < 600; }, { passive: true });
    botaoTopo.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.querySelector(".identidade").focus();
    });
})();
