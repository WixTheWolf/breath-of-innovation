/** Canonical site map, topic clusters for /find. Only pages that exist on this hub. */
window.SiteDirectory = {
  clusters: [
    {
      id: "day",
      title: "Your day",
      desc: "Schedule and flow for July 8",
      accent: "#008fd3",
      items: [
        { href: "/", title: "Workshop hub", desc: "Landing page · schedule · quick links", path: "/", keywords: "home index hub agenda landing" },
        { href: "/visit", title: "Your day", desc: "Day-of timeline, tour, tasting, lunch, Q&A", path: "/visit", keywords: "schedule your day timeline agenda tour lunch" }
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
      desc: "Guest flavor flight and live admin",
      accent: "#f58220",
      items: [
        { href: "/taste", title: "Flavor Flight Challenge", desc: "Guest-guided blind tasting for Samples A-E", path: "/taste", keywords: "tasting sensory 1030 flavor flight samples", hot: true },
        { href: "/map", title: "Legacy blind mapping", desc: "Archived coded-cup mapping workflow", path: "/map", keywords: "blind mystery mapping coded cups reveal", internal: true },
        { href: "/score", title: "Flight results admin", desc: "Aggregate results, CSV export, private flavor key", path: "/score", keywords: "score results admin csv reveal", internal: true }
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
      desc: "Internal hub and tools · password required",
      accent: "#0a1628",
      items: [
        { href: "/team", title: "Team command center", desc: "Internal hub, links to every presenter tool", path: "/team", keywords: "team hub command center internal tools sign in", internal: true, hot: true },
        { href: "/packet", title: "Speaker packet", desc: "Full talk tracks, TFF presenters only", path: "/packet", keywords: "speaker script talk tracks password packet", internal: true },
        { href: "/chlorite", title: "Sodium chlorite flavor science", desc: "OXYD-8 stability, compound classes, workshop strategy", path: "/chlorite", keywords: "chlorite sodium oxyd8 stability formulation flavor science rd", internal: true },
        { href: "/emails", title: "Email templates", desc: "Pre-visit confirmation and 24 hour follow-up", path: "/emails", keywords: "email templates follow up thank you confirmation copy", internal: true },
        { href: "/mystery-live", title: "Blind mapping live", desc: "See guest matches, export CSV, reset room", path: "/mystery-live", keywords: "live admin mystery mapping realtime results", internal: true },
        { href: "/score-live", title: "Scorecard live", desc: "Room aggregate and per-rater detail", path: "/score-live", keywords: "live admin score scorecard aggregate summary", internal: true },
        { href: "/gate", title: "Team sign-in", desc: "Password gate to internal tools", path: "/gate", keywords: "gate login team password sign in", internal: true }
      ]
    }
  ]
};
