/**
 * Site verilerini Firebase Firestore veya localStorage ile yönetir.
 */
const SITE_CONFIG_KEYS = {
  hint: "romantik_admin_hint", notes: "romantik_admin_notes", tahminCevap: "romantik_admin_tahmin_cevap",
  watchList: "romantik_watch", listenList: "romantik_listen", memories: "romantik_memories",
  calendar: "romantik_calendar", quizData: "romantik_quiz", sentences: "romantik_sentences"
};

function isFirebaseReady() {
  return typeof firebase !== "undefined" &&
    typeof FIREBASE_CONFIG !== "undefined" &&
    FIREBASE_CONFIG.apiKey &&
    !FIREBASE_CONFIG.apiKey.includes("BURAYA");
}

function getFromLocalStorage() {
  return {
    hint: localStorage.getItem(SITE_CONFIG_KEYS.hint) || "",
    notes: localStorage.getItem(SITE_CONFIG_KEYS.notes) || "",
    tahminCevap: localStorage.getItem(SITE_CONFIG_KEYS.tahminCevap) || ""
  };
}

function setToLocalStorage(data) {
  if (data.hint !== undefined) localStorage.setItem(SITE_CONFIG_KEYS.hint, data.hint);
  if (data.notes !== undefined) localStorage.setItem(SITE_CONFIG_KEYS.notes, data.notes);
  if (data.tahminCevap !== undefined) localStorage.setItem(SITE_CONFIG_KEYS.tahminCevap, data.tahminCevap);
}

async function getSiteConfig() {
  if (!isFirebaseReady()) return getFromLocalStorage();
  try {
    const db = firebase.firestore();
    const doc = await db.collection("siteConfig").doc("main").get();
    if (doc.exists) {
      const d = doc.data();
      return { hint: d.hint || "", notes: d.notes || "", tahminCevap: d.tahminCevap || "" };
    }
    return getFromLocalStorage();
  } catch (e) {
    console.warn("Firebase okuma hatası, localStorage kullanılıyor.", e);
    return getFromLocalStorage();
  }
}

async function getCollection(key) {
  if (!isFirebaseReady()) {
    try { return JSON.parse(localStorage.getItem(SITE_CONFIG_KEYS[key]) || "[]"); } catch { return []; }
  }
  try {
    const db = firebase.firestore();
    const doc = await db.collection("siteData").doc(key).get();
    const arr = doc.exists && doc.data().items ? doc.data().items : [];
    try { localStorage.setItem(SITE_CONFIG_KEYS[key], JSON.stringify(arr)); } catch {}
    return arr;
  } catch (e) {
    try { return JSON.parse(localStorage.getItem(SITE_CONFIG_KEYS[key]) || "[]"); } catch { return []; }
  }
}

async function setCollection(key, items) {
  try { localStorage.setItem(SITE_CONFIG_KEYS[key], JSON.stringify(items)); } catch {}
  if (!isFirebaseReady()) return;
  try {
    const db = firebase.firestore();
    await db.collection("siteData").doc(key).set({ items }, { merge: true });
  } catch (e) { console.warn("Firebase yazma hatası:", e); }
}

async function getDoc(key) {
  if (!isFirebaseReady()) {
    try { return JSON.parse(localStorage.getItem(SITE_CONFIG_KEYS[key]) || "{}"); } catch { return {}; }
  }
  try {
    const db = firebase.firestore();
    const doc = await db.collection("siteData").doc(key).get();
    const data = doc.exists ? doc.data() : {};
    try { localStorage.setItem(SITE_CONFIG_KEYS[key], JSON.stringify(data)); } catch {}
    return data;
  } catch (e) {
    try { return JSON.parse(localStorage.getItem(SITE_CONFIG_KEYS[key]) || "{}"); } catch { return {}; }
  }
}

async function setDoc(key, data) {
  try { localStorage.setItem(SITE_CONFIG_KEYS[key], JSON.stringify(data)); } catch {}
  if (!isFirebaseReady()) return;
  try {
    const db = firebase.firestore();
    await db.collection("siteData").doc(key).set(data, { merge: true });
  } catch (e) { console.warn("Firebase yazma hatası:", e); }
}

async function setSiteConfig(data) {
  const payload = {
    hint: (data.hint !== undefined ? data.hint : localStorage.getItem(SITE_CONFIG_KEYS.hint)) || "",
    notes: (data.notes !== undefined ? data.notes : localStorage.getItem(SITE_CONFIG_KEYS.notes)) || "",
    tahminCevap: (data.tahminCevap !== undefined ? data.tahminCevap : localStorage.getItem(SITE_CONFIG_KEYS.tahminCevap)) || ""
  };
  setToLocalStorage(payload);
  if (!isFirebaseReady()) return;
  try {
    const db = firebase.firestore();
    await db.collection("siteConfig").doc("main").set(payload, { merge: true });
  } catch (e) {
    console.warn("Firebase yazma hatası.", e);
  }
}
