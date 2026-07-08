/** Guest-facing site map for the TheraBreath workshop experience. */
window.SiteDirectory = {
  clusters: [
    {
      id: "day",
      title: "Your day",
      desc: "Schedule and flow for July 8",
      accent: "#008fd3",
      items: [
        { href: "/", title: "Workshop hub", desc: "Landing page · schedule · quick links", path: "/", keywords: "home index hub agenda landing" },
        { href: "/visit", title: "Your day", desc: "Day-of timeline, tour, tasting, lunch, Q&A, dinner", path: "/visit", keywords: "schedule your day timeline agenda tour lunch dinner" }
      ]
    },
    {
      id: "presentation",
      title: "Presentation",
      desc: "The four-pillar capabilities session",
      accent: "#006da3",
      items: [
        { href: "/present", title: "Live presentation", desc: "9:30 AM · four pillars · Q&A with key-point reveals", path: "/present", keywords: "slides projector pillars resiliency innovation operations partnership qa", hot: true }
      ]
    },
    {
      id: "tasting",
      title: "Tasting · 10:30 AM",
      desc: "Guided blind Flavor Flight",
      accent: "#f58220",
      items: [
        { href: "/taste", title: "Flavor Flight Challenge", desc: "Guest-guided blind tasting for Samples A-E", path: "/taste", keywords: "tasting sensory 1030 flavor flight samples", hot: true }
      ]
    },
    {
      id: "flavors",
      title: "Flavor portfolio",
      desc: "Products, pipeline, and directions",
      accent: "#6c5ce7",
      items: [
        { href: "/portfolio", title: "Flavor portfolio", desc: "Production SKUs · pipeline · Gen Alpha directions", path: "/portfolio", keywords: "flavors portfolio gallery skus mint pipeline gen alpha", hot: true }
      ]
    }
  ]
};
