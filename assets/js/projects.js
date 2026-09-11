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
    name: "NisSign",
    status: "active",
    statusLabel: "Live & free",
    blurb:
      "Sign a PDF without uploading it anywhere. Draw your signature, place fields, and export — entirely in the browser. Free, no account, and nothing is ever sent to a server, because there is no server to send it to.",
    tags: ["Free", "Runs fully local", "Single-file HTML/CSS/JS", "Canvas"],
    href: "nissign/",
    linkLabel: "Open the tool"
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
