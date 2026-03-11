/**
 * Ek özellikler: İzleme/Dinleme listeleri, Randevu çarkı, Oyunlar, Anı kutusu, Takvim
 */

// Sibel & Oruç İçin 100 Gündüz Aktivitesi
const DATE_ACTIVITIES_100 = [
  { title: "Sabah kahvesi buluşması", duration: "30–60 dk", category: "Kısa Süreli Dışarı", task: "Telefonları kenara bırakıp sadece konuşun", req: "Sessiz bir kafe" },
  { title: "Park yürüyüşü", duration: "45 dk", category: "Kısa Süreli Dışarı", task: "Yavaş tempoda yürüyün, haftanın nasıl geçtiğini konuşun", req: "Yakın bir park" },
  { title: "Gün batımı planlama yürüyüşü", duration: "45 dk", category: "Kısa Süreli Dışarı", task: "Gelecekte yapmak istediğiniz aktiviteleri konuşun", req: "Açık park veya manzara noktası" },
  { title: "Sokak kahvesi turu", duration: "1 saat", category: "Kısa Süreli Dışarı", task: "Küçük boy kahve alıp farklı kahvecilerde tadım", req: "Şehir merkezi" },
  { title: "Fotoğraf yürüyüşü", duration: "1 saat", category: "Kısa Süreli Dışarı", task: "Birbirinizin fotoğrafını çekin, en iyi fotoğrafı seçin", req: "Şehir sokakları" },
  { title: "Sokak lezzeti keşfi", duration: "1 saat", category: "Yemek ve Atıştırmalık", task: "Farklı küçük atıştırmalıklar deneyin", req: "Çarşı veya pazar" },
  { title: "Tatlı buluşması", duration: "40 dk", category: "Yemek ve Atıştırmalık", task: "Her biri farklı tatlı seçer, yarısını paylaşır", req: "Pastane" },
  { title: "Dondurma yürüyüşü", duration: "30 dk", category: "Yemek ve Atıştırmalık", task: "Dondurma alıp yürüyüş yapın", req: "Dondurmacı + park" },
  { title: "Mini piknik", duration: "1 saat", category: "Yemek ve Atıştırmalık", task: "Marketten sandviç alıp çimlerde oturun", req: "Park" },
  { title: "Kahvaltı kaçamağı", duration: "1 saat", category: "Yemek ve Atıştırmalık", task: "Sabah erken buluşup birlikte kahvaltı edin", req: "Küçük kahvaltı salonu" },
  { title: "20 soru oyunu", duration: "20 dk", category: "Eğlenceli Mini", task: "Bir kişi aklından bir şey tutar, diğeri tahmin eder", req: "Herhangi bir yerde" },
  { title: "Birbirini tanıma testi", duration: "30 dk", category: "Eğlenceli Mini", task: "Kağıda sorular yazıp cevapları karşılaştırın", req: "Kafe" },
  { title: "Emoji hikayesi", duration: "15 dk", category: "Eğlenceli Mini", task: "Sadece emojilerle hikaye anlatın", req: "Telefon üzerinden" },
  { title: "Rastgele rota yürüyüşü", duration: "1 saat", category: "Eğlenceli Mini", task: "Her köşede yazı tura ile yön belirleyin", req: "Şehir" },
  { title: "En komik fotoğraf yarışması", duration: "20 dk", category: "Eğlenceli Mini", task: "Komik selfie çekip karşılaştırın", req: "Park veya sokak" },
  { title: "Bankta sohbet", duration: "30 dk", category: "Sakin Aktiviteler", task: "Telefonları kapatıp sohbet edin", req: "Park" },
  { title: "Müzik paylaşımı", duration: "20 dk", category: "Sakin Aktiviteler", task: "Birbirinize sevdiğiniz şarkıları dinletin", req: "Kulaklık ile" },
  { title: "Gün planı konuşması", duration: "30 dk", category: "Sakin Aktiviteler", task: "Haftalık planları konuşun", req: "Kafe" },
  { title: "İnsan gözlemleme oyunu", duration: "30 dk", category: "Sakin Aktiviteler", task: "İnsanlar hakkında tahmin oyunu oynayın", req: "Meydan" },
  { title: "Sessiz yürüyüş", duration: "20 dk", category: "Sakin Aktiviteler", task: "10 dk hiç konuşmadan yürüyün, sonra düşünceleri paylaşın", req: "Park" },
  { title: "Yeni kafe keşfetmek", duration: "1 saat", category: "Keşif", task: "Yeni bir kafe seçip birlikte keşfedin", req: "-" },
  { title: "Kitapçı gezmek", duration: "1 saat", category: "Keşif", task: "Kitapçıda gezin, birbirinize kitap önerin", req: "-" },
  { title: "Yeni park keşfetmek", duration: "1 saat", category: "Keşif", task: "Bilmediğiniz bir parkı keşfedin", req: "-" },
  { title: "Yerel pazar gezmek", duration: "1 saat", category: "Keşif", task: "Pazarı gezin, mevsim meyvelerini alın", req: "-" },
  { title: "Küçük müze gezmek", duration: "1 saat", category: "Keşif", task: "Yakın bir müzeyi birlikte gezin", req: "-" },
  { title: "Birbirinize kısa not yazmak", duration: "20-30 dk", category: "Romantik Küçük", task: "Birbirinize sürpriz notlar yazın", req: "Kafe veya park" },
  { title: "Birlikte dilek listesi yapmak", duration: "20-30 dk", category: "Romantik Küçük", task: "Gelecek için dileklerinizi listeleyin", req: "Kafe veya park" },
  { title: "Birbirinize 5 güzel özellik söylemek", duration: "20-30 dk", category: "Romantik Küçük", task: "Birbirinize güzel özelliklerinizi söyleyin", req: "Kafe veya park" },
  { title: "İlk tanışma anısını anlatmak", duration: "20-30 dk", category: "Romantik Küçük", task: "İlk buluşmanızı hatırlayıp anlatın", req: "Kafe veya park" },
  { title: "Gelecek tatil planı yapmak", duration: "20-30 dk", category: "Romantik Küçük", task: "Hayalinizdeki tatili planlayın", req: "Kafe veya park" },
  { title: "Kelime oyunu", duration: "20 dk", category: "Mikro Oyunlar", task: "Bir kişi kelime söyler, diğeri devam ettirir", req: "-" },
  { title: "Şarkı tahmin oyunu", duration: "20 dk", category: "Mikro Oyunlar", task: "Şarkı açın, diğeri tahmin etsin", req: "-" },
  { title: "Film tahmin oyunu", duration: "20 dk", category: "Mikro Oyunlar", task: "Film sahnesi tarif edin, tahmin etsin", req: "-" },
  { title: "5 saniye oyunu", duration: "15 dk", category: "Mikro Oyunlar", task: "5 saniyede cevap vermesi gereken sorular", req: "-" },
  { title: "Hikaye tamamlama oyunu", duration: "20 dk", category: "Mikro Oyunlar", task: "Biri başlatır diğeri devam ettirir", req: "-" },
  { title: "Birlikte tempolu yürüyüş", duration: "30-45 dk", category: "Mini Spor", task: "Tempolu yürüyüş yapın", req: "-" },
  { title: "Basket atma", duration: "30-45 dk", category: "Mini Spor", task: "Parkta basket atın", req: "Basketbol sahası" },
  { title: "Frizbi oynama", duration: "30-45 dk", category: "Mini Spor", task: "Açık alanda frizbi oynayın", req: "Park" },
  { title: "Bisiklet sürme", duration: "30-45 dk", category: "Mini Spor", task: "Birlikte bisiklet turu", req: "Bisiklet" },
  { title: "Mini koşu", duration: "30-45 dk", category: "Mini Spor", task: "Hafif tempo koşu", req: "Park" },
  { title: "Mini fotoğraf çekimi", duration: "30 dk", category: "Gündüz Eğlence", task: "Birbirinizin portrelerini çekin", req: "-" },
  { title: "Komik video çekmek", duration: "20 dk", category: "Gündüz Eğlence", task: "Komik bir video çekin", req: "Telefon" },
  { title: "Birlikte playlist yapmak", duration: "25 dk", category: "Gündüz Eğlence", task: "Ortak playlist oluşturun", req: "Spotify" },
  { title: "Şehir manzarası izlemek", duration: "30 dk", category: "Gündüz Eğlence", task: "Manzara noktasında oturup sohbet", req: "-" },
  { title: "Hatıra fotoğrafı çekmek", duration: "20 dk", category: "Gündüz Eğlence", task: "Birlikte hatıra fotoğrafları", req: "-" },
  { title: "En mutlu anını anlat", duration: "30 dk", category: "Sohbet", task: "Birbirinize en mutlu anınızı anlatın", req: "-" },
  { title: "Çocukluk hikayesi anlat", duration: "30 dk", category: "Sohbet", task: "Çocukluk anılarınızı paylaşın", req: "-" },
  { title: "Hayalindeki şehir", duration: "25 dk", category: "Sohbet", task: "Görmek istediğiniz şehirleri konuşun", req: "-" },
  { title: "Gelecek hedefleri", duration: "30 dk", category: "Sohbet", task: "Gelecek planlarınızı paylaşın", req: "-" },
  { title: "Birbirinizi ilk gördüğünüz an", duration: "25 dk", category: "Sohbet", task: "İlk izlenimlerinizi anlatın", req: "-" },
  { title: "Rastgele otobüse binmek", duration: "1 saat", category: "Mikro Macera", task: "Bilmediğiniz bir otobüs rotasına binin", req: "-" },
  { title: "Bilmediğiniz sokakta yürümek", duration: "45 dk", category: "Mikro Macera", task: "Rastgele bir sokakta keşfe çıkın", req: "-" },
  { title: "Yeni restoran keşfetmek", duration: "1 saat", category: "Mikro Macera", task: "Hiç gitmediğiniz bir restoran deneyin", req: "-" },
  { title: "Sokak sanatı aramak", duration: "1 saat", category: "Mikro Macera", task: "Şehirdeki sokak sanatlarını bulun", req: "-" },
  { title: "Manzara noktası bulmak", duration: "45 dk", category: "Mikro Macera", task: "Yeni bir manzara noktası keşfedin", req: "-" },
  { title: "Birbirinin portresini çizmek", duration: "30 dk", category: "Yaratıcı", task: "Birbirinizi çizmeye çalışın", req: "Kağıt, kalem" },
  { title: "Mini hikaye yazmak", duration: "25 dk", category: "Yaratıcı", task: "Birlikte kısa bir hikaye yazın", req: "-" },
  { title: "Ortak playlist yapmak", duration: "20 dk", category: "Yaratıcı", task: "Ortak bir playlist oluşturun", req: "Spotify" },
  { title: "Hayal evi çizmek", duration: "30 dk", category: "Yaratıcı", task: "Hayalinizdeki evi çizin", req: "Kağıt, kalem" },
  { title: "Gelecek hayal haritası yapmak", duration: "30 dk", category: "Yaratıcı", task: "Geleceğinizi haritada çizin", req: "Kağıt" },
  { title: "20 dakikalık kahve buluşması", duration: "20 dk", category: "Hızlı Buluşma", task: "Kısa ama tatlı kahve molası", req: "-" },
  { title: "Hızlı tatlı buluşması", duration: "25 dk", category: "Hızlı Buluşma", task: "Tatlı + sohbet", req: "-" },
  { title: "Hızlı park yürüyüşü", duration: "20 dk", category: "Hızlı Buluşma", task: "Kısa yürüyüş", req: "Park" },
  { title: "Hızlı sohbet buluşması", duration: "20 dk", category: "Hızlı Buluşma", task: "Kısa öz sohbet", req: "-" },
  { title: "Hızlı fotoğraf çekimi", duration: "15 dk", category: "Hızlı Buluşma", task: "Birkaç güzel fotoğraf", req: "-" },
  { title: "10 komik selfie challenge", duration: "15 dk", category: "Eğlenceli Challenge", task: "10 komik selfie çekin", req: "-" },
  { title: "30 dakika telefonsuz sohbet", duration: "30 dk", category: "Eğlenceli Challenge", task: "Telefonları kapatıp sohbet", req: "-" },
  { title: "20 dakika yürüyüş challenge", duration: "20 dk", category: "Eğlenceli Challenge", task: "20 dk kesintisiz yürüyüş", req: "-" },
  { title: "5 yeni şarkı keşfet", duration: "20 dk", category: "Eğlenceli Challenge", task: "Birlikte 5 yeni şarkı bulun", req: "Spotify" },
  { title: "3 yeni kahve dene", duration: "45 dk", category: "Eğlenceli Challenge", task: "3 farklı kahveciye gidin", req: "-" },
  { title: "El ele yürüyüş", duration: "30 dk", category: "Mini Romantik", task: "El ele parkta yürüyün", req: "-" },
  { title: "Birbirine küçük not vermek", duration: "15 dk", category: "Mini Romantik", task: "Sürpriz notlar yazın", req: "-" },
  { title: "Günün en güzel anını paylaşmak", duration: "20 dk", category: "Mini Romantik", task: "Bugünkü en güzel anı anlatın", req: "-" },
  { title: "Günün en komik olayını anlatmak", duration: "15 dk", category: "Mini Romantik", task: "Komik bir olay paylaşın", req: "-" },
  { title: "Birbirinize sürpriz soru sormak", duration: "20 dk", category: "Mini Romantik", task: "Aklınıza gelen soruları sorun", req: "-" },
  { title: "Öğle yemeği buluşması", duration: "1 saat", category: "Gün Ortası", task: "Birlikte öğle yemeği", req: "-" },
  { title: "Parkta kitap okumak", duration: "45 dk", category: "Gün Ortası", task: "Yan yana kitap okuyun", req: "Park, kitap" },
  { title: "Göl kenarında oturmak", duration: "30 dk", category: "Gün Ortası", task: "Göl kenarında sohbet", req: "-" },
  { title: "Kafe sohbeti", duration: "45 dk", category: "Gün Ortası", task: "Kafede uzun sohbet", req: "-" },
  { title: "Sokak fotoğrafçılığı", duration: "45 dk", category: "Gün Ortası", task: "Sokaklarda fotoğraf çekin", req: "-" },
  { title: "Komik taklit yarışması", duration: "20 dk", category: "Eğlenceli Çift", task: "Birbirinizi veya ünlüleri taklit edin", req: "-" },
  { title: "En kötü şarkı söyleme yarışması", duration: "15 dk", category: "Eğlenceli Çift", task: "Bilerek kötü şarkı söyleyin", req: "-" },
  { title: "En komik hikaye anlatma", duration: "25 dk", category: "Eğlenceli Çift", task: "En komik hikayenizi anlatın", req: "-" },
  { title: "En hızlı kelime oyunu", duration: "15 dk", category: "Eğlenceli Çift", task: "Hızlı kelime oyunu oynayın", req: "-" },
  { title: "Emoji hikayesi (çift)", duration: "15 dk", category: "Eğlenceli Çift", task: "Emojilerle hikaye anlatın", req: "-" },
  { title: "Doğa izleme", duration: "30 dk", category: "Sakin", task: "Doğada sessizce oturun", req: "Park veya doğa" },
  { title: "Kuş izleme", duration: "25 dk", category: "Sakin", task: "Kuşları izleyin", req: "-" },
  { title: "Sessiz bank sohbeti", duration: "30 dk", category: "Sakin", task: "Bankta sessizce oturup sonra sohbet", req: "Park" },
  { title: "Göl kenarı yürüyüşü", duration: "35 dk", category: "Sakin", task: "Göl kenarında yürüyün", req: "-" },
  { title: "Çimlerde uzanıp sohbet", duration: "40 dk", category: "Sakin", task: "Çimlere uzanıp gökyüzüne bakın", req: "Park" },
  { title: "Günün en güzel anını fotoğraflamak", duration: "20 dk", category: "Son Romantik", task: "Bugünün en güzel anını fotoğlayın", req: "-" },
  { title: "Birlikte hedef yazmak", duration: "25 dk", category: "Son Romantik", task: "Ortak hedefler yazın", req: "-" },
  { title: "Birbirinize teşekkür etmek", duration: "15 dk", category: "Son Romantik", task: "Birbirinize teşekkür edin", req: "-" },
  { title: "Birlikte hayal kurmak", duration: "30 dk", category: "Son Romantik", task: "Gelecek hayallerinizi konuşun", req: "-" },
  { title: "İlk buluşmayı konuşmak", duration: "25 dk", category: "Son Romantik", task: "İlk buluşma anınızı anlatın", req: "-" },
  { title: "Favori şarkıyı dinlemek", duration: "20 dk", category: "Son Romantik", task: "Favori şarkınızı birlikte dinleyin", req: "-" },
  { title: "Günün en iyi anını anlatmak", duration: "20 dk", category: "Son Romantik", task: "Bugünkü en iyi anı paylaşın", req: "-" },
  { title: "Küçük sürpriz yapmak", duration: "30 dk", category: "Son Romantik", task: "Birbirinize küçük sürpriz hazırlayın", req: "-" },
  { title: "Birlikte kahkaha oyunu", duration: "20 dk", category: "Son Romantik", task: "Gülmekten yarılırcasına eğlenin", req: "-" },
  { title: "Bir sonraki buluşmayı planlamak", duration: "25 dk", category: "Son Romantik", task: "Sonraki randevuyu planlayın", req: "-" }
];

