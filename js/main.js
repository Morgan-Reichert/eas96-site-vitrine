/* ==========================================================================
   EAS 96 Simulation — Scripts
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONFIGURATION — les seules valeurs à modifier
   -------------------------------------------------------------------------- */
const CONFIG = {
  // Date et heure d'ouverture du serveur.
  // Format : AAAA-MM-JJTHH:MM:SS+02:00  (+02:00 = heure d'été de Paris, +01:00 en hiver)
  launchDate: "2026-09-14T20:00:00+02:00",

  // Liens appliqués automatiquement à tous les éléments [data-link="clé"]
  links: {
    discord: "https://discord.gg/hyYrn5gmMf",
    // Espace candidat et recruteur (adresse Vercel, à changer si un domaine est branché)
    intranet: "https://eas96-intranet.vercel.app",
    instagram: "https://www.instagram.com/estuaire_armor_simulation96/",
    tiktok: "https://www.tiktok.com/@easimulation96",
    facebook: "https://www.facebook.com/profile.php?id=61593349161178",
    // À renseigner : le lien et le bloc correspondants apparaissent dès que l'adresse est remplie
    youtube: "https://www.youtube.com/@EAS-96",
    twitch: "",
    reglement: "",
  },

  // Page « Nos réseaux » : les trois dernières vidéos
  youtube: {
    // Mode automatique : identifiant de chaîne (UC…) et clé API YouTube restreinte à votre domaine
    channelId: "UCB6fe2854SQuDLuTwbEz7WQ",
    apiKey: "",
    // Mode manuel, utilisé si aucune clé n'est renseignée ; vidéo la plus récente en premier
    // { id: "identifiant de la vidéo", title: "Titre", date: "2026-09-14" }
    videos: [],
  },

  // Prochain direct Twitch (Twitch n'a pas d'API publique sans serveur : à renseigner à la main)
  twitch: {
    nextStream: null, // { title: "Garde SDIS", startsAt: "2026-09-20T21:00:00+02:00" }
  },
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Polices Google (même adresse que dans le script du <head>), chargées après accord
const GOOGLE_FONTS_URL = "https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@600;700&family=Inter:wght@400;500;600;700&display=swap";

// Définies par initStats et initSocial : déclenchées une fois l'accord donné
let loadDiscordCounts = () => {};
let loadSocialFeeds = () => {};

/* --------------------------------------------------------------------------
   Liens
   -------------------------------------------------------------------------- */
function initLinks() {
  document.querySelectorAll("[data-link]").forEach((link) => {
    const url = CONFIG.links[link.dataset.link];

    // Adresse non renseignée : on masque l'élément plutôt que de laisser un lien mort
    if (!url || url === "#") {
      (link.closest("[data-link-item]") || link).hidden = true;
      return;
    }

    link.href = url;
    if (/^https?:\/\//.test(url)) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  });
}

/* --------------------------------------------------------------------------
   Bandeau d'annonce (fermeture mémorisée, voir le script dans <head>)
   -------------------------------------------------------------------------- */
function initAnnounce() {
  const close = document.querySelector("[data-announce-close]");
  if (!close) return;

  close.addEventListener("click", () => {
    document.documentElement.classList.add("announce-closed");
    try {
      localStorage.setItem("eas96-announce-closed", "1");
    } catch (error) {
      // stockage indisponible : le bandeau reviendra au prochain chargement
    }
  });
}

/* --------------------------------------------------------------------------
   En-tête : état au défilement
   -------------------------------------------------------------------------- */
function initHeader() {
  const root = document.documentElement;
  const update = () => root.classList.toggle("has-scrolled", window.scrollY > 24);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* --------------------------------------------------------------------------
   Menu mobile
   -------------------------------------------------------------------------- */
function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) return;

  const label = toggle.querySelector("[data-nav-toggle-label]");
  const desktop = window.matchMedia("(min-width: 60em)"); // même point de rupture que style.css

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    if (label) label.textContent = open ? "Fermer le menu" : "Ouvrir le menu";
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("has-nav-open", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  desktop.addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
}

/* --------------------------------------------------------------------------
   Lien du menu actif selon la section visible
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const links = [...document.querySelectorAll('.nav a[href*="#"]')];
  if (!links.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href").split("#")[1] === entry.target.id);
        });
        document.querySelectorAll(".nav__item").forEach((item) => {
          item.querySelector("[data-menu-toggle]")?.classList.toggle("is-active", !!item.querySelector(".is-active"));
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------------
   Compte à rebours — chiffres façon panneau d'affichage
   -------------------------------------------------------------------------- */
function createFlip(el) {
  const value = el.textContent.trim();
  el.classList.add("flip");
  el.dataset.value = value;
  el.innerHTML =
    `<span class="sr-only" data-flip-text>${value}</span>` +
    `<span class="flip__half flip__half--top" aria-hidden="true"><span>${value}</span></span>` +
    `<span class="flip__half flip__half--bottom" aria-hidden="true"><span>${value}</span></span>`;
}

function createLeaf(position, value) {
  const leaf = document.createElement("span");
  leaf.className = `flip__half flip__half--${position} flip__leaf`;
  leaf.setAttribute("aria-hidden", "true");
  leaf.innerHTML = `<span>${value}</span>`;
  return leaf;
}

function setFlip(el, value) {
  const previous = el.dataset.value;
  if (previous === value) return;

  el.dataset.value = value;
  el.querySelector("[data-flip-text]").textContent = value;
  el.querySelectorAll(".flip__leaf").forEach((leaf) => leaf.remove());

  const top = el.querySelector(".flip__half--top span");
  const bottom = el.querySelector(".flip__half--bottom span");
  top.textContent = value;

  if (reducedMotion) {
    bottom.textContent = value;
    return;
  }

  // La moitié haute de l'ancien chiffre tombe, puis la moitié basse du nouveau se rabat
  bottom.textContent = previous;
  const leafTop = createLeaf("top", previous);
  const leafBottom = createLeaf("bottom", value);
  leafBottom.addEventListener(
    "animationend",
    () => {
      bottom.textContent = value;
      leafTop.remove();
      leafBottom.remove();
    },
    { once: true }
  );
  el.append(leafTop, leafBottom);
}

function initCountdown() {
  const target = new Date(CONFIG.launchDate).getTime();

  if (Number.isNaN(target)) {
    console.warn("CONFIG.launchDate invalide :", CONFIG.launchDate);
    return;
  }

  // « le lundi 14 septembre à 20h00 » et « lundi 14/09 à 20h00 »
  const timeZone = "Europe/Paris";
  const format = (options) => new Intl.DateTimeFormat("fr-FR", { ...options, timeZone }).format(target);
  const time = format({ hour: "2-digit", minute: "2-digit" }).replace(":", "h");
  const longDate = `le ${format({ weekday: "long", day: "numeric", month: "long" })} à ${time}`;
  const shortDate = `${format({ weekday: "long" })} ${format({ day: "2-digit", month: "2-digit" })} à ${time}`;

  document.querySelectorAll("[data-launch-date]").forEach((el) => (el.textContent = longDate));
  document.querySelectorAll("[data-launch-date-short]").forEach((el) => (el.textContent = shortDate));

  const values = document.querySelectorAll("[data-countdown] [data-unit]");
  values.forEach(createFlip);

  const pad = (n) => String(n).padStart(2, "0");

  const render = () => {
    const diff = Math.max(0, target - Date.now());
    const parts = {
      days: Math.floor(diff / 86400000),
      hours: Math.floor(diff / 3600000) % 24,
      minutes: Math.floor(diff / 60000) % 60,
      seconds: Math.floor(diff / 1000) % 60,
    };
    values.forEach((el) => setFlip(el, pad(parts[el.dataset.unit])));
    return diff === 0;
  };

  const launch = () => {
    document.querySelectorAll("[data-countdown]").forEach((countdown) => {
      countdown.classList.add("is-done");
      countdown.querySelector("[data-countdown-timer]")?.setAttribute("hidden", "");
      countdown.querySelector("[data-countdown-done]")?.removeAttribute("hidden");
    });
    document.querySelectorAll('[data-when="before"]').forEach((el) => (el.hidden = true));
    document.querySelectorAll('[data-when="after"]').forEach((el) => (el.hidden = false));
    document.documentElement.classList.add("is-launched");
  };

  // Mise à jour calée sur chaque seconde pleine
  (function tick() {
    if (render()) return launch();
    setTimeout(tick, 1000 - (Date.now() % 1000));
  })();
}

/* --------------------------------------------------------------------------
   Apparition des blocs au défilement
   -------------------------------------------------------------------------- */
function initReveal() {
  if (reducedMotion || !("IntersectionObserver" in window)) return;

  const selector =
    ".section__header, .split__text, .split__media, .stats__item, .card, .requirement, .step, " +
    ".gallery-filters, .gallery__item, .faq__item, .notice, .cta__content";

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  document.querySelectorAll(selector).forEach((el) => {
    const siblings = [...el.parentElement.children].filter((child) => child.matches(selector));
    el.style.setProperty("--reveal-delay", `${Math.min(siblings.indexOf(el), 5) * 60}ms`);
    el.classList.add("reveal");
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   Chiffres clés animés + membres Discord en direct
   -------------------------------------------------------------------------- */
function initStats() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const number = new Intl.NumberFormat("fr-FR");

  const animate = (el) => {
    const target = Number(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";
    if (reducedMotion) {
      el.textContent = number.format(target) + suffix;
      return;
    }
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min(1, (now - start) / 1600);
      el.textContent = number.format(Math.round(target * (1 - Math.pow(1 - progress, 3)))) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              animate(entry.target);
              observer.unobserve(entry.target);
            });
          },
          { threshold: 0.5 }
        )
      : null;

  const watch = (el) => (observer ? observer.observe(el) : animate(el));
  counters.forEach((el) => {
    if (el.dataset.count !== "") watch(el);
  });

  // Nombre de membres récupéré depuis l'invitation Discord (CONFIG.links.discord)
  const members = document.querySelector('[data-discord="members"]');
  if (!members) return;

  // Masqué tant que le visiteur n'a pas accepté les services tiers (voir initConsent)
  const item = members.closest("[data-discord-item]");
  const code = (CONFIG.links.discord.match(/discord\.gg\/([\w-]+)/) || [])[1];
  item?.setAttribute("hidden", "");

  loadDiscordCounts = () => {
    if (!code || members.dataset.loaded) return;
    members.dataset.loaded = "true";

    fetch(`https://discord.com/api/v10/invites/${code}?with_counts=true`)
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((data) => {
        members.dataset.count = data.approximate_member_count;
        const online = document.querySelector('[data-discord="online"]');
        if (online) online.textContent = number.format(data.approximate_presence_count);
        item?.removeAttribute("hidden");
        watch(members);
      })
      .catch(() => item?.setAttribute("hidden", ""));
  };
}

/* --------------------------------------------------------------------------
   Fenêtres (fiches services, visionneuse)
   -------------------------------------------------------------------------- */
function initDialogs() {
  document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-dialog-open]");
    if (opener) {
      document.getElementById(opener.dataset.dialogOpen)?.showModal();
      return;
    }
    const closer = event.target.closest("[data-dialog-close]");
    if (closer) closer.closest("dialog")?.close();
  });

  // Clic en dehors du contenu = fermeture
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
}

/* --------------------------------------------------------------------------
   Galerie : filtres + visionneuse plein écran
   -------------------------------------------------------------------------- */
function initGallery() {
  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  const items = [...gallery.querySelectorAll(".gallery__item")];
  const buttons = document.querySelectorAll("[data-filter]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      buttons.forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
      gallery.dataset.active = filter;
      items.forEach((item) => {
        item.hidden = filter !== "all" && item.dataset.category !== filter;
      });
    });
  });

  const lightbox = document.querySelector("[data-lightbox]");
  if (!lightbox) return;

  const image = lightbox.querySelector("[data-lightbox-img]");
  const caption = lightbox.querySelector("[data-lightbox-caption]");
  const counter = lightbox.querySelector("[data-lightbox-counter]");
  let visible = [];
  let index = 0;

  const show = (next) => {
    index = (next + visible.length) % visible.length;
    const item = visible[index];
    const source = item.querySelector("img");
    image.src = source.currentSrc || source.src;
    image.alt = source.alt;
    caption.textContent = item.querySelector("figcaption")?.textContent.trim() || "";
    counter.textContent = `${index + 1} / ${visible.length}`;
  };

  gallery.addEventListener("click", (event) => {
    const item = event.target.closest(".gallery__item");
    if (!item) return;
    visible = items.filter((candidate) => !candidate.hidden);
    show(visible.indexOf(item));
    lightbox.showModal();
  });

  lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", () => show(index - 1));
  lightbox.querySelector("[data-lightbox-next]").addEventListener("click", () => show(index + 1));
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });

  // Balayage sur mobile
  let startX = null;
  lightbox.addEventListener("touchstart", (event) => (startX = event.touches[0].clientX), { passive: true });
  lightbox.addEventListener("touchend", (event) => {
    if (startX === null) return;
    const deltaX = event.changedTouches[0].clientX - startX;
    if (Math.abs(deltaX) > 50) show(index + (deltaX < 0 ? 1 : -1));
    startX = null;
  });
}

