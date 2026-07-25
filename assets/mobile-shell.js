(() => {
  const fileName = (() => {
    const raw = String(window.location.pathname || "").split("/").pop() || "index.html";
    try {
      return decodeURIComponent(raw) || "index.html";
    } catch (error) {
      return raw || "index.html";
    }
  })();

  const pageIdMatch = fileName.match(/^(\d{3})(?:[\s_-].*)?\.html$/i);
  const pageId = pageIdMatch ? pageIdMatch[1] : "";
  const shellPageIds = new Set([
    "001", "002", "003", "004", "005", "006", "007", "008", "012", "016", "017", "018"
  ]);
  const articlePageIds = new Set(["002", "003", "004", "005", "006", "008", "016", "017", "018"]);
  const isEntry = fileName === "index.html" || fileName === "";
  const isSearch = fileName === "search.html";
  const isMailbox = fileName === "mailbox.html";
  const isWorkbench = new Set(["001", "007", "012"]).has(pageId);
  const usesShell = shellPageIds.has(pageId) || isSearch || isMailbox;

  document.documentElement.classList.add("mobile-h5");
  document.documentElement.classList.add(`mobile-page-${pageId || (isSearch ? "search" : isMailbox ? "mailbox" : "entry")}`);
  if (isEntry) document.documentElement.classList.add("mobile-route-entry");
  if (isWorkbench) document.documentElement.classList.add("mobile-route-workbench");
  if (articlePageIds.has(pageId)) document.documentElement.classList.add("mobile-route-article");
  if (isSearch) document.documentElement.classList.add("mobile-route-search");
  if (isMailbox) document.documentElement.classList.add("mobile-route-mailbox");

  const setViewportUnit = () => {
    document.documentElement.style.setProperty("--mobile-vh", `${window.innerHeight * 0.01}px`);
  };
  setViewportUnit();
  window.addEventListener("resize", setViewportUnit, { passive: true });

  const themeColor = document.querySelector('meta[name="theme-color"]') || document.createElement("meta");
  themeColor.setAttribute("name", "theme-color");
  themeColor.setAttribute("content", isEntry ? "#050A16" : "#f4f7fb");
  if (!themeColor.parentNode) document.head.appendChild(themeColor);

  if (!usesShell) return;

  const safeStorageRead = (key, fallback = "") => {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (error) {
      return fallback;
    }
  };

  const safeStorageWrite = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Keep navigation usable when storage is unavailable.
    }
  };

  const latestClueKey = "oa_latest_clue_page";
  const defaultClueHref = "./003-notice-lifeguard-training.html";
  if (articlePageIds.has(pageId)) {
    safeStorageWrite(latestClueKey, `./${fileName}`);
  }
  const latestClueHref = safeStorageRead(latestClueKey, defaultClueHref);

  const currentUser = safeStorageRead("oa_current_user", "linmin");
  const deskHref = currentUser === "linlan"
    ? "./007-desk-linlan.html"
    : currentUser === "zhangchi"
      ? "./012-desk-zhangchi.html"
      : "./001-oa-home.html";
  const mailboxView = currentUser === "linlan" || currentUser === "zhangchi" ? currentUser : "linmin";

  const pageTitles = {
    "001": "员工工作台",
    "002": "公司要闻",
    "003": "内部通知",
    "004": "调查资料",
    "005": "公司动态",
    "006": "人物专访",
    "007": "林岚工作台",
    "008": "工单详情",
    "012": "张弛工作台",
    "016": "权限公告",
    "017": "体检公告",
    "018": "公司要闻"
  };

  const resolveSection = () => {
    if (isSearch) return "search";
    if (isMailbox) return "mailbox";
    if (isWorkbench) return "workbench";
    return "clues";
  };

  const currentSection = resolveSection();
  const title = isSearch ? "线索检索" : isMailbox ? "公司邮箱" : pageTitles[pageId] || document.title || "案件调查";

  const createAppBar = () => {
    const appBar = document.createElement("header");
    appBar.className = "mobile-app-bar";
    appBar.setAttribute("data-mobile-ui", "app-bar");
    appBar.innerHTML = `
      <button class="mobile-app-bar__back" type="button" aria-label="返回上一页">
        <span class="mobile-app-bar__back-icon" aria-hidden="true">‹</span>
      </button>
      <div class="mobile-app-bar__copy">
        <p class="mobile-app-bar__eyebrow">CASE FILE · 0422</p>
        <p class="mobile-app-bar__title"></p>
      </div>
      <a class="mobile-app-bar__home" href="${deskHref}" aria-label="返回工作台">
        <span aria-hidden="true">⌂</span>
      </a>
    `;
    appBar.querySelector(".mobile-app-bar__title").textContent = title;
    appBar.querySelector(".mobile-app-bar__back").addEventListener("click", () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = deskHref;
      }
    });
    document.body.prepend(appBar);
  };

  const navItems = [
    { key: "workbench", label: "工作台", icon: "⌂", href: deskHref },
    { key: "search", label: "搜索", icon: "⌕", href: "./search.html" },
    { key: "mailbox", label: "邮箱", icon: "✉", href: `./mailbox.html?view=${encodeURIComponent(mailboxView)}` },
    { key: "clues", label: "足迹", icon: "◈", href: latestClueHref }
  ];

  const createBottomNav = () => {
    const nav = document.createElement("nav");
    nav.className = "mobile-bottom-nav";
    nav.setAttribute("aria-label", "主要导航");
    nav.setAttribute("data-mobile-ui", "bottom-nav");
    nav.innerHTML = navItems.map((item) => `
      <a class="mobile-bottom-nav__item" data-mobile-nav="${item.key}" href="${item.href}"${item.key === currentSection ? ' aria-current="page"' : ""}>
        <span class="mobile-bottom-nav__icon" aria-hidden="true">${item.icon}</span>
        <span class="mobile-bottom-nav__label">${item.label}</span>
      </a>
    `).join("");
    document.body.appendChild(nav);
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("mobile-shell-mounted");
    createAppBar();
    createBottomNav();
  });
})();
