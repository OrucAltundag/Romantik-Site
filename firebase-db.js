/**
 * Site verilerini Firebase (Firestore + Storage + anonim Auth) veya localStorage ile yönetir.
 *
 * Genel API (geriye uyumlu):
 *   getSiteConfig() / setSiteConfig(data)   -> hint/notes/tahminCevap
 *   getCollection(key) / setCollection(key, items)  -> dizi veriler
 *   getDoc(key) / setDoc(key, data)          -> nesne veriler
 *
 * Yeni API (bu sürümle eklendi):
 *   fbReady()                    -> anonim giriş tamamlanınca çözülen Promise<boolean>
 *   subscribeDoc(key, cb)        -> realtime nesne aboneliği; unsubscribe fonksiyonu döner
 *   subscribeCollection(key, cb) -> realtime dizi aboneliği; unsubscribe fonksiyonu döner
 *   uploadImage(fileOrBlob, folder) -> Promise<{url, path}>  (Firebase Storage)
 *   deleteImageByUrl(url)        -> Promise<void>
 *
 * Firebase yapılandırılmamışsa veya erişim reddedilirse otomatik olarak
 * tarayıcıdaki localStorage'a düşer (tek cihaz).
 */

// Bilinen anahtarların localStorage karşılıkları. Listede olmayan anahtarlar
// otomatik olarak "romantik_<key>" adıyla saklanır (yeni özellikler için).
const SITE_CONFIG_KEYS = {
  hint: "romantik_admin_hint", notes: "romantik_admin_notes", tahminCevap: "romantik_admin_tahmin_cevap",
  watchList: "romantik_watch", listenList: "romantik_listen", memories: "romantik_memories",
  calendar: "romantik_calendar", quizData: "romantik_quiz", sentences: "romantik_sentences",
  vaultQuestions: "romantik_vault_questions",
  moodBoard: "romantik_mood_board", thinkingPings: "romantik_thinking_pings",
  answerKeyOruc: "romantik_ak_oruc", answerKeySibel: "romantik_ak_sibel"
};

function lsName(key) { return SITE_CONFIG_KEYS[key] || ("romantik_" + key); }

function isFirebaseReady() {
  return typeof firebase !== "undefined" &&
    typeof FIREBASE_CONFIG !== "undefined" &&
    FIREBASE_CONFIG.apiKey &&
    !FIREBASE_CONFIG.apiKey.includes("BURAYA");
}

/* ---------------- Anonim kimlik doğrulama ---------------- */
let _fbAuthPromise = null;
function fbReady() {
  if (!isFirebaseReady()) return Promise.resolve(false);
  if (_fbAuthPromise) return _fbAuthPromise;
  _fbAuthPromise = new Promise((resolve) => {
    try {
      if (typeof firebase.auth !== "function") { resolve(false); return; }
      let done = false;
      const finish = (v) => { if (!done) { done = true; resolve(v); } };
      firebase.auth().onAuthStateChanged((u) => { if (u) finish(true); });
      firebase.auth().signInAnonymously().catch((e) => {
        console.warn("Anonim giriş başarısız (localStorage'a düşülüyor):", e.code || e.message);
        finish(false);
      });
      setTimeout(() => finish(false), 8000); // askıda kalmasın
    } catch (e) { resolve(false); }
  });
  return _fbAuthPromise;
}

async function fbDb() {
  await fbReady();
  return firebase.firestore();
}

// Firebase gerçekten kullanılabilir mi (yapılandırılmış + anonim giriş başarılı)?
// Değilse okuma/yazma işlemleri yavaş, başarısız Firestore çağrıları yerine
// doğrudan localStorage'a düşer.
async function fbUsable() {
  if (!isFirebaseReady()) return false;
  return await fbReady();
}

/* ---------------- localStorage yardımcıları ---------------- */
function lsGetArr(key) { try { return JSON.parse(localStorage.getItem(lsName(key)) || "[]"); } catch { return []; } }
function lsGetObj(key) { try { return JSON.parse(localStorage.getItem(lsName(key)) || "{}"); } catch { return {}; } }
function lsSet(key, val) { try { localStorage.setItem(lsName(key), JSON.stringify(val)); } catch {} }

