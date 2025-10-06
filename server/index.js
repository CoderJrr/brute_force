// server/index.js 2 farklı terminal açıp node index sonra node atack ile deneyiniz.

import express from 'express'; // middleware ve yol tanımları (routes) gibi birçok alanda kullanılır. bu projede rare limiti de express sayesinde kullanıyoruz.
// 1. ADIM: Yüklediğimiz rate-limit paketini import ediyoruz projenin server klasörünün içindeyken terminale yazdığımız şu komutla yapmıştık:npm install express-rate-limit
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = 4000;

app.use(express.json());//req bodynin json olması gerekiyor 

const correctPassword = '1234';
const correctUsername = 'admin';

// 2. ADIM: Rate Limiter Kuralını Oluşturuyoruz
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakikalık zaman aralığı express-rate-limit kütüphanesi, jsonwebtoken'den farklı olarak, windowMs seçeneği için doğrudan '15 minutes' gibi bir metin kabul etmiyor; dokümantasyonunda da belirtildiği gibi sadece milisaniye cinsinden bir sayı bekliyor. 15 * 60 * 1000 olarak yazmamızın sebebi tamamen okunabilirliktir.900000 sayısını gören bir geliştirici, bunun ne kadar bir süre olduğunu anlamak için hesap yapmak zorunda kalır.
 
  max: 5, // Bu zaman aralığında her bir IP'nin yapabileceği maksimum istek sayısı
  message: { 
    success: false, 
    message: 'Çok fazla hatalı giriş denemesi yapıldı. Lütfen 15 dakika sonra tekrar deneyin.' 
  },
  //Bu kütüphanenin varsayılan davranışı, geriye dönük uyumluluğu korumak için, eski (legacy) başlıkları göndermek ve yeni (standard) başlıkları göndermemektir.
  standardHeaders: true, // Standart RateLimit başlıklarını yanıta ekle Bu ayar, modern ve standartlaşmış RateLimit-* başlıklarını aktive eder. Bu başlıklar, internet standartlarını belirleyen IETF tarafından taslak olarak kabul görmüş bir formattır.
  legacyHeaders: false, // Eski X-RateLimit-* başlıklarını devre dışı bırak Bu ayar, standart dışı olan eski X-RateLimit-* başlıklarını devre dışı bırakır. Eskiden, standart bir format olmadığı için birçok servis, standart olmayan başlıkları belirtmek için X- önekini kullanırdı.
});

// 3. ADIM: Oluşturduğumuz kuralı SADECE /login endpoint'ine bir middleware olarak ekliyoruz
app.post('/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;

  console.log(`Gelen deneme -> Kullanıcı Adı: ${username}, Şifre: ${password}`);

  if (username === correctUsername && password === correctPassword) {
    // ÖNEMLİ: Başarılı girişte limit sayacını sıfırlamak isteyebiliriz.
    // req.rateLimit.reset() // Bu komut başarılı girişte sayacı sıfırlar. Şimdilik kapalı.
    
    res.status(200).json({ success: true, message: 'Giriş Başarılı!' });
  } else {
    // Hatalı şifre denemesi, limit sayacını bir artırır.
    res.status(401).json({ success: false, message: 'Hatalı Kullanıcı Adı veya Şifre.' });
  }
});

app.listen(PORT, () => {
  console.log(`Güçlendirilmiş sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});