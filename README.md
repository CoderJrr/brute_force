# Brute Force Saldırısı Simülasyonu ve Savunması

**UYARI:** Bu proje yalnızca eğitim amaçlıdır. Bir web uygulamasının `/login` gibi hassas endpoint'lerine yönelik "Brute Force" (Kaba Kuvvet) saldırılarının nasıl gerçekleştirildiğini 
ve bu tür saldırılara karşı "Rate Limiting" (İstek Sınırlama) ile nasıl temel bir savunma hattı oluşturulacağını göstermek amacıyla hazırlanmıştır. Burada öğrenilen tekniklerin yasa dışı 
veya etik olmayan amaçlarla kullanılması kesinlikle yasaktır.

---

## 🚀 Projenin Amacı

Bu proje, iki ana bölümden oluşur:
1.  **`server/`**: Basit bir `/login` endpoint'ine sahip, savunmasız bir Node.js/Express sunucusu.
2.  **`attacker/`**: Bu sunucunun şifresini kırmaya çalışan ve `passwords.txt` dosyasındaki yaygın şifreleri art arda deneyen bir Node.js script'i.

Amaç, `attacker`'ın `server`'a yaptığı saldırıyı gözlemlemek ve ardından `server`'a `express-rate-limit` kütüphanesi ile bir savunma mekanizması ekleyerek saldırının nasıl etkisiz hale getirildiğini görmektir.

---

## 🛠️ Kullanılan Teknolojiler

* **Back-end (`server/`):**
    * [Node.js](https://nodejs.org/)
    * [Express.js](https://expressjs.com/)
    * [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) (Savunma mekanizması için)
* **İstemci (`attacker/`):**
    * [Node.js](https://nodejs.org/)
    * [Axios](https://axios-http.com/) (Sunucuya HTTP istekleri göndermek için)

---

## 🔧 Kurulum ve Simülasyon

Simülasyonu çalıştırmak için **iki ayrı terminale** ihtiyacınız olacak.

### 1. Projeyi Klonlama
```bash
git clone [https://github.com/CoderJrr/brute_force.git](https://github.com/CoderJrr/brute_force.git)
cd brute_force
2. Sunucuyu (Hedef) Başlatma
İlk terminal penceresinde aşağıdaki adımları izleyin:

Sunucu klasörüne gidin ve bağımlılıkları yükleyin:

Bash

cd server
npm install
Sunucuyu başlatın:

Bash

npm start
Bu terminali açık bırakın. Sunucu artık saldırı denemelerini bekliyor.

3. Saldırganı Hazırlama
İkinci, yeni bir terminal penceresinde aşağıdaki adımları izleyin:

Saldırgan klasörüne gidin ve bağımlılıkları yükleyin:

Bash

cd attacker
npm install
4. Simülasyonu Çalıştırma
Saldırganın olduğu ikinci terminalde, saldırıyı başlatın:

Bash

node attack.js
Saldırgan terminalinde şifre denemelerini, sunucu terminalinde ise art arda gelen istekleri göreceksiniz. Savunma aktif değilse, script doğru şifreyi bulduğunda bunu bildirecektir.

🛡️ Savunmayı Aktif Etme
Saldırının nasıl engellendiğini görmek için:

server/index.js dosyasını bir metin düzenleyici ile açın.

Aşağıdaki satırı bulun ve başındaki yorumu (//) kaldırın:

JavaScript

// app.use('/login', loginLimiter);
Doğru hali:

JavaScript

app.use('/login', loginLimiter);
Sunucuyu (server'ın çalıştığı ilk terminalde) Ctrl + C ile durdurun ve npm start ile yeniden başlatın.

Saldırgan terminalinde node attack.js komutunu tekrar çalıştırın.

Bu sefer, belirli bir deneme sayısından sonra (varsayılan olarak 5), sunucunun 429 Too Many Requests hatası vererek saldırganın sonraki isteklerini engellediğini göreceksiniz.