/* ---------------- siteConfig (hint/notes/tahminCevap) ---------------- */
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
  if (!(await fbUsable())) return getFromLocalStorage();
  try {
    const db = await fbDb();
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

async function setSiteConfig(data) {
  const payload = {
    hint: (data.hint !== undefined ? data.hint : localStorage.getItem(SITE_CONFIG_KEYS.hint)) || "",
    notes: (data.notes !== undefined ? data.notes : localStorage.getItem(SITE_CONFIG_KEYS.notes)) || "",
    tahminCevap: (data.tahminCevap !== undefined ? data.tahminCevap : localStorage.getItem(SITE_CONFIG_KEYS.tahminCevap)) || ""
  };
  setToLocalStorage(payload);
  if (!(await fbUsable())) return;
  try {
    const db = await fbDb();
    await db.collection("siteConfig").doc("main").set(payload, { merge: true });
  } catch (e) { console.warn("Firebase yazma hatası.", e); }
}

/* ---------------- Dizi (collection) verileri ---------------- */
async function getCollection(key) {
  if (!(await fbUsable())) return lsGetArr(key);
  try {
    const db = await fbDb();
    const doc = await db.collection("siteData").doc(key).get();
    const arr = doc.exists && Array.isArray(doc.data().items) ? doc.data().items : [];
    lsSet(key, arr);
    return arr;
  } catch (e) { return lsGetArr(key); }
}

async function setCollection(key, items) {
  lsSet(key, items);
  if (!(await fbUsable())) return;
  try {
    const db = await fbDb();
    await db.collection("siteData").doc(key).set({ items }, { merge: false });
  } catch (e) { console.warn("Firebase yazma hatası:", e); }
}

/**
 * Diziyi ATOMİK güncelle: yazmadan hemen önce en güncel Firestore verisini
 * transaction içinde okur, mutator ile değiştirir, yazar. Böylece iki taraf
 * aynı anda ekleme/silme yapsa bile biri diğerini EZMEZ (kalıcılık + senkron).
 * mutator(mevcutDizi) -> yeniDizi döndürmeli.
 */
async function updateCollection(key, mutator) {
  if (!(await fbUsable())) {
    const next = mutator((lsGetArr(key) || []).slice());
    lsSet(key, next);
    return next;
  }
  const db = await fbDb();
  const ref = db.collection("siteData").doc(key);
  let result;
  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const cur = (snap.exists && Array.isArray(snap.data().items)) ? snap.data().items : [];
      result = mutator(cur.slice());
      tx.set(ref, { items: result });
    });
  } catch (e) {
    console.warn("updateCollection transaction hatası:", e.code || e.message);
    // Yedek: doğrudan oku-yaz
    const cur = await getCollection(key);
    result = mutator(cur.slice());
    await setCollection(key, result);
    return result;
  }
  lsSet(key, result);
  return result;
}

/* ---------------- Nesne (doc) verileri ---------------- */
async function getDoc(key) {
  if (!(await fbUsable())) return lsGetObj(key);
  try {
    const db = await fbDb();
    const doc = await db.collection("siteData").doc(key).get();
    const data = doc.exists ? doc.data() : {};
    lsSet(key, data);
    return data;
  } catch (e) { return lsGetObj(key); }
}

async function setDoc(key, data, opts) {
  const merge = !(opts && opts.merge === false);
  if (merge) { const cur = lsGetObj(key); lsSet(key, Object.assign({}, cur, data)); }
  else { lsSet(key, data); }
  if (!(await fbUsable())) return;
  try {
    const db = await fbDb();
    await db.collection("siteData").doc(key).set(data, { merge });
  } catch (e) { console.warn("Firebase yazma hatası:", e); }
}

/* ---------------- Realtime abonelikler ---------------- */
// Firebase yoksa: localStorage'dan bir kez okur + aynı cihazdaki diğer sekmeler
// için 'storage' olayını dinler. Firebase varsa: onSnapshot ile canlı dinler.
function subscribeDoc(key, cb) {
  if (!isFirebaseReady()) {
    try { cb(lsGetObj(key)); } catch (e) {}
    const h = (ev) => { if (ev.key === lsName(key)) { try { cb(lsGetObj(key)); } catch (e) {} } };
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }
  let unsub = () => {};
  let cancelled = false;
  fbReady().then((ok) => {
    if (cancelled) return;
    if (!ok) { try { cb(lsGetObj(key)); } catch (e) {} return; }
    unsub = firebase.firestore().collection("siteData").doc(key)
      .onSnapshot((doc) => {
        const data = doc.exists ? doc.data() : {};
        lsSet(key, data);
        try { cb(data); } catch (e) {}
      }, (err) => { console.warn("subscribeDoc hatası:", key, err.code); try { cb(lsGetObj(key)); } catch (e) {} });
  });
  return () => { cancelled = true; try { unsub(); } catch (e) {} };
}