/* --------------------------------------------------------------------------
   Arrivée sur une ancre (ex. index.html#services) : repositionnement une fois
   les polices chargées, car elles modifient la hauteur des blocs
   -------------------------------------------------------------------------- */
function initHashScroll() {
  if (!location.hash || !document.fonts) return;
  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (!target) return;
  document.fonts.ready.then(() => target.scrollIntoView({ behavior: "instant" }));
}

/* --------------------------------------------------------------------------
   Bannière de consentement : services tiers (Google Fonts, Discord)
   -------------------------------------------------------------------------- */
function initConsent() {
  const banner = document.querySelector("[data-consent]");
  const key = "eas96-consent";

  const apply = (choice) => {
    document.documentElement.dataset.consentState = choice;
    if (choice !== "accepted") return;

    if (!document.querySelector("link[data-google-fonts]")) {
      const fonts = document.createElement("link");
      fonts.rel = "stylesheet";
      fonts.href = GOOGLE_FONTS_URL;
      fonts.dataset.googleFonts = "";
      document.head.append(fonts);
    }
    loadDiscordCounts();
    loadSocialFeeds();
  };

  let stored = null;
  try {
    stored = localStorage.getItem(key);
  } catch (error) {
    // stockage indisponible : la bannière s'affiche à chaque visite
  }

  if (stored) apply(stored);
  else if (banner) banner.hidden = false;

  document.addEventListener("click", (event) => {
    const choice = event.target.closest("[data-consent-choice]");
    if (choice) {
      const value = choice.dataset.consentChoice;
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        // choix conservé pour cette visite uniquement
      }
      apply(value);
      if (banner) banner.hidden = true;
      return;
    }

    if (event.target.closest("[data-consent-open]") && banner) {
      event.preventDefault();
      banner.hidden = false;
      banner.querySelector("[data-consent-choice]")?.focus();
    }
  });
}

