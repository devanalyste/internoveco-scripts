/* Campus Internoveco — script du quiz v1.2.4 (8 nov. 2026), copie lisible.
   Changement depuis 1.2.3 : quand le navigateur ressort la page d'exercice de sa mémoire
   (flèche Retour, retour dans l'onglet), la page s'actualise à l'arrivée et le quiz repart
   à neuf, comme l'annonce la fenêtre « Quitter » (aucune progression sauvegardée).
   Historique 1.2.3 (8 nov. 2026) :
   En ligne : servi par jsDelivr depuis ce dépôt (tag de version), ligne <script> dans le pied de page
   de la page gabarit « Exercices Template » (691bc191cb1e542c7478bd19).
   Changements depuis 1.2.2 (sondages) : les pourcentages s'affichent une seule fois, après la réponse
   du registre des statistiques (« … » pendant l'attente, puis fondu) ; si le registre ne répond pas
   en 3 secondes, on affiche les pourcentages de départ du CMS ; note « Basé sur les réponses des
   participants », avec le nombre de personnes seulement à partir de 20 (__ivcSondage).
   Historique 1.2.2 (2 nov. 2026) :
   Changements depuis 1.2.1 : __ivcCourt (libellés de la liste finale, repli sur le titre de groupe, texte raccourci à 140 caractères)
   et __ivcContexte (mise en situation affichée une fois dans une suite de cartes du même groupe, lien « Relire la mise en situation »). */
