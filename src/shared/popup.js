const browser = globalThis.browser || globalThis.chrome;

const FEATURES = ["bbref", "statcastIcon", "statcastPanel", "video", "liveGame", "fangraphsPanel"];
const DEFAULTS = { bbref: true, statcastIcon: true, statcastPanel: true, video: true, liveGame: true, fangraphsPanel: true, themeOverride: "auto" };

async function init() {
  const versionEl = document.getElementById("version");
  versionEl.textContent = "v" + browser.runtime.getManifest().version;
  versionEl.href = "https://github.com/chefBrian/fantrax-baseball-plus/releases";
  const stored = await browser.storage.sync.get(DEFAULTS);
  for (const key of FEATURES) {
    const el = document.getElementById(key);
    el.checked = stored[key];
    el.addEventListener("change", () => save());
  }
  const seg = document.getElementById("themeSeg");
  const override = stored.themeOverride || "auto";
  applyThemeSeg(seg, override);
  applyPopupTheme(override);
  seg.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-theme]");
    if (!btn) return;
    applyThemeSeg(seg, btn.dataset.theme);
    applyPopupTheme(btn.dataset.theme);
    browser.storage.sync.set({ themeOverride: btn.dataset.theme });
  });
}

function applyThemeSeg(seg, theme) {
  for (const btn of seg.querySelectorAll("button")) {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  }
}

async function applyPopupTheme(override) {
  let theme = override;
  if (theme !== "light" && theme !== "dark") {
    const cached = await browser.storage.local.get({ ocfTheme: null });
    theme = cached.ocfTheme === "light" ? "light" : "dark";
  }
  document.documentElement.classList.toggle("light", theme === "light");
}

async function save() {
  const settings = {};
  for (const key of FEATURES) {
    settings[key] = document.getElementById(key).checked;
  }
  await browser.storage.sync.set(settings);
}

init();