/* --------------------------------------------------------------------------
   Menus à deux niveaux de la barre de navigation
   -------------------------------------------------------------------------- */
function initMenus() {
  const toggles = [...document.querySelectorAll("[data-menu-toggle]")];
  if (!toggles.length) return;

  const closeAll = (except) => {
    toggles.forEach((toggle) => {
      if (toggle !== except) toggle.setAttribute("aria-expanded", "false");
    });
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      closeAll(toggle);
      toggle.setAttribute("aria-expanded", String(!open));
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav__item")) closeAll();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll();
  });
}

/* --------------------------------------------------------------------------
   Page « Nos réseaux » : dernières vidéos YouTube et prochain direct Twitch
   -------------------------------------------------------------------------- */
const escapeHtml = (value) =>
  String(value).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function initSocial() {
  // Prochain direct Twitch : renseigné à la main dans CONFIG
  const next = CONFIG.twitch.nextStream;
  const card = document.querySelector("[data-twitch-next]");
  const start = next && next.startsAt ? new Date(next.startsAt) : null;

  if (card && start && !Number.isNaN(start.getTime()) && start.getTime() > Date.now()) {
    const zone = { timeZone: "Europe/Paris" };
    const day = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", ...zone }).format(start);
    const hour = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", ...zone }).format(start).replace(":", "h");
    card.querySelector("[data-twitch-title]").textContent = next.title || "Direct Twitch";
    card.querySelector("[data-twitch-date]").textContent = day + " à " + hour;
    card.hidden = false;
    document.querySelector("[data-twitch-empty]")?.setAttribute("hidden", "");
  }

  const list = document.querySelector("[data-youtube-list]");
  if (!list) return;

  const empty = document.querySelector("[data-youtube-empty]");
  const consentNeeded = document.querySelector("[data-youtube-consent]");
  const { channelId, apiKey, videos } = CONFIG.youtube;
  if (!(videos && videos.length) && !(channelId && apiKey)) return;

  const dateLabel = (value) =>
    value ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)) : "";

  const render = (items) => {
    if (!items.length) return;
    list.innerHTML = items
      .slice(0, 3)
      .map(
        (video) =>
          '<li class="video"><a class="video__link" href="https://www.youtube.com/watch?v=' + escapeHtml(video.id) + '" target="_blank" rel="noopener noreferrer">' +
          '<span class="video__media"><img src="https://i.ytimg.com/vi/' + escapeHtml(video.id) + '/hqdefault.jpg" alt="" width="480" height="360" loading="lazy"></span>' +
          '<span class="video__title">' + escapeHtml(video.title || "Voir la vidéo") + '</span>' +
          '<span class="video__date">' + escapeHtml(dateLabel(video.date)) + '</span></a></li>'
      )
      .join("");
    list.hidden = false;
    empty?.setAttribute("hidden", "");
    consentNeeded?.setAttribute("hidden", "");
  };

  // Les vignettes sont servies par YouTube : on attend l'accord du visiteur
  loadSocialFeeds = () => {
    consentNeeded?.setAttribute("hidden", "");

    if (videos && videos.length) {
      render(videos.map((video) => (typeof video === "string" ? { id: video } : video)));
      return;
    }

    // Liste des mises en ligne de la chaine : 1 unite de quota par appel, contre 100 pour une recherche
    const uploads = "UU" + channelId.slice(2);

    fetch("https://www.googleapis.com/youtube/v3/playlistItems?key=" + apiKey + "&playlistId=" + uploads + "&part=snippet&maxResults=3")
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((data) =>
        render((data.items || []).map((item) => ({ id: item.snippet.resourceId.videoId, title: item.snippet.title, date: item.snippet.publishedAt })))
      )
      .catch(() => {});
  };

  // Accord déjà donné : initConsent lance le chargement. Sinon, on l'explique au visiteur.
  let stored = null;
  try {
    stored = localStorage.getItem("eas96-consent");
  } catch (error) {
    // stockage indisponible
  }
  if (stored !== "accepted" && consentNeeded) {
    consentNeeded.hidden = false;
    empty?.setAttribute("hidden", "");
  }
}

/* --------------------------------------------------------------------------
   Année du pied de page
   -------------------------------------------------------------------------- */
function initYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

initLinks();
initAnnounce();
initHeader();
initNav();
initMenus();
initScrollSpy();
initCountdown();
initReveal();
initStats();
initConsent();
initDialogs();
initGallery();
initSocial();
initHashScroll();
initYear();
