# AITailor

AITailor, Next.js (App Router) kullanılarak geliştirilmiş, modern ve yüksek performanslı bir web uygulamasıdır. Proje, Edge ortamlarında (Cloudflare Workers/Pages) çalışacak şekilde OpenNext uyumlu olarak tasarlanmıştır.

## Özellikler

- **Next.js 15**: React 19 ile güçlendirilmiş en güncel Next.js sürümü.
- **Cloudflare Edge Deployment**: `@opennextjs/cloudflare` ve `wrangler` entegrasyonu ile Cloudflare üzerinde düşük gecikmeli çalışma.
- **Upstash Redis & Rate Limiting**: Hızlı veri erişimi ve API istek sınırlaması.
- **Tailwind CSS & Radix UI**: Şık, modern ve erişilebilir kullanıcı arayüzü bileşenleri.
- **Monaco Editor**: Tarayıcı içi zengin kod düzenleme deneyimi.
- **PDF İşleme**: `unpdf` kütüphanesi ile PDF dosyalarını okuma ve işleme yeteneği.

## Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/tetikmustafa/aitailor.git
   cd aitailor
   ```

2. Bağımlılıkları yükleyin (Node.js >= 20 gereklidir):
   ```bash
   npm install
   ```

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek uygulamayı görüntüleyebilirsiniz.

## Çevresel Değişkenler (Environment Variables)

Projenin düzgün çalışması için kök dizinde bir `.env.local` dosyasına ihtiyacınız olabilir (Özellikle Upstash Redis bağlantıları için). Gerekli değişkenlerin projenin ihtiyaç duyduğu servislere göre ayarlandığından emin olun.

## Yayınlama (Deployment)

Proje Cloudflare üzerine deploy edilmek üzere yapılandırılmıştır. Önizleme veya yayına alma işlemleri için:

- **Önizleme:** `npm run preview`
- **Yayına Alma:** `npm run deploy`

## Lisans

Bu proje özeldir (Private).
