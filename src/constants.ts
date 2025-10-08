export const MODULE_ID = "dnd5e-item-improvements";

export const BASE_COMPENDIUM_PATH = `Compendium.${MODULE_ID}.rules-reference.JournalEntry.Q4VqflHKEdN7z8Qv.JournalEntryPage`;

export const WEAPON_MASTERY_DOCUMENT_MAP = {
  cleave: "2GQhl3IJLZGyuHow",
  graze: "mDnObAO0FapBEe7W",
  nick: "HAkYfqwjw3afUReb",
  push: "pQsfpAPRVyo2xohs",
  sap: "70GturmG5RRxCwV4",
  slow: "Ily8fxxcCqnZw7bV",
  topple: "fVcGobRFtXrAXPRI",
  vex: "UYnxxrKjfBE5UBl0",
};

export const WEAPON_PROPERTY_DOCUMENT_MAP = {
  ammunition: "pAMRJM7AtX2HHdCs",
  finesse: "WJFU13zVwyLNRa8A",
  heavy: "H8FtHo6Rtf5qcVTO",
  light: "RoaQU6zkGr3PRljI",
  loading: "BmGsHhheGNovmueo",
  range: "TroEj3XnLGJr9bXR",
  reach: "5omXI9g9KGqPxr3R",
  thrown: "rm4hrxjAWJNhvtuZ",
  "two-handed": "OXn46HGgkz1P2iri",
  versatile: "I2brJKVrXvIr67Zc",
  "burst-fire": "uDthMJAvyj0qRutp",
  reload: "a4JZaVcmOWTY96Oq",
};

export const AMMO_TYPE_MAP: Record<string, [string, string]> = {
  arrow: ["Arrow", "Compendium.dnd-players-handbook.equipment.Item.phbamoArrows0000"],
  crossbowBolt: ["Bolt", "Compendium.dnd-players-handbook.equipment.Item.phbamoBolts00000"],
  firearmBullet: ["Bullet, Firearm", "Compendium.dnd-players-handbook.equipment.Item.phbamoBulletsFir"],
  slingBullet: ["Bullet, Sling", "Compendium.dnd-players-handbook.equipment.Item.phbamoBulletsSli"],
  energyCell: ["Energy Cell", ""],
  blowgunNeedle: ["Needle", "Compendium.dnd-players-handbook.equipment.Item.phbamoNeedles000"],
};

export const RANGE_REGEX = /^\d+\/\d+\s*ft$/i;

export const REACH_REGEX = /^\d+\/\d+\s*ft$/i;
