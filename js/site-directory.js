/** Canonical site map — topic clusters for /find. Only pages that exist on this hub. */
window.SiteDirectory = {
  clusters: [
    {
      id: "day",
      title: "Your day",
      desc: "Schedule and flow for July 8",
      accent: "#008fd3",
      items: [
        { href: "/", title: "Workshop hub", desc: "Landing page · schedule · quick links", path: "/", keywords: "home index hub agenda landing" },
        { href: "/visit", title: "Your day", desc: "Day-of timeline — tour, tasting, lunch, Q&A", path: "/visit", keywords: "schedule your day timeline agenda tour lunch" }
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
      desc: "Blind mapping and scorecard",
      accent: "#f58220",
      items: [
        { href: "/taste", title: "Tasting hub", desc: "Gateway to blind mapping and the scorecard", path: "/taste", keywords: "tasting sensory 1030 flavors" },
        { href: "/map", title: "Blind flavor mapping", desc: "Match the coded cups before the reveal", path: "/map", keywords: "blind mystery mapping coded cups reveal", hot: true },
        { href: "/score", title: "Prototype scorecard", desc: "Rate the five prototypes after the reveal", path: "/score", keywords: "score scorecard rating prototypes", hot: true }
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
    },
    {
      id: "team",
      title: "TFF team",
      desc: "Presenter tools · password required",
      accent: "#0a1628",
      items: [
        { href: "/packet", title: "Speaker packet", desc: "Full talk tracks — TFF presenters only", path: "/packet", keywords: "speaker script talk tracks password packet", internal: true },
        { href: "/gate", title: "Team sign-in", desc: "Password gate to internal tools", path: "/gate", keywords: "gate login team password sign in", internal: true }
      ]
    }
  ]
};
