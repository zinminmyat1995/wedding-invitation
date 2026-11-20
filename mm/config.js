/* =========================================================
   ဖိတ်စာ အချက်အလက်များ — ဒီဖိုင်ကိုပဲ ပြင်ရင် ရပါပြီ
   (ဖိတ်စာအစစ်မှ ယူထားသည် — ၂၉-၁၁-၂၀၂၆၊ Royal Myeik Ballroom)
   စာကြောင်း ခွဲချင်ရင် \n ထည့်ပါ
   ========================================================= */
window.WEDDING = {
  groom: { short: "ဝေလျှံစိုး", full: "မောင်ဝေလျှံစိုး B.Sc (Geology)" },
  bride: { short: "ဂျူးမီမီအော်", full: "မဂျူးမီမီအော် (B.C.Sc)" },

  // ① ဝင်ပေါက် (တံခါး)
  intro: {
    title: "မင်္ဂလာ ဖိတ်စာ",
    kicker: "ထိမ်းမြားမင်္ဂလာ ဖိတ်ကြားလွှာ",
    button: "ဖိတ်စာ ဖွင့်ကြည့်ရန်",
  },

  // ② Page 1 (ဘုရားနောက်ခံ)
  home: {
    title: "မင်္ဂလာ ဖိတ်စာ",
    message: "ထိမ်းမြားမင်္ဂလာပွဲသို့\nခင်မင်ရင်းနှီးစွာဖြင့် ဖိတ်ကြားအပ်ပါသည်။",
    button: "ဖိတ်စာ ကြည့်ရန်",
    cardDay: "တနင်္ဂနွေနေ့",
    cardDate: "၂၉-၁၁-၂၀၂၆",
    cardTime: "နေ့လယ် ၁၂ နာရီ",
    cardTimeSub: "မှ ညနေ ၃ နာရီ",
    cardVenue: "Royal Myeik",
    cardCity: "(မြိတ်မြို့)",
  },

  // ③ Page 2 (စုံတွဲ silhouette)
  page2: {
    title: "မင်္ဂလာ ဖိတ်စာ",
    message: "ထိမ်းမြားမင်္ဂလာပွဲသို့\nခင်မင်ရင်းနှီးစွာဖြင့် ဖိတ်ကြားအပ်ပါသည်။",
    date: "တနင်္ဂနွေ\n၂၉-၁၁-၂၀၂၆",
    time: "နေ့လယ် ၁၂ နာရီ\nမှ ညနေ ၃ နာရီ",
    venue: "Royal Myeik\n(မြိတ်မြို့)",
    // အောက်က ခလုတ် ၄ ခု — page: နောက်ထပ်လုပ်မယ့် page ရဲ့ နာမည်
    // p3 ဖိတ်စာ · p4 အစီအစဉ် · p5 နေရာ · p6 ဓာတ်ပုံ · p7 ကျေးဇူးတင်လွှာ · p8 တံခါးပိတ်
    buttons: [
      { label: "မင်္ဂလာ အစီအစဉ်", page: "p4" },
      { label: "နေရာ ကြည့်ရန်", page: "p5" },
      { label: "ဓာတ်ပုံများ", page: "p6" },
    ],
  },

  // ④ Page 3–5 အပေါ်က ခေါင်းစဉ်နဲ့ tab ၄ ခု (တူတူသုံး)
  tabs: {
    title: "မင်္ဂလာ ဖိတ်စာ",
    items: [
      { label: "ဖိတ်စာ", page: "p2" },
      { label: "အစီအစဉ်", page: "p4" },
      { label: "နေရာ", page: "p5" },
      { label: "ဓာတ်ပုံများ", page: "p6" },
    ],
  },

  // ⑤ Page 3 — ဖိတ်ကြားလွှာ
  page3: {
    title: "မင်္ဂလာ ဖိတ်စာ",
    message: "“ထိမ်းမြားမင်္ဂလာပွဲ” သို့\nကြွရောက်ချီးမြှင့်ပေးပါရန်\nခင်မင်ရင်းနှီးစွာဖြင့် ဖိတ်ကြားအပ်ပါသည်။",
    date: "တနင်္ဂနွေ\n၂၉-၁၁-၂၀၂၆",
    time: "နေ့လယ် ၁၂ နာရီ\nမှ ညနေ ၃ နာရီ",
    venue: "Royal Myeik\n(မြိတ်မြို့)",
    button: "နေရာ ကြည့်ရန်",
  },

  // ⑥ Page 4 — မင်္ဂလာ အစီအစဉ် (၅ ခု)
  page4: {
    title: "မင်္ဂလာ အစီအစဉ်",
    items: [
      { time: "မင်္ဂလာ ရက်", title: "၂၉-၁၁-၂၀၂၆ (တနင်္ဂနွေ)" },
      { time: "၁၃၈၈ ခုနှစ်", title: "တန်ဆောင်မုန်းလပြည့်ကျော် ၅ ရက်" },
      { time: "အချိန်", title: "နေ့လယ် ၁၂ နာရီ – ညနေ ၃ နာရီ" },
      { time: "နေရာ", title: "Royal Myeik Ballroom" },
      { time: "လိပ်စာ", title: "ကြံတောရပ်၊ မြိတ်မြို့" },
    ],
  },

  // ⑦ Page 5 — ကျင်းပမည့် နေရာ
  page5: {
    title: "မင်္ဂလာ နေရာ",   // အပေါ်ဆုံး ခေါင်းစဉ်
    name: "Royal Myeik Ballroom",
    address: "Royal Myeik Ballroom\nကြံတောရပ်၊ မြိတ်မြို့။",   // \n = စာကြောင်းခွဲ
    mapQuery: "Royal Myeik Hotel, Myeik, Myanmar",   // Google Maps မှာ ရှာမယ့်စာ
    dirLabel: "နေရာသို့ လမ်းညွှန်",
    mapLabel: "Google Map ဖြင့် ကြည့်ရန်",
  },

  // ⑧ Page 6 — ဓာတ်ပုံများ (ပုံအစစ်တွေကို assets/img/gallery/ ထဲထည့်ပြီး ဒီစာရင်းကို ပြင်ပါ)
  page6: {
    title: "မင်္ဂလာ အမှတ်တရများ",
    next: "ကျေးဇူးတင်လွှာ",
    photos: [
      "../assets/img/gallery/g-n-main.jpg",
      "../assets/img/gallery/g-n-hands.jpg",
      "../assets/img/gallery/g-n-bouquet.jpg",
      "../assets/img/gallery/g-n-bowl.jpg",
      "../assets/img/gallery/g-n-lotus.jpg",
      "../assets/img/gallery/g-n-pagoda.jpg",
      "../assets/img/gallery/g-n-parasol.jpg",
      "../assets/img/gallery/g-couple.jpg",
      "../assets/img/gallery/g-venue.jpg",
      "../assets/img/gallery/g-moon.jpg",
    ],
  },

  // ⑨ Page 7 — ကျေးဇူးတင်လွှာ
  page7: {
    head: "မင်္ဂလာ ဖိတ်စာ",
    title: "ကျေးဇူးတင်လွှာ",
    message: "ကျွန်ုပ်တို့၏ မင်္ဂလာပွဲသို့\nဖိတ်ကြားချက်ကို လေးစားစွာ လက်ခံ၍\nတက်ရောက်ပေးကြသော ချစ်ခင်ရသူများအား\nအထူး ကျေးဇူးတင်ရှိပါသည်။",
    next: "ဖိတ်စာ ပိတ်မည်",
  },

  // ⑩ Page 8 — နောက်ဆုံး (တံခါး ပိတ်)
  page8: {
    main: "ကျေးဇူးတင်ပါသည်",
    kicker: "ကြွရောက်ချီးမြှင့်ပေးသည့်အတွက်",
    home: "ပင်မ စာမျက်နှာသို့",
  },

  // mp3 ဖိုင်ထည့်ရန်: assets/music/mm.mp3 — မရှိသေးရင် ဂီတသံ အတုကို အလိုအလျောက် တီးပေးပါမယ်
  music: "../assets/music/mm.mp3",   // တံခါးဖွင့်တာနဲ့ စတီး၊ တံခါးပိတ်ရင် ဖြည်းဖြည်း တိတ်သွား
};
