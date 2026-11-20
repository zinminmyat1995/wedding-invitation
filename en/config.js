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
