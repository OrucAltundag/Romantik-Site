# Firebase Kurulumu (yalnızca 2 adım — hepsi ÜCRETSİZ, kart gerekmez)

Sitenin her şeyi **iki cihaz arasında kalıcı ve anlık senkron** çalışması için
Firebase Console'da (https://console.firebase.google.com → proje: **romantik-site-8f761**)
şu 2 adımı yapman yeterli. Kod tarafı hazır; bu adımlar bitince otomatik devreye girer.

> **Storage'a GEREK YOK.** Fotoğraflar da Firestore'a (sıkıştırılmış) kaydedilir.
> Google'ın Storage için istediği ücretli **Blaze planı / kredi kartı gerekmez.**
> Her şey ücretsiz Kıvılcım (Spark) planında çalışır.

Güvenlik notu: Aşağıdaki kurallar erişimi "anonim de olsa giriş yapmış" kullanıcılarla
sınırlar. Site zaten kendi şifre ekranıyla (Oruç/Sibel) korunuyor. Bu, proje kimliğini
bilen rastgele kişilerin verini okumasını engeller. Kod, anonim girişi kullanıcıya hiçbir
sürtünme yaşatmadan arka planda yapar.

---

## 1) Anonymous Authentication'ı aç

Firebase Console → **Authentication** → **Get started** (ilk kezse) →
**Sign-in method** sekmesi → **Anonymous** → **Enable** → Kaydet.

## 2) Firestore güvenlik kurallarını yapıştır

Firebase Console → **Firestore Database** → **Rules** sekmesi → aşağıdakini yapıştır → **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 3) Storage — GEREK YOK ❌

Google, Storage için ücretli **Blaze planı / kredi kartı** istiyor. **Buna gerek yok.**
Fotoğraflar da Firestore'a (yukarıdaki Adım 2 yeterli) kaydedilir; iki cihazda senkron
ve ücretsizdir. Storage ekranında **"Upgrade project" / kart ekleme** çıkarsa **kapat, girme.**

---

## Nasıl doğrularsın

Bu 2 adımı yaptıktan sonra siteyi aç, tarayıcı konsolunda (F12) şunu görmelisin:
`Firebase hazır (auth): true`

Görürsen her şey Firebase üzerinden kalıcı ve senkron çalışıyor demektir.
Görmezsen kod yine de çalışır ama veriler yalnızca o cihazda (localStorage) kalır.

> Not: Bu adımları yapmadan da site çalışır; sadece cihazlar arası senkron ve anlık
> bildirimler devreye girmez. Adımları sonradan yapınca kendiliğinden aktifleşir.
