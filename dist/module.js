var V = (u) => {
  throw TypeError(u);
};
var ce = (u, e, t) => e.has(u) || V("Cannot " + t);
var q = (u, e, t) => e.has(u) ? V("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(u) : e.set(u, t);
var g = (u, e, t) => (ce(u, e, "access private method"), t);
const y = "dnd5e-item-improvements", pe = `Compendium.${y}.rules-reference.JournalEntry.Q4VqflHKEdN7z8Qv.JournalEntryPage`, O = {
  cleave: "2GQhl3IJLZGyuHow",
  graze: "mDnObAO0FapBEe7W",
  nick: "HAkYfqwjw3afUReb",
  push: "pQsfpAPRVyo2xohs",
  sap: "70GturmG5RRxCwV4",
  slow: "Ily8fxxcCqnZw7bV",
  topple: "fVcGobRFtXrAXPRI",
  vex: "UYnxxrKjfBE5UBl0"
}, F = {
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
  reload: "a4JZaVcmOWTY96Oq"
}, ue = {
  arrow: ["Arrow", "Compendium.dnd-players-handbook.equipment.Item.phbamoArrows0000"],
  crossbowBolt: ["Bolt", "Compendium.dnd-players-handbook.equipment.Item.phbamoBolts00000"],
  firearmBullet: ["Bullet, Firearm", "Compendium.dnd-players-handbook.equipment.Item.phbamoBulletsFir"],
  slingBullet: ["Bullet, Sling", "Compendium.dnd-players-handbook.equipment.Item.phbamoBulletsSli"],
  energyCell: ["Energy Cell", ""],
  blowgunNeedle: ["Needle", "Compendium.dnd-players-handbook.equipment.Item.phbamoNeedles000"]
}, de = /^\d+\/\d+\s*ft$/i;
var S, W, B;
class R {
  /**
   * Prepare derived CharacterData
   */
  static async prepareDerivedData(e) {
    g(this, S, B).call(this, e), g(this, S, W).call(this, e);
  }
}
S = new WeakSet(), W = async function(e) {
  const t = e.attributes.ac, { armors: i, shields: s } = e.parent.itemTypes.equipment.reduce(
    (p, c) => (!c.system.equipped || !(c.system.type.value in CONFIG.DND5E.armorTypes) || (c.system.type.value === "shield" ? p.shields.push(c) : p.armors.push(c)), p),
    { armors: [], shields: [] }
  ), r = e.traits.armorProf.value.has("shl");
  s.length && !r && (t.shield = 0, t.value = Math.max(t.min, t.base + t.shield + t.bonus + t.cover));
  let l = !1;
  i.forEach((p) => {
    p.system.proficiencyMultiplier === 0 && (l = !0);
  }), l && (e.attributes.movement.walk -= 10);
}, B = async function(e) {
  console.log("ACTOR:", e);
  const t = [
    ...e.parent.itemTypes.equipment,
    ...e.parent.itemTypes.consumable,
    ...e.parent.itemTypes.loot,
    ...e.parent.itemTypes.weapon,
    ...e.parent.itemTypes.container
  ];
  let i = 0;
  const { cp: s = 0, sp: r = 0, ep: l = 0, gp: p = 0, pp: c = 0 } = e.currency;
  let d = s + r + l + p + c;
  for (const a of t) {
    if (a.system.container) {
      const n = e.parent.collections.items.get(a.system.container);
      if (console.log("CONTAINERITEM:", n), n.system.properties.has("weightlessContents")) {
        console.log("WEIGHTLESS:", a);
        continue;
      }
    }
    a.system.slots.tiny ? d += a.system.quantity : i += a.system.slots.resolvedValue;
  }
  i += Math.ceil(d / 100), e.slotBasedEncumberance = {
    value: i,
    max: e.abilities.str.value + 10
  };
}, q(R, S);
var T, G, U;
class A {
  /**
   * Prepare derived ItemData
   */
  static prepareDerivedData(e) {
    g(this, T, G).call(this, e);
  }
  /* -------------------------------------------- */
  /**
   * Getter method for resolving container capacity slots. Needs to be a getter to avoid race conditions encountered
   * when using prepareDerivedData
   */
  static async getContainerCapacity(e) {
    const t = await e.contents ?? [];
    let i = 0;
    const { cp: s = 0, sp: r = 0, ep: l = 0, gp: p = 0, pp: c = 0 } = e.currency;
    let d = s + r + l + p + c;
    for (const a of t)
      if (a.type === "container") {
        const n = await a.system.slotCapacity;
        i += n;
      } else a.system.slots.tiny ? d += a.system.quantity : i += a.system.slots.resolvedValue;
    return i += Math.ceil(d / 100), i;
  }
}
T = new WeakSet(), G = function(e) {
  const t = e.parent.getFlag(y, "slots"), i = e.parent.getFlag(y, "ifEquipped"), s = e.parent.getFlag(y, "maxCapacity"), r = e.parent, l = r.system, {
    value: p,
    ifEquipped: c,
    maxCapacity: d
  } = g(this, T, U).call(this, e, r, l), a = t ?? p, n = i ?? c, o = s ?? d;
  let m = e.quantity * a;
  n !== null && e.equipped && (m = e.quantity * n);
  const f = {
    value: a,
    resolvedValue: m,
    ifEquipped: n,
    capacity: {
      max: o
    }
  };
  e.slots = f;
}, U = function(e, t, i) {
  return {
    value: 1,
    ifEquipped: null,
    maxCapacity: 10
  };
}, q(A, T);
var x, j, X;
class D {
  /**
   * Prepare derived ItemData
   */
  static prepareDerivedData(e) {
    g(this, x, j).call(this, e);
  }
  /* -------------------------------------------- */
  /**
   * Resolve item slots for item
   */
  static async updateRichTooltip(e, t) {
    const s = new DOMParser().parseFromString(t, "text/html"), r = s.querySelector(".weight");
    if (r) {
      const l = r.querySelector("span");
      l && (e.slots.tiny ? l.textContent = "Tiny" : e.slots.stack && e.slots.stack !== e.slots.resolvedValue ? l.textContent = `${e.slots.resolvedValue} (x${e.slots.stack})` : l.textContent = e.slots.resolvedValue);
    }
    return s.body.innerHTML.trim();
  }
}
x = new WeakSet(), j = function(e) {
  const t = e.parent.getFlag(y, "slots"), i = e.parent.getFlag(y, "stack"), s = e.parent.getFlag(y, "tiny"), r = e.parent.getFlag(y, "ifEquipped"), l = e.parent, p = l.system, {
    value: c,
    stack: d,
    tiny: a,
    ifEquipped: n
  } = g(this, x, X).call(this, e, l, p), o = t ?? c, m = i ?? d, f = s ?? a, h = r ?? n;
  let v = e.quantity * o;
  m > 1 && (v = Math.ceil(e.quantity / m) * o), h !== null && e.equipped && (v = e.quantity * h), e.slots = {
    value: o,
    resolvedValue: v,
    stack: m,
    tiny: f,
    ifEquipped: h
  };
}, X = function(e, t, i) {
  let s = 1, r = 1, l = !1, p = null;
  if (e.type && e.type.value === "ammo")
    switch (e.identifier) {
      case "arrows":
        s = 20;
        break;
      case "bullets-firearm":
        s = 10;
        break;
      case "bullets-sling":
        s = 20;
        break;
      case "needles":
        s = 50;
        break;
      case "bolts":
        s = 20;
        break;
    }
  if (t.type === "equipment" && e.type)
    switch (e.type.value) {
      case "heavy":
        ["plate-armor", "splint-armor"].includes(e.identifier) ? r = 3 : r = 2;
        break;
      case "medium":
        r = 2;
        break;
      case "light":
        r = 1;
        break;
    }
  return ["gunpowder-keg"].includes(e.identifier) && (r = 2), ["ladder"].includes(e.identifier) && (r = 3), t.type === "weapon" && ["hvy", "two"].some((c) => e.properties.has(c)) && (r = 2), (["clothes-fine", "clothes-travelers", "fine-clothes", "costume"].includes(e.identifier) || e.identifier.startsWith("belt") || e.identifier.startsWith("boots") || e.identifier.startsWith("bracers") || e.identifier.includes("robe")) && (p = 0), ["improvised-weapon", "unarmed-strike", "clawed-gauntlet"].includes(e.identifier) && (r = 0), (e.type && ["gem", "ring"].includes(e.type.value) || ["string"].includes(e.identifier) || e.identifier.startsWith("figurine") || e.identifier.includes("ioun-stone") || e.identifier.includes("amulet") || e.identifier.startsWith("bead-")) && (l = !0), ["candle", "torch", "rations", "ink-pen", "lock"].includes(e.identifier) && (s = 3), ["tent"].includes(e.identifier) && (r = 2), e.type && ["potion", "poison"].includes(e.type.value) && (s = 3), ["parchment", "paper"].includes(e.identifier) && (s = 20), {
    value: r,
    stack: s,
    tiny: l,
    ifEquipped: p
  };
}, q(D, x);
var k, J, Q;
class _ {
  /**
   * Render the TidyCharacterSheet changes
   */
  static render(e, t) {
    g(this, k, J).call(this, e, t);
  }
}
k = new WeakSet(), J = async function(e, t) {
  const i = e.querySelector("div.inventory-content");
  if (!i) return;
  const s = i.querySelector("div.encumbrance-details");
  if (!s) return;
  const { value: r, max: l } = t.system.slotBasedEncumberance;
  s.innerHTML = `
      <div class="pill flexshrink"><span class="text-normal">Strength</span> <span>${t.system.abilities.str.value}</span></div>
      ${g(this, k, Q).call(this, r, l, "fas fa-weight-hanging", "Item Slots")}
    `;
  const p = i.querySelectorAll(
    'div[data-tidy-column-key="capacityBar"]'
  );
  for (const c of p)
    c.style.display = "none";
  i.querySelectorAll('[data-tidy-column-key="weight"]').forEach((c) => {
    c.textContent.trim() === "Weight" && (c.textContent = "Slots");
  }), i.querySelectorAll('.tidy-table-cell[data-tidy-column-key="weight"]').forEach((c) => {
    const d = c.closest("[data-item-id]");
    if (!d) return;
    const a = d.dataset.itemId, n = t.actor.collections.items.get(a);
    if (n.system.slots.tiny)
      c.innerHTML = "<span>Tiny</span>";
    else {
      const o = n.system.slots.resolvedValue, m = "slot" + (o > 1 ? "s" : "");
      c.innerHTML = `<span>${o} <span class="color-text-lighter">${m}</span></span>`;
    }
  }), i.querySelectorAll('.tidy-table-cell[data-tidy-column-key="capacityTracker"]').forEach(async (c) => {
    const d = c.closest("[data-item-id]");
    if (!d) return;
    const a = d.dataset.itemId, n = t.actor.collections.items.get(a), o = await n.system.slotCapacity, m = n.system.slots.capacity.max;
    c.innerHTML = `
      <div class="inline-container-capacity-tracker">
        <div class="label">
          <span class="value font-weight-label">${o}</span>
          <span class="separator">/</span>
          <span class="max color-text-default">${m}</span>
          <span class="units color-text-lightest">slots</span>
        </div>
      </div>
    `;
  });
}, Q = function(e, t, i, s) {
  const r = Math.round(e / t * 100);
  return `
      <div role="meter" 
        aria-valuemin="0" 
        data-tooltip-direction="UP" 
        data-tooltip="${s}"
        class="meter progress encumbrance theme-dark medium${r >= 100 ? "high" : ""}" 
        aria-valuenow="${e / t * 100}" 
        aria-valuetext="${e}" 
        aria-valuemax="${t}" 
        style="--bar-percentage: ${r}%; 
        --encumbrance-low: 33.333333333333336%; 
        --encumbrance-high: 66.66666666666667%;">
          <div class="label">
            <i class="${i} text-label-icon"></i>
             <span class="value font-weight-label">${e}</span> 
             <span class="separator">/</span> 
             <span class="max color-text-default">${t}</span>
          </div> 
          <i class="breakpoint encumbrance-low arrow-up" role="presentation"></i> 
          <i class="breakpoint encumbrance-low arrow-down" role="presentation"></i> 
          <i class="breakpoint encumbrance-high arrow-up" role="presentation"></i> 
          <i class="breakpoint encumbrance-high arrow-down" role="presentation"></i>
        </div>
    `;
}, q(_, k);
const $ = [4, 6, 8, 10, 12, 20, 100];
function me(u, e = 1) {
  return $[Math.min($.indexOf(u) + e, $.length - 1)] ?? null;
}
function ye(u) {
  const e = { ...O, ...F }[u];
  return `${pe}.${e}`;
}
function fe(u, e) {
  return `@UUID[${ye(u)}]{${e}}`;
}
async function L(u, e) {
  const t = await foundry.applications.ux.TextEditor.enrichHTML(fe(u, e)), i = document.createElement("template");
  i.innerHTML = t.trim();
  const s = i.content.firstElementChild, r = s.querySelector("i.fa-solid");
  return r && r.remove(), s;
}
function he(u) {
  return u.toLowerCase().replace(/\b\w/g, (e) => e.toUpperCase());
}
function ge(u) {
  return typeof u.then == "function";
}
class b {
  static getSlotsInputComponent(e) {
    const t = document.createElement("div");
    t.classList.add("form-group", "label-top");
    const i = document.createElement("label");
    i.innerHTML = "Slots";
    const s = document.createElement("input");
    return s.classList.add("better-items-slots"), s.type = "number", s.min = "0", s.value = e.system.slots.value, s.addEventListener("focusout", async (r) => {
      const l = r.target.value ?? s.value, p = parseInt(l);
      Number.isNaN(p) ? (await e.system.parent.unsetFlag(y, "slots"), s.value = e.system.slots.value) : await e.system.parent.setFlag(y, "slots", p);
    }), t.replaceChildren(i, s), t;
  }
  static getIfEquippedInputComponent(e) {
    const t = document.createElement("div");
    t.classList.add("form-group", "label-top");
    const i = document.createElement("label");
    i.innerHTML = "If Equipped";
    const s = document.createElement("input");
    return s.classList.add("better-items-slots"), s.type = "number", s.min = "0", s.value = e.system.slots.ifEquipped, s.addEventListener("focusout", async (r) => {
      const l = r.target.value ?? s.value, p = parseInt(l);
      Number.isNaN(p) ? (await e.system.parent.unsetFlag(y, "ifEquipped"), s.value = e.system.slots.ifEquipped) : await e.system.parent.setFlag(y, "ifEquipped", p);
    }), t.replaceChildren(i, s), t;
  }
  static injectWeightValue(e, t) {
    const i = e.querySelector("div.item-header-summary");
    if (!i) return;
    const s = i.querySelector("span.item-weight-value");
    s && (s.innerHTML = t);
  }
  static toggleSlotsDetailsLock(e, t) {
    const i = e.querySelector("div.tidy-tab.details");
    if (!i) return;
    const s = i.querySelectorAll("input.better-items-slots");
    for (const r of s)
      r.disabled = !t.unlocked;
  }
}
var C, z, Z, K;
class Y {
  /**
   * Render the TidyItemSheet changes
   */
  static render(e, t) {
    g(this, C, Z).call(this, e, t), g(this, C, K).call(this, e, t), b.injectWeightValue(e, g(this, C, z).call(this, t.system.slots)), b.toggleSlotsDetailsLock(e, t);
  }
}
C = new WeakSet(), z = function({ value: e, ifEquipped: t }) {
  const i = t === null ? "" : ` (${t} if equipped)`;
  return `${e}${i}`;
}, Z = function(e, t) {
  var o;
  const i = e.querySelector("div.tidy-tab.details");
  if (i.querySelector(".better-items-slots-group"))
    return;
  const s = (o = i.querySelector(".form-group label[for$='-weight-value']")) == null ? void 0 : o.closest(".form-group");
  if (!s) return;
  s.classList.add("better-items-slots-group");
  const r = s.querySelector("label");
  r && (r.innerHTML = "Slots");
  const l = s.querySelector("div.form-fields");
  if (!l) return;
  const p = b.getSlotsInputComponent(t), c = b.getIfEquippedInputComponent(t), d = document.createElement("div");
  d.classList.add("form-group", "label-top");
  const a = document.createElement("label");
  a.innerHTML = "Capacity";
  const n = document.createElement("input");
  n.classList.add("better-items-slots"), n.type = "number", n.min = "1", n.value = t.system.slots.capacity.max, n.addEventListener("focusout", async (m) => {
    const f = m.target.value ?? n.value, h = parseInt(f);
    Number.isNaN(h) ? (await t.system.parent.unsetFlag(y, "maxCapacity"), n.value = t.system.slots.capacity.max) : await t.system.parent.setFlag(y, "maxCapacity", h);
  }), d.replaceChildren(a, n), l.replaceChildren(p, c, d);
}, K = function(e, t) {
  const i = e.querySelectorAll("fieldset"), s = Array.from(i).find(
    (n) => {
      var o;
      return (o = n.querySelector("legend")) == null ? void 0 : o.textContent.trim().startsWith("Capacity");
    }
  );
  s && s.remove();
  const r = e.querySelectorAll("li.pill"), l = Array.from(r).find((n) => n.textContent.trim().startsWith("Holds"));
  l && (l.textContent = `Holds ${t.system.slots.capacity.max} Slots`);
  const p = e.querySelector("span.capacity-value.text-data");
  if (p) {
    const n = t.system.slotCapacity;
    ge(n) ? n.then((o) => {
      p.innerHTML = o;
    }) : p.innerHTML = t.system.slotCapacity;
  }
  const c = e.querySelector("span.capacity-max.text-data");
  c && (c.innerHTML = t.system.slots.capacity.max);
  const d = e.querySelectorAll(".meter.progress.capacity");
  for (const n of d)
    n.remove();
  const a = e.querySelectorAll('div[data-tidy-column-key="capacityBar"]');
  for (const n of a)
    n.style.display = "none";
  e.querySelectorAll('[data-tidy-column-key="weight"]').forEach((n) => {
    n.textContent.trim() === "Weight" && (n.textContent = "Slots");
  }), e.querySelectorAll('.tidy-table-cell[data-tidy-column-key="weight"]').forEach(async (n) => {
    const o = n.closest("[data-item-id]");
    if (!o) return;
    const m = o.dataset.itemId, f = await t.system.getContainedItem(m);
    if (f.system.slots.tiny)
      n.innerHTML = "<span>Tiny</span>";
    else {
      const h = f.system.slots.resolvedValue, v = "slot" + (h > 1 ? "s" : "");
      n.innerHTML = `<span>${h} <span class="color-text-lighter">${v}</span></span>`;
    }
  }), e.querySelectorAll('.tidy-table-cell[data-tidy-column-key="capacityTracker"]').forEach(async (n) => {
    const o = n.closest("[data-item-id]");
    if (!o) return;
    const m = o.dataset.itemId, f = await t.system.getContainedItem(m), h = await f.system.slotCapacity, v = f.system.slots.capacity.max;
    n.innerHTML = `
      <div class="inline-container-capacity-tracker">
        <div class="label">
          <span class="value font-weight-label">${h}</span>
          <span class="separator">/</span>
          <span class="max color-text-default">${v}</span>
          <span class="units color-text-lightest">slots</span>
        </div>
      </div>
    `;
  });
}, q(Y, C);
var E, te, se, ne;
class ee {
  /**
   * Render the TidyItemSheet changes
   */
  static render(e, t) {
    g(this, E, ne).call(this, e, t), g(this, E, te).call(this, e, t), b.injectWeightValue(e, g(this, E, se).call(this, t.system.slots)), b.toggleSlotsDetailsLock(e, t);
  }
}
E = new WeakSet(), te = async function(e, t) {
  const i = t.data.type;
  if (!["weapon", "equipment"].includes(i)) return;
  const s = t.data.system, r = Array.from(e.querySelectorAll("div")).find(
    (a) => {
      var n, o;
      return ((o = (n = a.querySelector("h4")) == null ? void 0 : n.textContent) == null ? void 0 : o.trim()) === "Action";
    }
  );
  if (!r) return;
  const l = r.querySelector("ul.pills.stacked");
  if (!l) return;
  l.querySelectorAll("li.pill").forEach(async (a) => {
    var o;
    const n = (o = a.textContent) == null ? void 0 : o.trim();
    if (de.test(n)) {
      const m = await L("range", "Range");
      a.replaceChildren(m, n);
    }
  });
  const p = Array.from(e.querySelectorAll("div")).find(
    (a) => {
      var n, o;
      return ((o = (n = a.querySelector("h4")) == null ? void 0 : n.textContent) == null ? void 0 : o.trim()) === "Properties";
    }
  );
  if (!p) return;
  const c = p.querySelector("ul.pills.stacked");
  if (!c) return;
  if (c.querySelectorAll("li.pill").forEach(async (a) => {
    var f;
    const n = (f = a.textContent) == null ? void 0 : f.trim(), o = n.toLowerCase() ?? "";
    if (!(o in { ...O, ...F }))
      return;
    const m = await L(o, n);
    switch (o) {
      case "versatile":
        const h = s.damage.base.number, v = me(s.damage.base.denomination);
        a.replaceChildren(
          m,
          document.createTextNode(` (${h}d${v})`)
        );
        break;
      case "ammunition":
      case "thrown":
        const w = s.range.value, I = s.range.long, N = s.range.units;
        let M = null;
        if (s.ammunition.type) {
          const re = s.ammunition.type, [ae, oe] = ue[re], le = await foundry.applications.ux.TextEditor.enrichHTML(
            `@UUID[${oe}]{${ae}}`
          ), P = document.createElement("template");
          P.innerHTML = le.trim(), M = P.content.firstElementChild;
        }
        const H = document.createElement("span");
        M ? H.replaceChildren(`(${w}/${I} ${N}, `, M, ")") : H.replaceChildren(`(${w}/${I} ${N})`), a.replaceChildren(m, H);
        break;
      case "reload":
        const ie = s.uses.max;
        a.replaceChildren(m, document.createTextNode(` (${ie} shots)`));
        break;
      default:
        a.replaceChildren(m);
    }
  }), console.log(s), ["automatic-rifle"].includes(s.identifier)) {
    const a = await L("burst-fire", "Burst Fire");
    c.insertAdjacentHTML("beforeend", `<li class="pill centered mastery">${a.outerHTML}</li>`);
  }
  const d = s.mastery;
  if (d && !e.querySelector("li.mastery")) {
    const a = await L(d, he(d));
    c.insertAdjacentHTML(
      "beforeend",
      `<li class="pill centered mastery"><span class="text-normal">Mastery</span> ${a.outerHTML}</li>`
    );
  }
}, se = function({ value: e, stack: t, tiny: i, ifEquipped: s }) {
  if (i)
    return "Tiny";
  const r = t === 1 ? "" : ` (Stack: x${t})`, l = s === null ? "" : ` (${s} if equipped)`;
  return `${e}${l}${r}`;
}, ne = function(e, t) {
  var h;
  const i = e.querySelector("div.tidy-tab.details");
  if (i.querySelector(".better-items-slots-group"))
    return;
  const s = (h = i.querySelector(".form-group label[for$='-weight-value']")) == null ? void 0 : h.closest(".form-group");
  if (!s) return;
  s.classList.add("better-items-slots-group");
  const r = s.querySelector("label");
  r && (r.innerHTML = "Slots");
  const l = s.querySelector("div.form-fields");
  if (!l) return;
  const p = b.getSlotsInputComponent(t), c = b.getIfEquippedInputComponent(t), d = document.createElement("div");
  d.classList.add("form-group", "label-top");
  const a = document.createElement("label");
  a.innerHTML = "Stack";
  const n = document.createElement("input");
  n.classList.add("better-items-slots"), n.type = "number", n.min = "1", n.value = t.system.slots.stack, n.addEventListener("focusout", async (v) => {
    const w = v.target.value ?? n.value, I = parseInt(w);
    Number.isNaN(I) ? (await t.system.parent.unsetFlag(y, "stack"), n.value = t.system.slots.stack) : await t.system.parent.setFlag(y, "stack", I);
  }), d.replaceChildren(a, n);
  const o = document.createElement("div");
  o.classList.add("form-group", "label-top"), o.style.alignSelf = "flex-start";
  const m = document.createElement("label");
  m.innerHTML = "Tiny";
  const f = document.createElement("input");
  f.classList.add("better-items-slots"), f.type = "checkbox", f.checked = t.system.slots.tiny, f.addEventListener("change", async (v) => {
    const w = v.target.checked;
    await t.system.parent.setFlag(y, "tiny", w);
  }), o.replaceChildren(m, f), l.replaceChildren(p, d, c, o);
}, q(ee, E);
Hooks.once("init", () => {
  if (!game || !game.settings) return;
  const u = dnd5e.dataModels.item.ContainerData;
  Object.prototype.hasOwnProperty.call(u.prototype, "slotCapacity") || Object.defineProperty(u.prototype, "slotCapacity", {
    get: function() {
      return A.getContainerCapacity(this);
    },
    configurable: !0
  }), game.settings.register(y, "enableTooltips", {
    name: "Enable Property Tooltips",
    hint: "If enabled, item property pills will be replaced with rule reference tooltips.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !0
  });
  for (const e of ["LootData", "WeaponData", "EquipmentData", "ToolData", "ConsumableData"])
    libWrapper.register(
      y,
      `dnd5e.dataModels.item.${e}.prototype.prepareDerivedData`,
      function(t, ...i) {
        let s = t(...i);
        return D.prepareDerivedData(this), s;
      },
      "MIXED"
    );
  libWrapper.register(
    y,
    "dnd5e.dataModels.item.ContainerData.prototype.prepareDerivedData",
    function(e, ...t) {
      let i = e(...t);
      return A.prepareDerivedData(this), i;
    },
    "MIXED"
  ), libWrapper.register(
    y,
    "dnd5e.dataModels.abstract.ItemDataModel.prototype.richTooltip",
    async function(e, ...t) {
      let { content: i, classes: s } = await e(...t);
      return { content: await D.updateRichTooltip(this, i), classes: s };
    },
    "MIXED"
  ), libWrapper.register(
    y,
    "dnd5e.dataModels.actor.CharacterData.prototype.prepareDerivedData",
    function(e, ...t) {
      let i = e(...t);
      return R.prepareDerivedData(this), i;
    },
    "MIXED"
  );
});
Hooks.on("renderTidy5eContainerSheetQuadrone", async (u, e, t) => {
  Y.render(e, t);
});
Hooks.on("renderTidy5eItemSheetQuadrone", async (u, e, t) => {
  ee.render(e, t);
});
Hooks.on("renderTidy5eCharacterSheetQuadrone", async (u, e, t) => {
  _.render(e, t);
});
console.log("dnd5e-tooltips loaded!");
//# sourceMappingURL=module.js.map
