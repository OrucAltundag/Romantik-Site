# Firebase Kurulum Rehberi — Romantik Site

Bu rehber, site verilerinin (ipucu, önemli not, tahmin cevabı) Firebase üzerinde kalıcı olarak saklanması için gerekli adımları anlatır.

---

## Adım 1: Firebase Hesabı Oluştur

1. Tarayıcıda [console.firebase.google.com](https://console.firebase.google.com) adresine git
2. Google hesabınla giriş yap
3. **"Proje ekle"** veya **"Create a project"** tıkla

---

## Adım 2: Yeni Proje Oluştur

1. Proje adı gir (ör: `romantik-site`)
2. Google Analytics isteğe bağlı — şimdilik kapatabilirsin
3. **Proje oluştur** tıkla

---

## Adım 3: Web Uygulaması Ekle

1. Proje paneline gir
2. **</>** (Web) ikonuna tıkla
3. Uygulama adı gir (ör: `romantik-site`)
4. **Uygulamayı kaydet** tıkla
5. Açılan pencerede **config** objesindeki değerleri kopyala:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

---

## Adım 4: Firestore Veritabanını Etkinleştir

1. Sol menüden **"Build"** → **"Firestore Database"** seç
2. **"Veritabanı oluştur"** tıkla
3. **"Test modunda başlat"** seç (geliştirme için yeterli)
4. Bir lokasyon seç (örn: `europe-west1`) → **Etkinleştir**

> Test modu 30 gün sonra otomatik sıkı kurallara geçer. O zamana kadar "Kurallar" sekmesinden kuralları güncelleyebilirsin.

---

## Adım 5: firebase-config.js Dosyasını Oluştur (Gizli — Git'e eklenmez)

1. `firebase-config.example.js` dosyasını **firebase-config.js** olarak kopyala
2. Firebase Console'dan kopyaladığın değerleri `firebase-config.js` içine yapıştır:

```javascript
const FIREBASE_CONFIG = {
  apiKey: "AIza...",           // Kendi apiKey değerin
  authDomain: "romantik-site.firebaseapp.com",
  projectId: "romantik-site",  // Kendi projectId değerin
  storageBucket: "romantik-site.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123..."
};
```

3. Dosyayı kaydet — **firebase-config.js** asla GitHub'a yüklenmemelidir (`.gitignore`'da)

---

## Adım 6: Siteyi Test Et

1. Siteyi aç (örn: Live Server veya `npx serve`)
2. Admin sayfasına gir, ipucu/not ekle ve **Kaydet** tıkla
3. Ana sayfayı yenile — veriler görünüyorsa kurulum başarılı

---

## GitHub ile Çalışırken — API Anahtarlarını Gizli Tut

Projeyi GitHub'a yüklüyorsan, **firebase-config.js** dosyası `.gitignore`'da olduğu için commit edilmez. Ancak bu dosya daha önce commit edildiyse, Git geçmişinden kaldırman gerekir:

```bash
git rm --cached firebase-config.js
git commit -m "firebase-config.js artık gizli, .gitignore'a eklendi"
git push
```

Bundan sonra `firebase-config.js` sadece senin bilgisayarında kalacak, GitHub'da görünmeyecek. Yeni klonlayanlar `firebase-config.example.js`'i kopyalayıp kendi değerlerini girmeli.

> **Önemli:** Anahtarlar bir kez GitHub'da göründüyse, Firebase Console → Google Cloud Console üzerinden API anahtarına **HTTP referrer kısıtlaması** eklemen önerilir (sadece kendi sitenin domain'i kullanabilsin).

---

## Güvenlik Notu (Opsiyonel)

Firestore’da varsayılan test kuralları herkese yazma izni verir. Daha güvenli kullanım için:

1. Firestore → **Kurallar** sekmesi
2. Şu kurallarla değiştir:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /siteConfig/{document} {
      allow read, write: if true;
    }
    match /siteData/{document} {
      allow read, write: if true;  // Listeler, anılar, takvim
    }
  }
}
```

Admin sayfası kullanıcı/şifre ile korunduğu için bu kurallar kişisel site için yeterlidir.

---

## Sorun Giderme

- **"Firebase not defined"** → Script sırası doğru mu kontrol et
- **Veriler görünmüyor** → Tarayıcı konsolunu (F12) kontrol et, hata var mı bak
- **Firebase kurulmamış** → `firebase-config.js` içinde `apiKey` hâlâ "BURAYA_API_KEY" ise localStorage kullanılmaya devam eder