/* Campus Internoveco - quiz v1.2.2 (2 nov. 2026) : libellés de la liste finale + mise en situation affichée une fois */
/* 1.2.4 : page ressortie de la mémoire du navigateur → actualisation pour repartir à neuf */
window.addEventListener("pageshow", function (e) {
  e.persisted && location.reload();
});
/* Sondages (1.2.3) : réglages et affichage des pourcentages */
const __ivcSondage = {
  delaiRepli: 3000, // ms avant d'afficher les pourcentages de départ du CMS
  seuilNombre: 20, // le nombre de personnes s'affiche à partir de ce seuil
  // Pastille de pourcentage (créée vide, largeur fixe pour éviter que la boîte change de taille)
  pastille(option) {
    let t = option.querySelector(".answer-sondage-pct");
    t ||
      ((t = document.createElement("span")),
      (t.className = "answer-sondage-pct"),
      Object.assign(t.style, {
        marginLeft: "auto",
        paddingLeft: "12px",
        minWidth: "4.2em",
        textAlign: "right",
        fontWeight: "600",
        color: "#fbbb2e",
        whiteSpace: "nowrap",
        transition: "opacity .45s ease",
      }),
      option.appendChild(t));
    return t;
  },
  // Montre une valeur en fondu
  montrer(t, texte) {
    t.style.opacity = "0";
    t.textContent = texte;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => (t.style.opacity = "1"))
    );
  },
  // Repli : pourcentages de départ du CMS (gardés dans data-cms)
  afficherCms(carte) {
    carte.querySelectorAll(".answer-sondage-pct[data-cms]").forEach((t) =>
      __ivcSondage.montrer(t, t.dataset.cms + " %")
    );
  },
  note(n) {
    return (
      "Basé sur les réponses des participants" +
      (n >= __ivcSondage.seuilNombre ? " (" + n + " personnes)." : ".")
    );
  },
};
function __ivcCourt(t) {
  t = (t || "").replace(/\s+/g, " ").trim();
  if (t.length <= 140) return t;
  const c = t.slice(0, 140),
    i = c.lastIndexOf(" ");
  return (i > 80 ? c.slice(0, i) : c) + " …";
}
function __ivcContexte(c, p) {
  if (!c) return;
  const g = c.querySelector(".quiz-question-header-groupe");
  if (!g || !c.querySelector(".quiz-question-header")) return;
  const t = (g.textContent || "").replace(/\s+/g, " ").trim(),
    pg = p && p.querySelector(".quiz-question-header-groupe"),
    meme =
      !!t && !!pg && (pg.textContent || "").replace(/\s+/g, " ").trim() === t;
  let b = c.querySelector(".quiz-contexte-toggle");
  if (!meme) {
    g.style.display = "";
    b && (b.style.display = "none");
    return;
  }
  if (!b) {
    b = document.createElement("button");
    b.type = "button";
    b.className = "quiz-contexte-toggle";
    Object.assign(b.style, {
      background: "none",
      border: "0",
      padding: "0",
      margin: "0 0 8px",
      color: "#fbbb2e",
      textDecoration: "underline",
      fontSize: "15px",
      cursor: "pointer",
    });
    b.addEventListener("click", () => {
      const o = "none" === g.style.display;
      g.style.display = o ? "" : "none";
      b.textContent = o
        ? "Masquer la mise en situation"
        : "Relire la mise en situation";
    });
    g.parentNode.insertBefore(b, g);
  }
  g.style.display = "none";
  b.style.display = "";
  b.textContent = "Relire la mise en situation";
}
const __quizInit = function () {
  let e = 0,
    t = 0,
    n = [],
    o = {},
    r = {},
    a = null,
    s = null,
    i = null,
    c = null,
    l = !1,
    u = 0,
    d = [];
  function p(e) {
    const t = e.querySelector(".quiz-badge-sondage");
    return !t || t.classList.contains("w-condition-invisible") ? null : t;
  }
  function f(e) {
    return null !== p(e);
  }
  function y(e) {
    const t = e.querySelector(".quiz-sondage-pourcentages"),
      n = (t?.textContent || "").trim();
    return n
      ? n
          .split(";")
          .map((e) => e.trim().replace(",", "."))
          .filter((e) => "" !== e)
          .map(Number)
      : [];
  }
  let m = null;
  async function q() {
    if (m) return m;
    try {
      if (window.Outseta && "function" == typeof window.Outseta.getUser) {
        const e = await window.Outseta.getUser();
        if (e && e.Uid) return (m = "o-" + e.Uid), m;
      }
    } catch (e) {}
    try {
      let e = localStorage.getItem("campus-stats-id");
      e ||
        ((e =
          "a-" +
          Math.random().toString(36).slice(2, 10) +
          Date.now().toString(36)),
        localStorage.setItem("campus-stats-id", e)),
        (m = e);
    } catch (e) {
      m = "a-" + Math.random().toString(36).slice(2, 12);
    }
    return m;
  }
  async function b(e, t, n = 0) {
    try {
      const n = new AbortController(),
        o = setTimeout(() => n.abort(), 5e3),
        r = await fetch("https://campus-stats.devanalyste.workers.dev" + e, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(t),
          signal: n.signal,
        });
      if ((clearTimeout(o), !r.ok)) throw new Error("HTTP " + r.status);
      return await r.json();
    } catch (o) {
      return n < 1 ? b(e, t, n + 1) : null;
    }
  }
  async function g(e, t, n, o) {
    const r = {
      userId: await q(),
      quizId: t,
      questionIndex: Number.parseInt(e.dataset.originalIndex),
      selectedAnswers: n,
      isCorrect: o,
    };
    if (null === o) {
      const t = y(e),
        n = e.querySelectorAll(".quiz-answer-option");
      t.length > 0 &&
        ((r.priors = {}),
        n.forEach((e, n) => {
          const o = e.getAttribute("data-answer-id");
          o && n < t.length && !Number.isNaN(t[n]) && (r.priors[o] = t[n]);
        }));
    }
    const sondage = null === o;
    let fini = !1,
      repli = null;
    sondage &&
      (repli = setTimeout(() => {
        fini || ((fini = !0), __ivcSondage.afficherCms(e));
      }, __ivcSondage.delaiRepli));
    const a = await b("/answer", r);
    if (sondage) {
      if (fini) return; // le repli est déjà affiché : on ne change plus rien
      (fini = !0), clearTimeout(repli);
      if (!a || !a.enough) return void __ivcSondage.afficherCms(e);
    }
    a &&
      a.enough &&
      (function (e, t, n, o) {
        const r = e.querySelectorAll(".quiz-answer-option");
        r.forEach((e) => {
          const n = e.getAttribute("data-answer-id"),
            r = t && void 0 !== t[n] ? t[n] : 0;
          if (o)
            return void __ivcSondage.montrer(__ivcSondage.pastille(e), r + " %");
          let a = e.querySelector(".answer-stat-pct");
          a ||
            ((a = document.createElement("span")),
            (a.className = "answer-stat-pct"),
            Object.assign(a.style, {
              marginLeft: "auto",
              paddingLeft: "12px",
              fontSize: "13px",
              fontWeight: "500",
              color: "#9a9a9a",
              whiteSpace: "nowrap",
            }),
            e.appendChild(a)),
            (a.textContent = r + " %"),
            (a.title = r + " % des participants ont choisi cette réponse");
        });
        const a = e.querySelector(".quiz-answers-list");
        if (a && !e.querySelector(".quiz-stats-note")) {
          const e = document.createElement("div");
          (e.className = "quiz-stats-note"),
            (e.textContent = o
              ? __ivcSondage.note(n)
              : "Pourcentage des participants ayant choisi chaque réponse (" +
                n +
                " personnes)."),
            Object.assign(e.style, {
              color: "#8a8a8a",
              fontSize: "12px",
              fontStyle: "italic",
              marginTop: "8px",
              textAlign: "left",
            }),
            a.insertAdjacentElement("afterend", e);
        }
      })(e, a.percents, a.participants, null === o);
  }
  function h() {
    const e = document.querySelector(".quiz-progress-quit");
    e
      ? e.addEventListener("click", function (e) {
          e.preventDefault(),
            (function () {
              if (document.querySelector(".quiz-quit-modal")) return;
              const e = (function () {
                const e = document.createElement("div");
                (e.className = "quiz-quit-modal"),
                  Object.assign(e.style, {
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    zIndex: "10000",
                  });
                const t = document.createElement("div");
                (t.className = "quiz-quit-modal-backdrop"),
                  Object.assign(t.style, {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    opacity: "0",
                    transition: "opacity 0.3s ease",
                  });
                const n = document.createElement("div");
                (n.className = "quiz-quit-modal-content"),
                  Object.assign(n.style, {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) scale(0.9)",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid rgba(251, 187, 46, 0.3)",
                    borderRadius: "16px",
                    padding: "40px",
                    maxWidth: "450px",
                    width: "90%",
                    textAlign: "center",
                    opacity: "0",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                  }),
                  (n.innerHTML =
                    '\n            <div style="font-size: 48px; margin-bottom: 16px;">&#9888;&#65039;</div>\n            <h3 style="color: #ffffff; font-size: 22px; margin: 0 0 12px 0; font-weight: 700;">Quitter l\'exercice ?</h3>\n            <p style="color: #aaaaaa; font-size: 15px; line-height: 1.5; margin: 0 0 28px 0;">La progression ne sera pas sauvegardée si vous quittez maintenant. Voulez-vous continuer ?</p>\n            <div style="display: flex; gap: 12px; justify-content: center;">\n                <button class="quiz-quit-btn-cancel" style="padding: 12px 24px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: #ffffff; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s;">Non, je continue</button>\n                <button class="quiz-quit-btn-confirm" style="padding: 12px 24px; border-radius: 8px; border: none; background: #fbbb2e; color: #000000; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s;">Oui, quitter</button>\n            </div>\n        '),
                  e.appendChild(t),
                  e.appendChild(n);
                const o = n.querySelector(".quiz-quit-btn-cancel"),
                  r = n.querySelector(".quiz-quit-btn-confirm");
                return (
                  o.addEventListener("click", () => v(e)),
                  t.addEventListener("click", () => v(e)),
                  r.addEventListener("click", () => {
                    window.location.href = "/services/campus-internoveco";
                  }),
                  e
                );
              })();
              document.body.appendChild(e),
                (document.body.style.overflow = "hidden"),
                setTimeout(() => {
                  (e.querySelector(".quiz-quit-modal-backdrop").style.opacity =
                    "1"),
                    (e.querySelector(".quiz-quit-modal-content").style.opacity =
                      "1"),
                    (e.querySelector(
                      ".quiz-quit-modal-content",
                    ).style.transform = "translate(-50%, -50%) scale(1)");
                }, 10);
            })();
        })
      : console.warn("⚠️ Bouton Quitter non trouvé");
  }
  function v(e) {
    const t = e.querySelector(".quiz-quit-modal-backdrop"),
      n = e.querySelector(".quiz-quit-modal-content");
    t && (t.style.opacity = "0"),
      n &&
        ((n.style.opacity = "0"),
        (n.style.transform = "translate(-50%, -50%) scale(0.9)")),
      (document.body.style.overflow = ""),
      setTimeout(() => {
        e.remove();
      }, 300);
  }
  function S(e) {
    const t = e.length,
      n = [],
      o = [],
      r = [];
    e.forEach((e) => {
      const a = e.getAttribute("data-groupe-ordre");
      if (!a) return void o.push(e);
      const s = Number.parseInt(a, 10);
      return Number.isNaN(s)
        ? (console.error(
            `❌ [Shuffle] data-groupe-ordre invalide (pas un nombre): "${a}"`,
            e,
          ),
          void r.push(e))
        : s < 1 || s > t
          ? (console.error(
              `❌ [Shuffle] data-groupe-ordre hors limites: ${s} (attendu: 1 à ${t})`,
              e,
            ),
            void r.push(e))
          : void n.push({ card: e, position: s - 1 });
    });
    for (let e = o.length - 1; e > 0; e--) {
      const t = Math.floor(Math.random() * (e + 1));
      [o[e], o[t]] = [o[t], o[e]];
    }
    const a = new Array(t);
    n.forEach(({ card: e, position: t }) => {
      if (void 0 !== a[t]) {
        const n = t + 1;
        return (
          console.error(
            `❌ [Shuffle] Doublon de data-groupe-ordre=${n} — 2 cartes visent la même position`,
            e,
          ),
          void r.push(e)
        );
      }
      a[t] = e;
    });
    const s = [...o, ...r];
    let i = 0;
    for (let e = 0; e < a.length; e++) !a[e] && i < s.length && (a[e] = s[i++]);
    const c = a.filter((e) => void 0 !== e);
    return (
      c.length !== t &&
        console.error(
          `❌ [Shuffle] ${t - c.length} carte(s) perdue(s) — vérifie tes data-groupe-ordre dans le CMS Webflow`,
        ),
      c
    );
  }
  function x() {
    n.forEach((e) => {
      e.style.display = "none";
    });
  }
  function z(e) {
    e &&
      (e.querySelectorAll("iframe").forEach((e) => {
        !e.dataset.videoSrc &&
          e.src &&
          "about:blank" !== e.src &&
          (e.dataset.videoSrc = e.src),
          e.src && "about:blank" !== e.src && (e.src = "about:blank");
      }),
      e.querySelectorAll("video").forEach((e) => {
        e.pause(), (e.currentTime = 0);
      }));
  }
  function E() {
    z(n[e]);
  }
  function w(m) {
    var q;
    m < 0 || m >= t
      ? console.error(`❌ Index invalide: ${m}`)
      : (E(),
        x(),
        (n[m].style.display = "block"),
        __ivcContexte(n[m], n[m - 1]),
        (q = n[m]) &&
          q.querySelectorAll("iframe").forEach((e) => {
            e.dataset.videoSrc &&
              e.src !== e.dataset.videoSrc &&
              (e.src = e.dataset.videoSrc);
          }),
        (e = m),
        (l = !1),
        (o[m] = []),
        window.scrollTo({ top: 0, behavior: "smooth" }),
        (function () {
          const n = 0 === e,
            o = e === t - 1;
          a.forEach((e) => {
            (e.style.opacity = n ? "0.3" : "1"),
              (e.style.pointerEvents = n ? "none" : "auto");
          }),
            s.forEach((e) => {
              (e.textContent = o ? "Terminer l'analyse" : "Question Suivante"),
                (e.style.opacity = "0.3"),
                (e.style.pointerEvents = "none");
            }),
            (function () {
              const n = ((e + 1) / t) * 100;
              i && (i.style.width = n + "%");
              c && (c.textContent = `${e + 1} / ${t}`);
            })();
        })(),
        (function () {
          const t = n[e];
          t.querySelectorAll(".quiz-answer-option").forEach((e) => {
            e.classList.remove("selected"),
              (e.style.border = ""),
              (e.style.backgroundColor = ""),
              (e.style.opacity = "1"),
              (e.style.pointerEvents = "auto");
            const t = e.querySelector(".answer-checkbox");
            t &&
              ((t.style.backgroundColor = "transparent"), (t.innerHTML = ""));
          });
          const o = t.querySelector(".quiz-explanation-box");
          o &&
            ((o.style.display = "none"),
            o.classList.remove(
              "explanation-correct",
              "explanation-incorrect",
              "explanation-neutral",
            ));
          t.querySelectorAll(
            ".answer-sondage-pct, .answer-stat-pct, .quiz-stats-note",
          ).forEach((e) => e.remove());
          const r = t.querySelector(".quiz-validate-button");
          r && (r.style.display = "none");
        })(),
        (function (e) {
          const t = p(e);
          t && (t.textContent = y(e).length > 0 ? "Sondage" : "Réflexion");
        })(n[m]),
        (function (e) {
          const t = e.querySelector(".quiz-multi-hint");
          if (
            (t && t.remove(),
            !(
              e.querySelector("[data-question-type]")?.dataset.questionType ||
              ""
            ).includes("multiple"))
          )
            return;
          const n = e.querySelector(".quiz-answers-list");
          if (!n) return;
          const o = document.createElement("div");
          (o.className = "quiz-multi-hint"),
            (o.textContent = "Plusieurs réponses possibles"),
            Object.assign(o.style, {
              color: "#fbbb2e",
              fontSize: "13px",
              fontStyle: "italic",
              letterSpacing: "0.04em",
              textAlign: "center",
              margin: "0 0 10px 0",
            }),
            n.parentNode.insertBefore(o, n);
        })(n[m]),
        (function () {
          const t = n[e],
            r = t.querySelectorAll(".quiz-answer-option"),
            a = t.querySelector("[data-question-type]"),
            s = a ? a.getAttribute("data-question-type") : "",
            i = s.includes("multiple");
          r.forEach((t) => {
            const r = t.cloneNode(!0);
            t.parentNode.replaceChild(r, t),
              r.addEventListener("click", function () {
                !(function (t, r) {
                  const a = t.getAttribute("data-answer-id");
                  if (r) {
                    const n = t.classList.contains("selected");
                    n
                      ? (t.classList.remove("selected"),
                        k(t),
                        o[e] && (o[e] = o[e].filter((e) => e !== a)))
                      : (t.classList.add("selected"),
                        C(t),
                        o[e] || (o[e] = []),
                        o[e].push(a)),
                      (function (e, t) {
                        const n = e.querySelector(".answer-checkbox");
                        n &&
                          (t
                            ? ((n.style.backgroundColor = "#fbbb2e"),
                              (n.innerHTML = "✓"),
                              (n.style.color = "#000000"))
                            : ((n.style.backgroundColor = "transparent"),
                              (n.innerHTML = "")));
                      })(t, !n);
                  } else {
                    const r = n[e],
                      s = t.classList.contains("selected");
                    r.querySelectorAll(".quiz-answer-option").forEach((e) => {
                      e.classList.remove("selected"), k(e);
                    }),
                      s
                        ? (o[e] = [])
                        : (t.classList.add("selected"), C(t), (o[e] = [a]));
                  }
                  !(function () {
                    const t = n[e],
                      r = t.querySelector(".quiz-validate-button"),
                      a = o[e]?.length > 0;
                    r && (r.style.display = a ? "block" : "none");
                  })();
                })(r, i);
              }),
              (r.style.cursor = "pointer");
          });
        })(),
        (function () {
          const t = n[e],
            a = t.querySelector(".quiz-validate-button");
          if (!a) return;
          a.style.display = "none";
          const s = a.cloneNode(!0);
          a.parentNode.replaceChild(s, a),
            s.addEventListener("click", async () => {
              if (!o[e]?.length) return;
              s.disabled = !0;
              const a = s.textContent;
              (s.textContent = "Validation..."),
                await (async function () {
                  const t = o[e] || [],
                    a =
                      document.querySelector("[data-quiz-id]")?.dataset.quizId;
                  if (!a)
                    return (
                      console.error("❌ data-quiz-id manquant"),
                      alert("Erreur: Configuration du quiz invalide."),
                      !1
                    );
                  const s = n[e];
                  if (f(s)) {
                    const o =
                      s.querySelector("[data-question-text]")?.textContent ||
                      s.querySelector(".quiz-question-header")?.textContent ||
                      s.querySelector(".quiz-question-title-groupe")
                        ?.textContent ||
                      `Question ${e + 1}`;
                    return (
                      (r[e] = {
                        isCorrect: null,
                        nonScored: !0,
                        questionText: __ivcCourt(o),
                      }),
                      (d = n.map((e, t) => r[t]).filter(Boolean)),
                      (function (t, o) {
                        const r = n[e],
                          a = r.querySelectorAll(".quiz-answer-option");
                        a.forEach((e, n) => {
                          const r = e.getAttribute("data-answer-id");
                          if (
                            (t.includes(r)
                              ? ((e.style.border = "2px solid #fbbb2e"),
                                (e.style.backgroundColor =
                                  "rgba(251, 187, 46, 0.12)"))
                              : (e.style.opacity = "0.6"),
                            o.length > 0 && n < o.length && !Number.isNaN(o[n]))
                          ) {
                            const t = __ivcSondage.pastille(e);
                            (t.dataset.cms = String(o[n]).replace(".", ",")),
                              (t.style.opacity = "0.45"),
                              (t.textContent = "…");
                          }
                        });
                      })(t, y(s)),
                      L(null),
                      A(),
                      g(s, a, t, null),
                      !0
                    );
                  }
                  try {
                    const o = await fetch(
                      "https://quiz-validator.devanalyste.workers.dev/validate-question",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          quizId: a,
                          questionIndex: Number.parseInt(
                            n[e].dataset.originalIndex,
                          ),
                          selectedAnswers: t,
                        }),
                      },
                    );
                    if (!o.ok) throw new Error(`Erreur serveur: ${o.status}`);
                    const s = await o.json();
                    void 0 !== r[e] && r[e].isCorrect && u--,
                      s.isCorrect && u++;
                    const i = n[e],
                      c =
                        i.querySelector("[data-question-text]")?.textContent ||
                        i.querySelector(".quiz-question-header")?.textContent ||
                        i.querySelector(".quiz-question-title-groupe")
                          ?.textContent ||
                        `Question ${e + 1}`;
                    return (
                      (r[e] = {
                        isCorrect: s.isCorrect,
                        questionText: __ivcCourt(c),
                      }),
                      (d = n.map((e, t) => r[t]).filter(Boolean)),
                      (function (t, o, r) {
                        const a = n[e],
                          s = a.querySelectorAll(".quiz-answer-option"),
                          i =
                            a.querySelector("[data-question-type]")?.dataset
                              .questionType || "",
                          c = i.includes("multiple"),
                          l = Array.from(s).map((e) =>
                            e.getAttribute("data-answer-id"),
                          );
                        0 === o.filter((e) => l.includes(e)).length &&
                          o.length > 0 &&
                          (console.warn(
                            "⚠️ MISMATCH - Aucune bonne réponse du serveur ne correspond au DOM",
                          ),
                          console.warn("  IDs serveur (correctAnswers):", o),
                          console.warn("  IDs DOM (data-answer-id):", l));
                        s.forEach((e) => {
                          const n = e.getAttribute("data-answer-id"),
                            a = o.includes(n),
                            s = t.includes(n);
                          a && c && !s && !1 === r
                            ? ((e.style.border = "2px dashed #ff0004"),
                              (e.style.backgroundColor =
                                "rgba(255, 0, 4, 0.06)"))
                            : a
                              ? ((e.style.border = "2px solid #5fff47"),
                                (e.style.backgroundColor =
                                  "rgba(95, 255, 71, 0.1)"))
                              : s
                                ? ((e.style.border = "2px solid #ff0004"),
                                  (e.style.backgroundColor =
                                    "rgba(255, 0, 4, 0.1)"))
                                : (e.style.opacity = "0.4");
                        });
                      })(t, s.correctAnswers, s.isCorrect),
                      L(s.isCorrect),
                      A(),
                      g(i, a, t, s.isCorrect),
                      s.isCorrect
                    );
                  } catch (e) {
                    return (
                      console.error("❌ Erreur validation:", e),
                      alert(
                        "Erreur lors de la validation. Veuillez réessayer.",
                      ),
                      !1
                    );
                  }
                })(),
                (l = !0),
                (s.style.display = "none"),
                (s.disabled = !1),
                (s.textContent = a);
              const i = t.querySelector(".quiz-btn-primary");
              i && ((i.style.opacity = "1"), (i.style.pointerEvents = "auto"));
            });
        })(),
        (function () {
          const t = n[e],
            o = t.querySelector("[data-question-type]"),
            r = o?.dataset.questionType || "",
            a = t.querySelectorAll(".quiz-answer-option"),
            s =
              null !== t.querySelector(".quiz-show-letters-marker") &&
              "vrai_ou_faux" !== r;
          a.forEach((e, t) => {
            const n = e.querySelector(".answer-letter-badge"),
              o = e.querySelector(".text"),
              r = String.fromCodePoint(97 + t) + ")",
              a = o?.querySelector(".letter-inline");
            if ((a && a.remove(), s))
              if (o) {
                const e = document.createElement("span");
                (e.className = "letter-inline"),
                  (e.style.color = "var(--yellow, #fbbb2e)"),
                  (e.textContent = r + " "),
                  o.prepend(e),
                  n && ((n.style.display = "none"), (n.textContent = ""));
              } else n && ((n.style.display = "flex"), (n.textContent = r));
            else n && ((n.style.display = "none"), (n.textContent = ""));
          });
        })(),
        (function () {
          const t = n[e];
          if (!t) return;
          t.querySelectorAll("img").forEach((e) => {
            e.closest(".answer-letter-badge") ||
              ((e.style.cursor = "zoom-in"),
              "true" !== e.dataset.zoomBound &&
                ((e.dataset.zoomBound = "true"),
                e.addEventListener("click", () =>
                  (function (e, t) {
                    if (document.querySelector(".quiz-image-lightbox")) return;
                    const n = document.createElement("div");
                    (n.className = "quiz-image-lightbox"),
                      Object.assign(n.style, {
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                        zIndex: "10001",
                        opacity: "0",
                        transition: "opacity 0.2s ease",
                        overflow: "auto",
                        WebkitOverflowScrolling: "touch",
                      });
                    const o = document.createElement("img");
                    (o.src = e), t && (o.alt = t);
                    Object.assign(o.style, {
                      width: "100vw",
                      height: "auto",
                      display: "block",
                      cursor: "grab",
                      userSelect: "none",
                      WebkitUserDrag: "none",
                    }),
                      (o.draggable = !1);
                    let r = !1,
                      a = !1,
                      s = 0,
                      i = 0,
                      c = 0,
                      l = 0;
                    o.addEventListener("mousedown", (e) => {
                      (r = !0),
                        (a = !1),
                        (s = e.clientX),
                        (i = e.clientY),
                        (c = n.scrollLeft),
                        (l = n.scrollTop),
                        (o.style.cursor = "grabbing"),
                        e.preventDefault();
                    });
                    const u = (e) => {
                        if (!r) return;
                        const t = e.clientX - s,
                          o = e.clientY - i;
                        (Math.abs(t) > 3 || Math.abs(o) > 3) && (a = !0),
                          (n.scrollLeft = c - t),
                          (n.scrollTop = l - o);
                      },
                      d = () => {
                        r && ((r = !1), (o.style.cursor = "grab"));
                      };
                    document.addEventListener("mousemove", u),
                      document.addEventListener("mouseup", d),
                      o.addEventListener("click", (e) => {
                        e.stopPropagation(), (a = !1);
                      });
                    const p = document.createElement("button");
                    (p.textContent = "×"),
                      p.setAttribute("aria-label", "Fermer"),
                      Object.assign(p.style, {
                        position: "absolute",
                        top: "20px",
                        right: "30px",
                        background: "transparent",
                        border: "none",
                        color: "#fff",
                        fontSize: "48px",
                        lineHeight: "1",
                        cursor: "pointer",
                        padding: "0",
                      }),
                      n.append(o, p),
                      document.body.appendChild(n),
                      (document.body.style.overflow = "hidden"),
                      requestAnimationFrame(() => {
                        n.style.opacity = "1";
                      });
                    const f = () => {
                        (n.style.opacity = "0"),
                          document.removeEventListener("mousemove", u),
                          document.removeEventListener("mouseup", d),
                          document.removeEventListener("keydown", y),
                          setTimeout(() => {
                            n.remove(), (document.body.style.overflow = "");
                          }, 200);
                      },
                      y = (e) => {
                        "Escape" === e.key && f();
                      };
                    n.addEventListener("click", () => {
                      a ? (a = !1) : f();
                    }),
                      document.addEventListener("keydown", y);
                  })(e.src, e.alt),
                )));
          });
        })());
  }
  function C(e) {
    (e.style.border = "2px solid #fbbb2e"),
      (e.style.backgroundColor = "rgba(251, 187, 46, 0.1)");
  }
  function k(e) {
    (e.style.border = ""), (e.style.backgroundColor = "");
  }
  function L(t) {
    const o = n[e].querySelector(".quiz-explanation-box");
    o &&
      ((o.style.display = "block"),
      o.classList.toggle("explanation-neutral", null === t),
      o.classList.toggle("explanation-correct", !0 === t),
      o.classList.toggle("explanation-incorrect", !1 === t));
  }
  function A() {
    n[e].querySelectorAll(".quiz-answer-option").forEach((e) => {
      e.style.pointerEvents = "none";
    });
  }
  !(function () {
    n = Array.from(document.querySelectorAll(".quiz-question-card"));
    const p = new Set(),
      y = [];
    n.forEach((e) => {
      p.has(e) ? y.push(e) : p.add(e);
    }),
      y.length > 0 &&
        (console.error(
          `❌ [initQuiz] ${y.length} carte(s) dupliquée(s) détectée(s) dans le DOM — vérifie si une Collection List est présente en double dans le template Webflow`,
          y,
        ),
        (n = Array.from(p))),
      n.forEach((e, t) => (e.dataset.originalIndex = t));
    const m = document.querySelector("[data-quiz-id]");
    if (("true" === m?.dataset.shuffle && (n = S(n)), (t = n.length), 0 === t))
      return void console.error("❌ Aucune question trouvée!");
    (i = document.querySelector(".quiz-progress-bar-fill")),
      (c = document.querySelector(".quiz-progress-counter"));
    const g = document.querySelector(".quiz-progress-label");
    g && (g.textContent = "PROGRESSION"),
      (u = 0),
      (d = []),
      (r = {}),
      x(),
      n.forEach(z),
      (a = document.querySelectorAll(".quiz-btn-secondary")),
      (s = document.querySelectorAll(".quiz-btn-primary")),
      a.length,
      s.length,
      a.forEach((t) => {
        t.addEventListener("click", function (t) {
          t.preventDefault(), e > 0 && w(e - 1);
        });
      }),
      s.forEach((a) => {
        a.addEventListener("click", function (a) {
          a.preventDefault(),
            l &&
              (e < t - 1
                ? w(e + 1)
                : (function () {
                    E();
                    const e = u,
                      t = n.filter((e) => !f(e)).length;
                    if (0 === t)
                      return void console.error(
                        "❌ Impossible d'afficher les résultats : aucune question",
                      );
                    const a = Math.round((e / t) * 100);
                    let s, i, c;
                    100 === a
                      ? ((s = "PARFAIT !"),
                        (i = "FÉLICITATIONS !"),
                        (c = "Vous maîtrisez parfaitement ce sujet !"))
                      : a >= 75
                        ? ((s = "EXCELLENT !"),
                          (i = "TRÈS BIEN JOUÉ !"),
                          (c =
                            "Vous êtes presque au sommet, continuez ainsi !"))
                        : a >= 50
                          ? ((s = "À PERFECTIONNER"),
                            (i = "ENCORE UN PETIT EFFORT !"),
                            (c =
                              "Vous êtes sur la bonne voie. Une petite révision vous permettra d'atteindre le niveau expert."))
                          : a >= 25
                            ? ((s = "À REVOIR"),
                              (i = "CONTINUEZ VOS EFFORTS !"),
                              (c =
                                "Une révision approfondie vous permettra de progresser."))
                            : ((s = "DÉBUT DU PARCOURS"),
                              (i = "NE LÂCHEZ PAS !"),
                              (c =
                                "Chaque expert a commencé comme vous. Continuez à apprendre !"));
                    const l = document.querySelector("[data-quiz-container]");
                    l && (l.style.display = "none");
                    const p = document.querySelector("[data-quiz-results]");
                    if (p) {
                      p.style.display = "flex";
                      const l = p.querySelector("[data-quiz-score]");
                      l && (l.textContent = `${e} / ${t}`);
                      const f = p.querySelector("[data-quiz-percent]");
                      f && (f.textContent = `${a}%`);
                      const y = p.querySelector("[data-quiz-badge]");
                      y && (y.textContent = s);
                      const m = p.querySelector("[data-quiz-title]");
                      m && (m.textContent = i);
                      const g = p.querySelector("[data-quiz-subtitle]");
                      g && (g.textContent = c);
                      const h = p.querySelector(".quiz-results-compare");
                      h && h.remove();
                      const v =
                        document.querySelector("[data-quiz-id]")?.dataset
                          .quizId;
                      v &&
                        (async function (e, t, n, o) {
                          const r = await q(),
                            a = await b("/score", {
                              userId: r,
                              quizId: e,
                              score: t,
                              total: n,
                            });
                          if (!a || !o) return;
                          let s = o.querySelector(".quiz-results-compare");
                          if (!s) {
                            (s = document.createElement("p")),
                              (s.className = "quiz-results-compare"),
                              Object.assign(s.style, {
                                color: "#bdbdbd",
                                fontSize: "15px",
                                lineHeight: "1.5",
                                margin: "12px auto 0",
                                maxWidth: "520px",
                                textAlign: "center",
                              });
                            const e = o.querySelector("[data-quiz-subtitle]");
                            e
                              ? e.insertAdjacentElement("afterend", s)
                              : o.appendChild(s);
                          }
                          if (!a.enough)
                            return void (s.textContent =
                              "Vous êtes parmi les premiers à faire cet exercice. La comparaison avec les autres participants s'affichera dès 5 participants.");
                          let i =
                            "Moyenne des participants : " + a.average + " %.";
                          null !== a.betterThan &&
                            void 0 !== a.betterThan &&
                            (a.betterThan >= 50
                              ? (i +=
                                  " Vous faites mieux que " +
                                  a.betterThan +
                                  " % d'entre eux.")
                              : (i +=
                                  " " +
                                  (100 - a.betterThan) +
                                  " % d'entre eux ont fait aussi bien ou mieux que vous.")),
                            (s.textContent = i);
                        })(v, e, t, p);
                      const x = p.querySelector(".quiz-results-cta");
                      x &&
                        ((x.innerHTML = "🔄 REFAIRE LE TEST"),
                        (x.onclick = (e) => {
                          e.preventDefault(),
                            (function () {
                              const e =
                                document.getElementById("confetti-container");
                              e && e.remove();
                              const t = document.querySelector(
                                "[data-quiz-results]",
                              );
                              t && (t.style.display = "none");
                              const a = document.querySelector(
                                "[data-quiz-container]",
                              );
                              a && (a.style.display = ""),
                                (o = {}),
                                (u = 0),
                                (d = []),
                                (r = {});
                              const s =
                                document.querySelector("[data-quiz-id]");
                              "true" === s?.dataset.shuffle && (n = S(n)), w(0);
                            })();
                        }));
                      const z = p.querySelector("[data-quiz-questions]");
                      z &&
                        ((z.innerHTML = ""),
                        d.forEach(
                          ({ isCorrect: e, nonScored: t, questionText: n }) => {
                            const o = document.createElement("div");
                            o.className = "quiz-result-question-item";
                            const r = document.createElement("span");
                            (r.className =
                              "quiz-result-dot " +
                              (t ? "neutral" : e ? "correct" : "incorrect")),
                              t && (r.style.backgroundColor = "#8a8a8a");
                            const a = document.createElement("span");
                            (a.textContent = n),
                              o.appendChild(r),
                              o.appendChild(a),
                              z.appendChild(o);
                          },
                        ));
                    }
                    a >= 75 && createConfetti();
                  })());
        });
      }),
      h(),
      w(e);
  })();
};
function createConfetti() {
  if (!document.getElementById("confetti-style")) {
    const e = document.createElement("style");
    (e.id = "confetti-style"),
      (e.textContent =
        "\n            @keyframes confetti-fall {\n                0%   { top: -10%; transform: rotate(0deg); }\n                100% { top: 110%; transform: rotate(720deg); }\n            }\n        "),
      document.head.appendChild(e);
  }
  const e = document.createElement("div");
  (e.id = "confetti-container"),
    Object.assign(e.style, {
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
      zIndex: "9999",
      overflow: "hidden",
    });
  const t = ["#FFD700", "#FFBA00", "#FFC107", "#F5B700", "#FFE566", "#ffffff"];
  for (let n = 0; n < 100; n++) {
    const n = document.createElement("div"),
      o = 10 * Math.random() + 5;
    Object.assign(n.style, {
      position: "absolute",
      width: o + "px",
      height: o + "px",
      backgroundColor: t[Math.floor(Math.random() * t.length)],
      opacity: "0.85",
      left: 100 * Math.random() + "%",
      top: "-10%",
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      transform: `rotate(${360 * Math.random()}deg)`,
      animation: `confetti-fall ${3 * Math.random() + 2}s linear infinite`,
      animationDelay: 2 * Math.random() + "s",
    }),
      e.appendChild(n);
  }
  document.body.appendChild(e), setTimeout(() => e.remove(), 2e4);
}
"loading" !== document.readyState
  ? __quizInit()
  : document.addEventListener("DOMContentLoaded", __quizInit);
