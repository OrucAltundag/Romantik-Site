/**
 * Ek özellikler: İzleme/Dinleme listeleri, Randevu çarkı, Oyunlar, Anı kutusu, Takvim
 */

// Randevu fikirleri (Ev / Dışarı / Online)
const DATE_IDEAS = {
  evde: [
    { title: "Birlikte yemek yapın (aynı tarif)", duration: "45-90 dk", category: "Ev", task: "Bir foto çekip galeriye ekle", req: "Tarif + malzemeler" },
    { title: "Anı defteri 10 dk", duration: "10 dk", category: "Ev", task: "Bugünü birlikte yazın", req: "Defter veya telefon" },
    { title: "Şarkı tahmin oyunu", duration: "15-20 dk", category: "Ev", task: "10 şarkı tahmin et", req: "Spotify/YouTube" },
    { title: "3 soru + çay", duration: "20 dk", category: "Ev", task: "Birbirine 3 soru sor", req: "Çay + sessiz ortam" },
    { title: "Ev sineması", duration: "90-120 dk", category: "Ev", task: "Birlikte film seç, izle", req: "Film listesi hazır olsun" }
  ],
  disari: [
    { title: "Kahveci keşfi + 10 foto", duration: "60-90 dk", category: "Dışarı", task: "10 farklı fotoğraf çek", req: "Telefon" },
    { title: "Tatlı + kısa yürüyüş", duration: "45-90 dk", category: "Dışarı", task: "Birlikte tatlı ye, yürüyüş yap", req: "Rahat ayakkabı" },
    { title: "Kitapçı gez + bir cümle", duration: "45-60 dk", category: "Dışarı", task: "Birbirine bir cümle yaz", req: "Kağıt + kalem" },
    { title: "Sahil/park yürüyüşü", duration: "45-60 dk", category: "Dışarı", task: "3 şey anlat birbirine", req: "Rahat kıyafet" },
    { title: "Restoran keşfi", duration: "90-120 dk", category: "Dışarı", task: "Yeni bir yer dene", req: "Rezervasyon" }
  ],
  online: [
    { title: "Aynı anda film", duration: "90-120 dk", category: "Online", task: "Geri sayım + aynı anda play", req: "Teleparty / Discord" },
    { title: "Sanal randevu menüsü", duration: "30 dk", category: "Online", task: "Aynı içeceği iç", req: "Görüntülü arama" },
    { title: "15 dk soru-cevap kartları", duration: "15 dk", category: "Online", task: "Kartlardan soru sor", req: "Görüntülü" },
    { title: "10 dk birlikte playlist", duration: "10 dk", category: "Online", task: "Ortak playlist yap", req: "Spotify" },
    { title: "Online oyun", duration: "30-60 dk", category: "Online", task: "Birlikte oyun oyna", req: "Oyun seçimi" }
  ]
};

// Quiz örnek soruları
const DEFAULT_QUIZ = [
  { q: "Sibel'in en sevdiği tatlı?", a: ["Baklava", "Cheesecake", "Tiramisu", "Dondurma"], correct: 0 },
  { q: "Benim en sevdiğim rahat aktivite?", a: ["Film izlemek", "Yürüyüş", "Müzik dinlemek", "Kitap"], correct: 0 },
  { q: "Birlikte en çok hangi anımız güldürüyor?", a: ["İlk buluşma", "Tatlı anı", "Yanlış anlaşılma", "Sürpriz"], correct: 0 }
];

// Ben mi Sen mi örnek cümleler
const DEFAULT_SENTENCES = [
  { text: "Bugün seni çok özledim.", speaker: "ben" },
  { text: "Bana sarılınca dünya susuyor.", speaker: "sen" },
  { text: "Seninle her an özel.", speaker: "ben" },
  { text: "Gülüşün bana yetiyor.", speaker: "ben" }
];

function getAllDateIdeas() {
  return [...DATE_IDEAS.evde, ...DATE_IDEAS.disari, ...DATE_IDEAS.online];
}
