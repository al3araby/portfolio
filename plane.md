# 🎬 خطة موقع البورتفوليو 3D السينمائي — Mohamed Ebrahim Elaraby

> بورتفوليو 3D كامل بحركات كاميرا احترافية ودخول سينمائي، مبني على Next.js 16 + React Three Fiber + GSAP.

---

## 1️⃣ الرؤية العامة (Vision)

الموقع تجربة سينمائية واحدة متصلة، مش مجرد صفحات:

- **الدخول (Intro):** شاشة سوداء → عداد تحميل → الكاميرا تطير جوه المشهد → لابتوب 3D يتفتح قدامك ويبدأ يكتب كود بنفسه.
- **الثيم:** Dark cinematic — خلفية شبه سوداء + Cyan/Teal (لمسة NilePi) + Amber للتأكيدات.
- **الحركة:** كل سكشن يدخل بأنيميشن scroll-driven (GSAP ScrollTrigger) + Lenis smooth scroll عشان الإحساس السينمائي.
- **الشخصية:** AI & Full-Stack Engineer — اللابتوب بيكتب كود Python/AI حقيقي من مشاريعه.

---

## 2️⃣ التقنيات (Tech Stack)

| التقنية | الاستخدام |
|---|---|
| **Next.js 16.2 (App Router)** | الفريمورك الأساسي — الصفحة الرئيسية Server Component خفيف والمشهد 3D يتحمّل Client-side |
| **React Three Fiber + Drei + Three.js** | مشهد اللابتوب 3D، الكاميرا، الإضاءة، الجزيئات |
| **GSAP + ScrollTrigger** | حركات الكاميرا السينمائية، دخول السكاشن، الـ timeline |
| **Lenis** | Smooth scrolling سينمائي مربوط بـ GSAP |
| **Framer Motion** | أنيميشن عناصر الـ UI (مودال الشهادات، الكروت، الـ hover) |
| **Zustand** | حالة مشتركة: تقدم الـ intro، فتح اللابتوب، المودال المفتوح |
| **Tailwind CSS v4** | التنسيق كله |
| **next/image** | صور الشهادات محسّنة |

> ⚠️ ملاحظة تقنية مهمة (من الدوكس المرفقة `node_modules/next/dist/docs/`):
> - الـ 3D Canvas لازم يكون **Client Component** ويتحمّل بـ `dynamic(..., { ssr: false })` **من جوه Client Component** (ssr:false ممنوع في Server Components في Next 16).
> - `middleware` بقى اسمه `proxy` — مش محتاجينه هنا أصلًا.
> - الخطوط بـ `next/font/google` (Geist + Geist Mono موجودين بالفعل).

---

## 3️⃣ هيكل الملفات (File Structure)

```
app/
├── layout.tsx              # Metadata + الخطوط + الثيم الداكن
├── page.tsx                # Server Component يجمّع السكاشن
└── globals.css             # الثيم السينمائي + ألوان مخصصة

components/
├── providers/
│   └── SmoothScroll.tsx    # Lenis + GSAP ScrollTrigger sync
├── three/
│   ├── HeroScene.tsx       # الـ Canvas الرئيسي + الكاميرا السينمائية
│   ├── Laptop.tsx          # اللابتوب 3D (procedural — صناديق + شاشة)
│   ├── CodeScreen.tsx      # شاشة اللابتوب: كود بيتكتب حرف حرف (CanvasTexture)
│   ├── Particles.tsx       # جزيئات عائمة في الخلفية
│   └── CameraRig.tsx       # حركة الكاميرا: intro flythrough + mouse parallax
├── sections/
│   ├── Hero.tsx            # فوق المشهد 3D: الاسم + التخصص + CTA
│   ├── About.tsx           # نبذة + المهارات (شبكة متحركة بمجموعات)
│   ├── Projects.tsx        # المشاريع — كروت 3D tilt + ظهور متدرج
│   ├── Certificates.tsx    # الشهادات في براويز + مودال تكبير
│   ├── Timeline.tsx        # خط زمني متحرك للشهادات والخبرات
│   └── Footer.tsx          # فوتر سينمائي جامد
├── ui/
│   ├── button.tsx          # (موجود)
│   ├── SectionTitle.tsx    # عنوان سكشن بأنيميشن reveal
│   ├── CertModal.tsx       # مودال تكبير الشهادة (Framer Motion layoutId)
│   └── Preloader.tsx       # شاشة التحميل الأولى (عداد + fade out)
└── ...

lib/
├── data.ts                 # كل البيانات: مهارات، مشاريع، شهادات، timeline
└── utils.ts                # (موجود)

store/
└── useSiteStore.ts         # Zustand: introDone, laptopOpen, activeCert

public/
└── certificates/           # صور الشهادات من فولدر crf بأسماء نضيفة
```