// Eski randevu fikirleri (yedek - getAllDateIdeas artık 100 aktiviteyi kullanıyor)
const DATE_IDEAS = {
  evde: [
    { title: "Birlikte yemek yapın", duration: "45-90 dk", category: "Ev", task: "Bir foto çekip galeriye ekle", req: "Tarif + malzemeler" }
  ],
  disari: [
    { title: "Kahveci keşfi", duration: "60-90 dk", category: "Dışarı", task: "10 farklı fotoğraf çek", req: "Telefon" }
  ],
  online: [
    { title: "Aynı anda film", duration: "90-120 dk", category: "Online", task: "Geri sayım + aynı anda play", req: "Teleparty / Discord" }
  ]
};

// Quiz örnek soruları (eski format - quizData için)
const DEFAULT_QUIZ = [
  { q: "Sibel'in en sevdiği tatlı?", a: ["Baklava", "Cheesecake", "Tiramisu", "Dondurma"], correct: 0 },
  { q: "Benim en sevdiğim rahat aktivite?", a: ["Film izlemek", "Yürüyüş", "Müzik dinlemek", "Kitap"], correct: 0 },
  { q: "Birlikte en çok hangi anımız güldürüyor?", a: ["İlk buluşma", "Tatlı anı", "Yanlış anlaşılma", "Sürpriz"], correct: 0 }
];

