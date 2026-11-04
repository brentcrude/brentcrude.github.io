/* Project data for the rotating panel.
   Edit this file to change what the panel shows — nothing else needs touching. */
window.PROJECTS = [
  {
    name: "hum-to-score",
    status: "active",
    statusLabel: "Active",
    blurb:
      "Hum a melody, get written music back. A browser notation editor with a full round-trip to MusicXML, MIDI and PDF, live humming transcription, plus sing-along scoring that grades how in-tune you were, note by note.",
    tags: ["JavaScript", "Web Audio API", "MusicXML / MIDI", "PDF export"],
    href: "https://github.com/brentcrude/hum-to-score",
    linkLabel: "Source"
  },
  {
    name: "Warden",
    status: "active",
    statusLabel: "Active",
    blurb:
      "A self-hosted, family-safe browsing filter with no backend and no cloud. Category blocking happens at the network layer so it can't be raced or bypassed by disabling JavaScript, and a password-protected local dashboard handles rules, history, screen time and access requests.",
    tags: ["Browser extensions", "declarativeNetRequest", "Local-first", "Chrome / Firefox / Safari"],
    href: null,
    linkLabel: null
  },
  {
    name: "FaCSim",
    status: "building",
    statusLabel: "New",
    blurb:
      "A matchup simulator and lineup optimizer for the Nations Draft fantasy-countries league. It enumerates every opponent lineup exactly instead of sampling, then searches for the starters, stance and annul that maximize your win odds.",
    tags: ["Exact enumeration", "Optimizer", "Single-file HTML"],
    href: "/apps/FaCSim/dist/index.html",
    linkLabel: "Open the simulator"
  },
  {
    name: "NisSign",
    status: "active",
    statusLabel: "Live & free",
    blurb:
      "Sign a PDF without uploading it anywhere. Draw your signature, place fields, and export — entirely in the browser. Free, no account, and nothing is ever sent to a server, because there is no server to send it to.",
    tags: ["Free", "Runs fully local", "Single-file HTML/CSS/JS", "Canvas"],
    href: "/nissign/",
    linkLabel: "Open the tool"
  },
  {
    name: "Polytrack Codes",
    status: "active",
    statusLabel: "Live",
    blurb:
      "A shared library of Polytrack track codes, each labeled stable or dev so it lands in the right game build. Search, filter and copy.",
    tags: ["Community", "Search & filter", "Stable / dev"],
    href: "/PolyTrack/",
    linkLabel: "Open the library"
  },
  {
    name: "Blackjack AI",
    status: "experiment",
    statusLabel: "Experiment",
    blurb:
      "A blackjack-playing agent trained on logged hand outcomes. Deals real rounds in Python, feeds the decision model from a CSV of recorded hands, and plays out thousands of deals against a simulated dealer.",
    tags: ["Python", "pandas", "CSV training data"],
    href: null,
    linkLabel: null
  }
];