---

## 4️⃣ المشهد الافتتاحي — اللابتوب 3D 💻

**التسلسل السينمائي (Intro Timeline):**

1. **Preloader (0s–1.5s):** شاشة سوداء + لوجو/اسم + عداد نسبة مئوية → fade out.
2. **Camera Flythrough (1.5s–4s):** الكاميرا تبدأ بعيدة وعالية، تطير بمنحنى ناعم (GSAP timeline على position + lookAt) وتقرّب على اللابتوب المقفول.
3. **Laptop Opens (4s–5.5s):** غطا اللابتوب يتفتح (rotation.x بـ ease سينمائي) + الشاشة تنوّر glow.
4. **Code Typing (5.5s → ∞):** الشاشة تبدأ تكتب كود Python/AI حرف بحرف مع cursor وميض — الكود من مشروع NilePi (FastAPI + agents). Syntax highlighting بألوان.
5. **UI Reveal:** الاسم "Mohamed Ebrahim Elaraby" + "AI & Full-Stack Engineer" يظهروا بـ stagger + سهم scroll.

**تفاصيل تقنية:**
- اللابتوب **procedural** (RoundedBox للجسم والغطا والكيبورد) — بدون ملفات GLB خارجية، خفيف وسريع.
- الشاشة: `CanvasTexture` من `<canvas>` 2D بيتكتب فيه الكود ويتحدث كل frame — أداء ممتاز.
- **Scroll:** مع النزول، الكاميرا تعمل dolly-out وتلف حوالين اللابتوب والمشهد يعتم تدريجيًا (opacity fade) لحد ما نوصل للسكاشن.
- **Mouse Parallax:** الكاميرا تميل شوية مع حركة الماوس (lerp ناعم).
- جزيئات cyan عائمة + إضاءة rim + spotlight على اللابتوب.

---

## 5️⃣ السكاشن

### 🧑‍💻 About + Skills
- نبذة قصيرة + 4 كروت للتخصصات (AI/LLM، Full-Stack، Cybersecurity، Backend).
- المهارات chips متجمعة بفئات (AI، Languages، Backend، Frontend، 3D/UI، Security، Networking، Tools) تظهر بـ stagger مع الscroll.

### 🚀 Projects (من ME.md)
عرض احترافي: كروت كبيرة بتأثير **3D tilt on hover** + glow + ظهور متدرج من تحت:

1. **NilePi** — Multi-Agent AI Platform (المشروع الأبرز — كارت مميز أكبر، بادجات: 389 tests, MRR 0.967, 0.9s image gen)
2. **AI Crime Prediction** — ML classification
3. **AI Maze Solver** — 8 خوارزميات بحث
4. **16-bit CPU Design** — Logisim
5. **Enterprise University Network** — Cisco
6. **AI DevSecOps Pipeline** — أمان الكود بالـ AI

كل كارت: عنوان + وصف + tech chips + أيقونة.

