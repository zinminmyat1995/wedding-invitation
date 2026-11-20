/* =========================================================
   English version — edit the wording here
   ========================================================= */
window.WEDDING_EN = {
  // ⚠️ romanised from the Myanmar names on the printed card — please check the spelling
  groom: "Wai Hlyan Soe",
  bride: "Jue Mi Mi Aw",

  home: {
    kicker: "You're invited to our",
    title: "Wedding",
    script: "Celebration",
    date: "Nov 29, 2026",
    venue: "Royal Myeik Hotel",
    button: "Enter Invitation",
  },

  garden: { title: "Our Wedding" },

  // Thank-You page (reached by walking down the garden path)
  thanks: {
    tag: "Thank You",
    line1: "Thank you for being part of\nour special journey.",
    line2: "Your love, support, and presence\nmean the world to us.",
    line3: "We can’t wait to celebrate\nour big day with you!",
  },

  // Where quiz answers are saved (Google Apps Script web-app URL — see tools/quiz-sheet.gs).
  // Leave empty and answers are only kept on each guest's own phone.
  quizEndpoint: "",

  // Fun Quiz — "answer" is the index (0-3) of the correct option
  quiz: {
    introPhoto: "../assets/img/gallery-en/g4.jpg",
    notePhoto: "../assets/img/gallery-en/g17.jpg",
    resultPhoto: "../assets/img/gallery-en/t1.jpg",
    // ရလဒ်စာ (ရမှတ်အလိုက်)
    results: { perfect: "ကျွန်ုပ်တို့ကို အကုန်သိနေတာပဲ!", great: "ကျွန်ုပ်တို့ကို တကယ်သိတာပဲနော်!", good: "မဆိုးပါဘူး!", low: "မင်္ဂလာပွဲလာပြီး ပိုသိအောင်လုပ်နော်!" },
    // Quiz ထဲက ခလုတ်/စာသားများ
    ui: {
      ready: "စဆော့ကြမလား?",
      step: "မေးခွန်း {n} / {t}",
      almost: "နောက်ဆုံးအဆင့် ♡",
      askName: "မစခင်လေး…",
      nameLabel: "ဖြေမယ့်သူရဲ့ နာမည်လေး ပြောပြပါဦး",
      namePh: "နာမည် ရိုက်ထည့်ပါ",
      start: "Quiz စမယ် →",
      next: "ရှေ့ဆက်မယ် →",
      back: "← နောက်သို့",
      submit: "ပို့မယ် ✓",
      askNote: "နောက်ဆုံးတစ်ခု…",
      noteLabel: "ကျွန်ုပ်တို့နှစ်ယောက်အတွက် ရင်ထဲက စကားလေး တစ်ခွန်း ရေးပေးခဲ့ပါ ♡",
      notePh: "သတို့သား သတို့သမီးအတွက် ချိုမြိန်တဲ့ ဆုတောင်းစကားလေး ရေးပေးပါ…",
      got: "ရမှတ်",
      thanks: "ကျွန်ုပ်တို့ရဲ့ ဇာတ်လမ်းမှာ ပါဝင်ပေးတဲ့အတွက် ကျေးဇူးတင်ပါတယ် ♡",
      again: "ထပ်ဆော့မယ် ↻",
      home: "ဖိတ်စာဆီ ပြန်သွားမယ် ⌂",
    },
    questions: [
      { q: "ပထမဆုံး ချိန်းတွေ့ဖို့ ဘယ်သူက အရင် စဖိတ်ခဲ့တာလဲ? 😏", photo: "../assets/img/gallery-en/g2.jpg", answer: 0, options: [
        { text: "ကောင်လေးပေါ့ (သူ့လက်ချက် 😎)", icon: "him" }, { text: "ကောင်မလေး", icon: "her" }, { text: "ပွဲစား သူငယ်ချင်း", icon: "family" }, { text: "ကံကြမ္မာက စီစဉ်ပေးတာ", icon: "heart" } ] },
      { q: "ပျားရည်ဆမ်းခရီး ဘယ်ကို ထွက်ပြေးကြမလဲ? ✈️", photo: "../assets/img/gallery-en/g14.jpg", answer: 1, options: [
        { text: "ပြည်တွင်းပဲ အေးဆေးဆေး", icon: "pin" }, { text: "ထိုင်း", icon: "temple" }, { text: "ဗီယက်နမ်", icon: "palm" }, { text: "တရုတ်", icon: "gate" } ] },
      { q: "လက်ထပ်ပြီးရင် ပန်းကန်ဆေး၊ အဝတ်လျှော် အိမ်မှုကိစ္စ ဘယ်သူ ပိုလုပ်ရမလဲ? 🧺", photo: "../assets/img/gallery-en/g6.jpg", answer: 0, options: [
        { text: "ကောင်လေးပေါ့ (ရှောင်လို့မရ 😂)", icon: "him" }, { text: "ကောင်မလေး", icon: "her" }, { text: "တစ်ယောက်တစ်ဝက် (စာထဲမှာတော့)", icon: "home" }, { text: "ဖုန်စုပ်စက်ရုပ်လေး", icon: "smile" } ] },
      { q: "နှစ်ယောက်ထဲမှာ ဘယ်သူက ဒရမ်မာ ပိုကျတာလဲ? 🎭", photo: "../assets/img/gallery-en/g13.jpg", answer: 1, options: [
        { text: "ကောင်လေး", icon: "him" }, { text: "ကောင်မလေး", icon: "her" }, { text: "နှစ်ယောက်လုံး တူတူပဲ", icon: "heart" }, { text: "မဖြေရဲပါ 🤐", icon: "smile" } ] },
      { q: "အမှန်အတိုင်းပြော… ဘယ်သူက ပိုချောလဲ? 😍", photo: "../assets/img/gallery-en/g16.jpg", answer: 1, options: [
        { text: "ကောင်လေး", icon: "him" }, { text: "ကောင်မလေး (အဖြေမှန် 😉)", icon: "her" }, { text: "နှစ်ယောက်လုံး ချောတယ်", icon: "heart" }, { text: "ဒီမေးခွန်း ကျော်လို့ရလား?", icon: "smile" } ] },
    ],
  },

  // Our Story page
  story: {
    subtitle: "A Journey of\nLove",
    lead: "From a simple hello to a promise for a lifetime — here’s the story of how we found each other.",
    // ⚠️ the moments, dates and photos are placeholders — replace with the couple's real story
    moments: [
      { title: "How We Met", date: "", icon: "people", photo: "../assets/img/gallery-en/t3.jpg" },
      { title: "Falling in Love", date: "", icon: "cup", photo: "../assets/img/gallery-en/t9.jpg" },
      { title: "Our Adventures", date: "", icon: "mountain", photo: "../assets/img/gallery-en/t14.jpg" },
      { title: "The Proposal", date: "", icon: "ring", photo: "../assets/img/gallery-en/t11.jpg" },
    ],
  },

  // The Big Day page
  bigday: {
    dow: "Sunday", month: "NOV", day: "29", year: "2026",
    venue: "Royal Myeik Hotel",
    address: "Ballroom · No. 144/(A), Kyan Taw Road,\nKan Phyar Ward, Myeik",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Royal%20Myeik%20Hotel%2C%20Myeik",
    // ⚠️ the printed card only says 12:00 PM – 3:00 PM; adjust these to the real programme
    timeline: [
      { time: "12:00 PM", label: "Guest Arrival", icon: "toast" },
      { time: "12:30 PM", label: "Ceremony", icon: "rings" },
      { time: "1:00 PM", label: "Photos", icon: "camera" },
      { time: "1:30 PM", label: "Reception", icon: "dinner" },
      { time: "2:30 PM", label: "Celebration", icon: "music" },
    ],
  },

  // gallery photos (originals in en/image, web copies in assets/img/gallery-en)
  gallery: [
    { src: "../assets/img/gallery-en/g1.jpg", thumb: "../assets/img/gallery-en/t1.jpg", w: 2, h: 3 },
    { src: "../assets/img/gallery-en/g2.jpg", thumb: "../assets/img/gallery-en/t2.jpg", w: 3, h: 2 },
    { src: "../assets/img/gallery-en/g3.jpg", thumb: "../assets/img/gallery-en/t3.jpg", w: 2, h: 3 },
    { src: "../assets/img/gallery-en/g4.jpg", thumb: "../assets/img/gallery-en/t4.jpg", w: 2, h: 3 },
    { src: "../assets/img/gallery-en/g5.jpg", thumb: "../assets/img/gallery-en/t5.jpg", w: 3, h: 2 },
    { src: "../assets/img/gallery-en/g6.jpg", thumb: "../assets/img/gallery-en/t6.jpg", w: 3, h: 2 },
    { src: "../assets/img/gallery-en/g7.jpg", thumb: "../assets/img/gallery-en/t7.jpg", w: 3, h: 2 },
    { src: "../assets/img/gallery-en/g8.jpg", thumb: "../assets/img/gallery-en/t8.jpg", w: 2, h: 3 },
    { src: "../assets/img/gallery-en/g9.jpg", thumb: "../assets/img/gallery-en/t9.jpg", w: 2, h: 3 },
    { src: "../assets/img/gallery-en/g10.jpg", thumb: "../assets/img/gallery-en/t10.jpg", w: 2, h: 3 },
    { src: "../assets/img/gallery-en/g11.jpg", thumb: "../assets/img/gallery-en/t11.jpg", w: 2, h: 3 },
    { src: "../assets/img/gallery-en/g12.jpg", thumb: "../assets/img/gallery-en/t12.jpg", w: 3, h: 2 },
    { src: "../assets/img/gallery-en/g13.jpg", thumb: "../assets/img/gallery-en/t13.jpg", w: 3, h: 2 },
    { src: "../assets/img/gallery-en/g14.jpg", thumb: "../assets/img/gallery-en/t14.jpg", w: 3, h: 2 },
    { src: "../assets/img/gallery-en/g15.jpg", thumb: "../assets/img/gallery-en/t15.jpg", w: 3, h: 2 },
    { src: "../assets/img/gallery-en/g16.jpg", thumb: "../assets/img/gallery-en/t16.jpg", w: 3, h: 2 },
    { src: "../assets/img/gallery-en/g17.jpg", thumb: "../assets/img/gallery-en/t17.jpg", w: 2, h: 3 },
    { src: "../assets/img/gallery-en/g18.jpg", thumb: "../assets/img/gallery-en/t18.jpg", w: 3, h: 2 },
  ],

  photo: "../assets/img/en-hero.jpg",
  photoTiny: "../assets/img/en-hero-tiny.jpg",

  // leave empty for no music, or e.g. "../assets/music/en.mp3"
  music: "../assets/music/en.mp3",   // Lauv – I Like Me Better (loops)
};
