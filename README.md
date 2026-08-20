# LIBSA — متجر ملابس إلكتروني (كود كامل، بدون أي منصة جاهزة)

هاد المشروع مبني بـ 3 أجزاء بالضبط بحال لي تصاوب:

- **Front-end**: `public/` → HTML5 + CSS3 + JavaScript خالص (بلا React، خفيف وسريع)
- **Back-end**: `server/` → Node.js + Express
- **Database**: MongoDB (عبر MongoDB Atlas، مجاني)

---

## 1) البرامج لي خاصك تثبت (مرة وحدة)

1. **VS Code** — [code.visualstudio.com](https://code.visualstudio.com)
2. **Node.js** (نسخة LTS) — [nodejs.org](https://nodejs.org)
3. حساب مجاني فـ **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)** (باش يكون عندك رابط الـ `MONGO_URI`)
4. حساب فـ **GitHub** (باش ترفع الكود وتربطو مع Vercel/Render)

---

## 2) كيفاش تجرب المشروع فـ كمبيوترك (Local Testing)

### أ) شغّل الباك-اند (السيرفر)
```bash
cd server
npm install
cp .env.example .env
```
- حل ملف `.env` وبدل `MONGO_URI` بالرابط ديالك الحقيقي من MongoDB Atlas.
```bash
npm start
```
خاصك تشوف فـ الترمينال:
```
🟢 السيرفر خدام على http://localhost:3000
✅ تصلنا مزيان مع MongoDB
```

### ب) شغّل الفرونت-اند (الموقع)
الفولدر `public/` هو موقع ثابت (static)، أسهل طريقة تجربو:

- فـ VS Code، ثبت إكستنسيون **Live Server**، دوز كليك يمين فوق `public/index.html` واختار **Open with Live Server**.

ولا بالترمينال:
```bash
cd public
npx serve .
```

### ج) دير طلبية تجريبية
1. حل الموقع فالمتصفح، اختار منتج، عمر المقاس/اللون، زيدو للسلة.
2. حل السلة، عمر الفورم (الاسم، الهاتف، المدينة، العنوان)، ضغط "تأكيد الطلب".
3. رجع لـ MongoDB Atlas → Collections → `orders`، وتأكد بلي الطلبية تسجلات.

> ملاحظة: `API_BASE` فـ ملف `public/app.js` معمر بـ `http://localhost:3000/api/orders` للتجربة المحلية. فاش ترفع السيرفر للإنترنت، بدلو برابط السيرفر ديالك الجديد (خطوة 4 تحت).

---

## 3) بنية المشروع
```
libsa-store/
├── public/            ← الواجهة (Front-end) — ترفعها فـ Vercel/Netlify
│   ├── index.html
│   ├── style.css
│   ├── products.js    ← بيانات المنتجات (بدلها بمنتجاتك الحقيقية)
│   └── app.js
└── server/            ← المحرك (Back-end) — ترفعو فـ Render/Railway
    ├── server.js
    ├── models/Order.js
    ├── package.json
    └── .env.example
```

---

## 4) رفع الموقع للإنترنت مجاناً (Deployment)

### الباك-اند → Render (ولا Railway)
1. صاوب حساب فـ [render.com](https://render.com) وربطو مع GitHub.
2. ادفع الفولدر `server/` كـ repo جديد فـ GitHub.
3. فـ Render: **New → Web Service** → اختار الـ repo.
4. Build command: `npm install` — Start command: `npm start`
5. زيد Environment Variable: `MONGO_URI` = الرابط ديالك (نفس لي فـ `.env`).
6. بعد النشر، Render غادي يعطيك رابط بحال `https://libsa-api.onrender.com`.

### الفرونت-اند → Vercel (ولا Netlify)
1. فـ ملف `public/app.js`، بدل `API_BASE` بالرابط الجديد ديال Render:
   ```js
   const API_BASE = "https://libsa-api.onrender.com/api/orders";
   ```
2. ادفع الفولدر `public/` كـ repo فـ GitHub.
3. فـ [vercel.com](https://vercel.com): **New Project** → اختار الـ repo → Deploy.
4. غادي توصل على رابط بحال `https://libsa-store.vercel.app`.

### دومين خاص بيك
شري دومين (مثلاً `www.libsa.ma`) وربطو مع Vercel من Settings → Domains.

---

## 5) شي حوايج تقدر تزيدها من بعد
- لوحة تحكم بسيطة باش تشوف/تبدل حالة الطلبيات (`جديد` / `مؤكد` / `موصل`).
- صور حقيقية للمنتجات (دابا كايستعملو ألوان placeholder).
- نظام تسجيل دخول للأدمين قبل `GET /api/orders` (دابا مفتوح، خاصو حماية قبل الإنتاج الحقيقي).
- ربط رقم واتساب/انستاغرام فـ الفوتر.