function subscribeCollection(key, cb) {
  if (!isFirebaseReady()) {
    try { cb(lsGetArr(key)); } catch (e) {}
    const h = (ev) => { if (ev.key === lsName(key)) { try { cb(lsGetArr(key)); } catch (e) {} } };
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }
  let unsub = () => {};
  let cancelled = false;
  fbReady().then((ok) => {
    if (cancelled) return;
    if (!ok) { try { cb(lsGetArr(key)); } catch (e) {} return; }
    unsub = firebase.firestore().collection("siteData").doc(key)
      .onSnapshot((doc) => {
        const arr = doc.exists && Array.isArray(doc.data().items) ? doc.data().items : [];
        lsSet(key, arr);
        try { cb(arr); } catch (e) {}
      }, (err) => { console.warn("subscribeCollection hatası:", key, err.code); try { cb(lsGetArr(key)); } catch (e) {} });
  });
  return () => { cancelled = true; try { unsub(); } catch (e) {} };
}

/* ---------------- Firebase Storage (fotoğraflar) ---------------- */
function fbStorageAvailable() {
  return isFirebaseReady() && typeof firebase.storage === "function";
}

async function uploadImage(fileOrBlob, folder) {
  if (!fbStorageAvailable()) throw new Error("Firebase Storage kullanılamıyor.");
  await fbReady();
  const safeFolder = (folder || "uploads").replace(/[^a-zA-Z0-9_-]/g, "");
  const ext = (fileOrBlob.type && fileOrBlob.type.split("/")[1]) || "jpg";
  const path = safeFolder + "/" + Date.now() + "_" + Math.random().toString(36).slice(2, 9) + "." + ext;
  const ref = firebase.storage().ref().child(path);
  const snap = await ref.put(fileOrBlob, { contentType: fileOrBlob.type || "image/jpeg" });
  const url = await snap.ref.getDownloadURL();
  return { url, path };
}

async function deleteImageByUrl(url) {
  if (!fbStorageAvailable() || !url) return;
  try {
    await fbReady();
    await firebase.storage().refFromURL(url).delete();
  } catch (e) { console.warn("Storage silme hatası:", e.code || e.message); }
}

/* ---------------- Fotoğraflar (Firestore koleksiyonu, ÜCRETSİZ) ----------------
 * Storage/Blaze planı gerektirmez. Her foto ayrı doküman (1MB doc sınırının altında,
 * sıkıştırılmış JPEG). "galleryPhotos" koleksiyonunda tutulur ve realtime senkronlanır.
 */
async function addImageDoc(dataUrl, by) {
  const entry = { url: dataUrl, by: by || "?", ts: Date.now() };
  if (!(await fbUsable())) {
    const arr = lsGetArr("galleryPhotos");
    entry.id = "local_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
    arr.push(entry); lsSet("galleryPhotos", arr);
    return entry.id;
  }
  const db = await fbDb();
  const ref = await db.collection("galleryPhotos").add(entry);
  return ref.id;
}

async function deleteImageDoc(id) {
  if (!id) return;
  if (!(await fbUsable())) {
    lsSet("galleryPhotos", lsGetArr("galleryPhotos").filter(p => p.id !== id));
    return;
  }
  try { const db = await fbDb(); await db.collection("galleryPhotos").doc(id).delete(); }
  catch (e) { console.warn("Foto silme hatası:", e.code || e.message); }
}

function subscribeImages(cb) {
  if (!isFirebaseReady()) {
    try { cb(lsGetArr("galleryPhotos")); } catch (e) {}
    const h = (ev) => { if (ev.key === lsName("galleryPhotos")) { try { cb(lsGetArr("galleryPhotos")); } catch (e) {} } };
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }
  let unsub = () => {}; let cancelled = false;
  fbReady().then((ok) => {
    if (cancelled) return;
    if (!ok) { try { cb(lsGetArr("galleryPhotos")); } catch (e) {} return; }
    unsub = firebase.firestore().collection("galleryPhotos").orderBy("ts")
      .onSnapshot((snap) => {
        const arr = []; snap.forEach((d) => { const x = d.data() || {}; x.id = d.id; arr.push(x); });
        lsSet("galleryPhotos", arr);
        try { cb(arr); } catch (e) {}
      }, (err) => { console.warn("subscribeImages hatası:", err.code); try { cb(lsGetArr("galleryPhotos")); } catch (e) {} });
  });
  return () => { cancelled = true; try { unsub(); } catch (e) {} };
}