### 🏆 Certificates (من فولدر crf)
- **براويز حقيقية:** كل شهادة جوه إطار خشبي/معدني بظل وإضاءة، معلقة على "حيطة" السكشن.
- **عند الضغط:** الشهادة تكبر بأنيميشن `layoutId` (Framer Motion) لمودال full-screen مع خلفية blur + تفاصيل الشهادة (الجهة، التاريخ) + زرار إغلاق. حركة spring سينمائية.
- **الشهادات المتوفرة كصور (8):**

| الشهادة | الجهة | التاريخ |
|---|---|---|
| SQL (Intermediate) | HackerRank | 20 Jul 2026 |
| Artificial Intelligence Fundamentals | IBM SkillsBuild | 10 Jul 2026 |
| Cybersecurity Fundamentals | IBM SkillsBuild | 10 Jul 2026 |
| Introduction to Cybersecurity | Cisco Networking Academy | 16 Jun 2026 |
| AI Fundamentals: Language and Vision in AI | IBM SkillsBuild | 11 Jul 2026 |
| Intro to Machine Learning | Kaggle | 12 Jul 2026 |
| Fundamentals of Agents | Hugging Face | 11 Jul 2026 |
| Introduction to Modern AI | Cisco Networking Academy | 12 Jul 2026 |

- الشهادة التاسعة من ME.md (AI Concepts — Microsoft) تدخل الـ timeline حتى لو من غير صورة.

### 📅 Timeline
- خط عمودي متوهج في النص، النقط تتوهج والكروت تدخل يمين/شمال بالتبادل مع الـ scroll.
- مرتبة زمنيًا: الشهادات بالتواريخ + المشاريع الكبيرة (NilePi وغيرها) كمحطات خبرة.
- الخط نفسه "يترسم" مع النزول (scaleY مربوط بالـ scroll progress).

### 🦶 Footer
- Gradient داكن + جزيئات خفيفة.
- "Let's build something intelligent." + أزرار تواصل (GitHub, LinkedIn, Email) بأيقونات lucide + hover glow.
- الاسم + السنة + "Built with Next.js & Three.js" + زرار back-to-top بيطير بسلاسة لفوق.

### 🧭 Navbar
- Glass (backdrop-blur) ثابتة، تظهر بعد الـ intro، روابط بتعمل smooth scroll للسكاشن + active indicator.

---

## 6️⃣ نظام الألوان والخطوط

```
الخلفية:      #050810 (شبه أسود مزرق)
Primary:      Cyan  #22d3ee → Teal #2dd4bf (gradients)
Accent:       Amber #fbbf24 (للتوهجات والتأكيد)
النصوص:       zinc-100 / zinc-400
الخطوط:       Geist Sans (عناوين ونصوص) + Geist Mono (الكود والتفاصيل التقنية)
```

---

## 7️⃣ مراحل التنفيذ

| المرحلة | الشغل | الحالة |
|---|---|---|
| 0 | كتابة الخطة (الملف ده) | ✅ |
| 1 | نسخ الشهادات لـ `public/certificates/` + `lib/data.ts` + `store` | ⏳ |
| 2 | الثيم + Preloader + SmoothScroll + Navbar | ⏳ |
| 3 | المشهد 3D: اللابتوب + الشاشة بالكود + الكاميرا السينمائية | ⏳ |
| 4 | سكاشن: About/Skills → Projects → Certificates → Timeline → Footer | ⏳ |
| 5 | ربط كل حاجة في `page.tsx` + تظبيط الأداء + `npm run build` والتأكد إن كله شغال | ⏳ |

---

## 8️⃣ الأداء والجودة

- الـ Canvas يتحمّل lazy بـ `dynamic({ ssr: false })` من جوه Client Component + fallback أسود عشان مفيش فلاش.
- `dpr={[1, 2]}` + `frameloop` مُدار — مفيش رندر زيادة.
- الصور بـ `next/image` مع `sizes` مظبوطة.
- Reduced motion: احترام `prefers-reduced-motion` (تعطيل الـ flythrough الطويل).
- Lighthouse target: 90+ performance.