// Ben Seni Ne Kadar Tanıyorum - 30 soru teması
const TANIR_QUIZ = [
  { oruc: "Sibel'in en sevdiği renk nedir?", sibel: "Oruç'un en sevdiği renk nedir?" },
  { oruc: "Sibel'in en sevdiği yemek nedir?", sibel: "Oruç'un en sevdiği yemek nedir?" },
  { oruc: "Sibel'in en sevdiği tatlı nedir?", sibel: "Oruç'un en sevdiği tatlı nedir?" },
  { oruc: "Sibel'in en sevdiği film türü nedir?", sibel: "Oruç'un en sevdiği film türü nedir?" },
  { oruc: "Sibel en çok hangi şehri görmek ister?", sibel: "Oruç en çok hangi şehri görmek ister?" },
  { oruc: "Sibel'in en sevdiği mevsim hangisi?", sibel: "Oruç'un en sevdiği mevsim hangisi?" },
  { oruc: "Sibel sabah insanı mı gece insanı mı?", sibel: "Oruç sabah insanı mı gece insanı mı?" },
  { oruc: "Sibel stresli olduğunda en çok ne yapar?", sibel: "Oruç stresli olduğunda en çok ne yapar?" },
  { oruc: "Sibel'in en sevdiği içecek nedir?", sibel: "Oruç'un en sevdiği içecek nedir?" },
  { oruc: "Sibel'in en sevdiği dizi nedir?", sibel: "Oruç'un en sevdiği dizi nedir?" },
  { oruc: "Sibel boş zamanlarında en çok ne yapmayı sever?", sibel: "Oruç boş zamanlarında en çok ne yapmayı sever?" },
  { oruc: "Sibel'in en sevdiği müzik türü nedir?", sibel: "Oruç'un en sevdiği müzik türü nedir?" },
  { oruc: "Sibel'in en sevdiği hayvan nedir?", sibel: "Oruç'un en sevdiği hayvan nedir?" },
  { oruc: "Sibel'in en sevdiği tatil türü nedir? (deniz, doğa vb.)", sibel: "Oruç'un en sevdiği tatil türü nedir?" },
  { oruc: "Sibel'in en sevdiği sosyal medya uygulaması hangisi?", sibel: "Oruç'un en sevdiği sosyal medya uygulaması hangisi?" },
  { oruc: "Sibel'in çocukluk hayali mesleği neydi?", sibel: "Oruç'un çocukluk hayali mesleği neydi?" },
  { oruc: "Sibel'in en çok sevdiği tatlı atıştırmalık nedir?", sibel: "Oruç'un en çok sevdiği tatlı atıştırmalık nedir?" },
  { oruc: "Sibel'in en sevdiği koku nedir?", sibel: "Oruç'un en sevdiği koku nedir?" },
  { oruc: "Sibel'in en sevdiği spor nedir?", sibel: "Oruç'un en sevdiği spor nedir?" },
  { oruc: "Sibel'in en sevdiği meyve nedir?", sibel: "Oruç'un en sevdiği meyve nedir?" },
  { oruc: "Sibel en çok neye güler?", sibel: "Oruç en çok neye güler?" },
  { oruc: "Sibel'in en sevdiği film karakteri kim?", sibel: "Oruç'un en sevdiği film karakteri kim?" },
  { oruc: "Sibel'in en sevdiği gün hangisi? (hafta içi)", sibel: "Oruç'un en sevdiği gün hangisi?" },
  { oruc: "Sibel'in en sevdiği kahve türü nedir?", sibel: "Oruç'un en sevdiği kahve türü nedir?" },
  { oruc: "Sibel'in en sevdiği tatil aktivitesi nedir?", sibel: "Oruç'un en sevdiği tatil aktivitesi nedir?" },
  { oruc: "Sibel'in en sevdiği kıyafet tarzı nedir?", sibel: "Oruç'un en sevdiği kıyafet tarzı nedir?" },
  { oruc: "Sibel'in en sevdiği pizza malzemesi nedir?", sibel: "Oruç'un en sevdiği pizza malzemesi nedir?" },
  { oruc: "Sibel'in en sevdiği emoji hangisi?", sibel: "Oruç'un en sevdiği emoji hangisi?" },
  { oruc: "Sibel'in en sevdiği tatlı içecek nedir?", sibel: "Oruç'un en sevdiği tatlı içecek nedir?" },
  { oruc: "Sibel'in en sevdiği romantik aktivite nedir?", sibel: "Oruç'un en sevdiği romantik aktivite nedir?" }
];

// Ben mi Sen mi örnek cümleler (referans)
const DEFAULT_SENTENCES = [
  { text: "Bugün seni çok özledim.", speaker: "ben" },
  { text: "Bana sarılınca dünya susuyor.", speaker: "sen" }
];

function getAllDateIdeas() {
  return Array.isArray(DATE_ACTIVITIES_100) ? DATE_ACTIVITIES_100 : [];
}

function getRandomTanirQuestions(count = 5) {
  if (!Array.isArray(TANIR_QUIZ) || !TANIR_QUIZ.length) return [];
  const shuffled = [...TANIR_QUIZ].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
