# Karlılık Analiz Uygulaması

Bu uygulama, siparişlerin ve ürünlerin karlılık analizini yapmanızı sağlayan bir web uygulamasıdır.

## 🚀 Başlangıç

### Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn

### Kurulum

1. Projeyi bilgisayarınıza klonlayın:
```bash
git clone https://github.com/bllfoad/mongery
cd mongery
```

2. Gerekli paketleri yükleyin:
```bash
npm run install-all
# veya
yarn run install-all
```

3. Uygulamayı başlatın:
```bash
# uygulama başlatmak için
npm start
# veya
yarn start


[Eğer server ve client ayrı başlatmak istiyorsanız.]
# Client uygulamasını başlatmak için
cd client
npm start
# veya
yarn start

# Server uygulamasını başlatmak için (yeni bir terminal penceresinde)
cd server
npm start
# veya
yarn start
```

Uygulama tarayıcınızda http://localhost:3000 adresinde çalışacaktır.


## 🧪 Test

Uygulama, kapsamlı test süitleri ile birlikte gelmektedir. Testleri çalıştırmak için:

```bash
# Tüm testleri çalıştırmak için (hem client hem server)
npm test

# Sadece client testlerini çalıştırmak için
cd client
npm test

# Sadece server testlerini çalıştırmak için
cd server
npm test
```


## 🛠 Teknik Detaylar

- React + TypeScript frontend
- Node.js backend
- Ant Design UI kütüphanesi
- Redux Toolkit
- tailwindcss
- RESTful API

