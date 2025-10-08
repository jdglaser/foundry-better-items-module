var P = (u) => {
  throw TypeError(u);
};
var ce = (u, e, t) => e.has(u) || P("Cannot " + t);
var q = (u, e, t) => e.has(u) ? P("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(u) : e.set(u, t);
var g = (u, e, t) => (ce(u, e, "access private method"), t);
const f = "dnd5e-item-improvements", pe = `Compendium.${f}.rules-reference.JournalEntry.Q4VqflHKEdN7z8Qv.JournalEntryPage`, V = {
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
var w, B, W;
class O {
  /**
   * Prepare derived CharacterData
   */
  static async prepareDerivedData(e) {
    g(this, w, W).call(this, e), g(this, w, B).call(this, e);
  }
}
w = new WeakSet(), B = async function(e) {
  const t = e.attributes.ac, { armors: i, shields: s } = e.parent.itemTypes.equipment.reduce(
    (c, o) => (!o.system.equipped || !(o.system.type.value in CONFIG.DND5E.armorTypes) || (o.system.type.value === "shield" ? c.shields.push(o) : c.armors.push(o)), c),
    { armors: [], shields: [] }
  ), a = e.traits.armorProf.value.has("shl");
  s.length && !a && (t.shield = 0, t.value = Math.max(t.min, t.base + t.shield + t.bonus + t.cover));
  let p = !1;
  i.forEach((c) => {
    c.system.proficiencyMultiplier === 0 && (p = !0);
  }), p && (e.attributes.movement.walk -= 10);
}, W = async function(e) {
  const t = [
    ...e.parent.itemTypes.equipment,
    ...e.parent.itemTypes.consumable,
    ...e.parent.itemTypes.loot,
    ...e.parent.itemTypes.weapon,
    ...e.parent.itemTypes.container
  ];
  let i = 0;
  const { cp: s = 0, sp: a = 0, ep: p = 0, gp: c = 0, pp: o = 0 } = e.currency;
  let d = s + a + p + c + o;
  for (const r of t)
    r.system.slots.tiny ? d += r.system.quantity : i += r.system.slots.resolvedValue;
  i += Math.ceil(d / 100), e.slotBasedEncumberance = {
    value: i,
    max: e.abilities.str.value + 10
  };
}, q(O, w);
var x, R, G;
class A {
  /**
   * Prepare derived ItemData
   */
  static prepareDerivedData(e) {
    g(this, x, R).call(this, e);
  }
  /* -------------------------------------------- */
  /**
   * Getter method for resolving container capacity slots. Needs to be a getter to avoid race conditions encountered
   * when using prepareDerivedData
   */
  static async getContainerCapacity(e) {
    const t = await e.contents ?? [];
    let i = 0;
    const { cp: s = 0, sp: a = 0, ep: p = 0, gp: c = 0, pp: o = 0 } = e.currency;
    let d = s + a + p + c + o;
    for (const r of t)
      if (r.type === "container") {
        const n = await r.system.slotCapacity;
        i += n;
      } else r.system.slots.tiny ? d += r.system.quantity : i += r.system.slots.resolvedValue;
    return i += Math.ceil(d / 100), i;
  }
}
x = new WeakSet(), R = function(e) {
  const t = e.parent.getFlag(f, "slots"), i = e.parent.getFlag(f, "ifEquipped"), s = e.parent.getFlag(f, "maxCapacity"), a = e.parent, p = a.system, {
    value: c,
    ifEquipped: o,
    maxCapacity: d
  } = g(this, x, G).call(this, e, a, p), r = t ?? c, n = i ?? o, l = s ?? d;
  let m = e.quantity * r;
  n !== null && e.equipped && (m = e.quantity * n);
  const y = {
    value: r,
    resolvedValue: m,
    ifEquipped: n,
    capacity: {
      max: l
    }
  };
  e.slots = y;
}, G = function(e, t, i) {
  return {
    value: 1,
    ifEquipped: null,
    maxCapacity: 10
  };
}, q(A, x);
var k, j, X;
class U {
  /**
   * Prepare derived ItemData
   */
  static prepareDerivedData(e) {
    g(this, k, j).call(this, e);
  }
}
k = new WeakSet(), j = function(e) {
  const t = e.parent.getFlag(f, "slots"), i = e.parent.getFlag(f, "stack"), s = e.parent.getFlag(f, "tiny"), a = e.parent.getFlag(f, "ifEquipped"), p = e.parent, c = p.system, {
    value: o,
    stack: d,
    tiny: r,
    ifEquipped: n
  } = g(this, k, X).call(this, e, p, c), l = t ?? o, m = i ?? d, y = s ?? r, h = a ?? n;
  let v = e.quantity * l;
  m > 1 && (v = Math.ceil(e.quantity / m) * l), h !== null && e.equipped && (v = e.quantity * h), e.slots = {
    value: l,
    resolvedValue: v,
    stack: m,
    tiny: y,
    ifEquipped: h
  };
}, X = function(e, t, i) {
  let s = 1, a = 1, p = !1, c = null;
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
        ["plate-armor", "splint-armor"].includes(e.identifier) ? a = 3 : a = 2;
        break;
      case "medium":
        a = 2;
        break;
      case "light":
        a = 1;
        break;
    }
  return ["gunpowder-keg"].includes(e.identifier) && (a = 2), ["ladder"].includes(e.identifier) && (a = 3), t.type === "weapon" && ["hvy", "two"].some((o) => e.properties.has(o)) && (a = 2), (["clothes-fine", "clothes-travelers", "fine-clothes", "costume"].includes(e.identifier) || e.identifier.startsWith("belt") || e.identifier.startsWith("boots") || e.identifier.startsWith("bracers") || e.identifier.includes("robe")) && (c = 0), ["improvised-weapon", "unarmed-strike", "clawed-gauntlet"].includes(e.identifier) && (a = 0), (e.type && ["gem", "ring"].includes(e.type.value) || ["string"].includes(e.identifier) || e.identifier.startsWith("figurine") || e.identifier.includes("ioun-stone") || e.identifier.includes("amulet") || e.identifier.startsWith("bead-")) && (p = !0), ["candle", "torch", "rations", "ink-pen", "lock"].includes(e.identifier) && (s = 5), ["tent"].includes(e.identifier) && (a = 2), e.type && ["potion", "poison"].includes(e.type.value) && (s = 3), (e.type && e.type.value === "scroll" || ["scroll", "map", "parchment", "paper"].includes(e.identifier)) && (s = 20), {
    value: a,
    stack: s,
    tiny: p,
    ifEquipped: c
  };
}, q(U, k);
var I, J, Q;
class _ {
  /**
   * Render the TidyCharacterSheet changes
   */
  static render(e, t) {
    g(this, I, J).call(this, e, t);
  }
}
I = new WeakSet(), J = async function(e, t) {
  const i = e.querySelector("div.inventory-content");
  if (!i) return;
  const s = i.querySelector("div.encumbrance-details");
  if (!s) return;
  const { value: a, max: p } = t.system.slotBasedEncumberance;
  s.innerHTML = `
      <div class="pill flexshrink"><span class="text-normal">Strength</span> <span>${t.system.abilities.str.value}</span></div>
      ${g(this, I, Q).call(this, a, p, "fas fa-weight-hanging", "Item Slots")}
    `;
  const c = i.querySelectorAll(
    'div[data-tidy-column-key="capacityBar"]'
  );
  for (const o of c)
    o.style.display = "none";
  i.querySelectorAll('[data-tidy-column-key="weight"]').forEach((o) => {
    o.textContent.trim() === "Weight" && (o.textContent = "Slots");
  }), i.querySelectorAll('.tidy-table-cell[data-tidy-column-key="weight"]').forEach((o) => {
    const d = o.closest("[data-item-id]");
    if (!d) return;
    const r = d.dataset.itemId, n = t.actor.collections.items.get(r), l = n.system.slots.tiny ? Math.ceil(n.system.quantity / 100) : n.system.slots.resolvedValue, m = "slot" + (l === 1 ? "" : "s");
    o.innerHTML = `<span>${l} <span class="color-text-lighter">${m}</span></span>`;
  }), i.querySelectorAll('.tidy-table-cell[data-tidy-column-key="capacityTracker"]').forEach(async (o) => {
    const d = o.closest("[data-item-id]");
    if (!d) return;
    const r = d.dataset.itemId, n = t.actor.collections.items.get(r), l = await n.system.slotCapacity, m = n.system.slots.capacity.max;
    o.innerHTML = `
      <div class="inline-container-capacity-tracker">
        <div class="label">
          <span class="value font-weight-label">${l}</span>
          <span class="separator">/</span>
          <span class="max color-text-default">${m}</span>
          <span class="units color-text-lightest">slots</span>
        </div>
      </div>
    `;
  });
}, Q = function(e, t, i, s) {
  const a = Math.round(e / t * 100);
  return `
      <div role="meter" 
        aria-valuemin="0" 
        data-tooltip-direction="UP" 
        data-tooltip="${s}"
        class="meter progress encumbrance theme-dark medium${a >= 100 ? "high" : ""}" 
        aria-valuenow="${e / t * 100}" 
        aria-valuetext="${e}" 
        aria-valuemax="${t}" 
        style="--bar-percentage: ${a}%; 
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
}, q(_, I);
const $ = [4, 6, 8, 10, 12, 20, 100];
function me(u, e = 1) {
  return $[Math.min($.indexOf(u) + e, $.length - 1)] ?? null;
}
function ye(u) {
  const e = { ...V, ...F }[u];
  return `${pe}.${e}`;
}
function fe(u, e) {
  return `@UUID[${ye(u)}]{${e}}`;
}
async function L(u, e) {
  const t = await foundry.applications.ux.TextEditor.enrichHTML(fe(u, e)), i = document.createElement("template");
  i.innerHTML = t.trim();
  const s = i.content.firstElementChild, a = s.querySelector("i.fa-solid");
  return a && a.remove(), s;
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
    return s.classList.add("better-items-slots"), s.type = "number", s.min = "0", s.value = e.system.slots.value, s.addEventListener("focusout", async (a) => {
      const p = a.target.value ?? s.value, c = parseInt(p);
      Number.isNaN(c) ? (await e.system.parent.unsetFlag(f, "slots"), s.value = e.system.slots.value) : await e.system.parent.setFlag(f, "slots", c);
    }), t.replaceChildren(i, s), t;
  }
  static getIfEquippedInputComponent(e) {
    const t = document.createElement("div");
    t.classList.add("form-group", "label-top");
    const i = document.createElement("label");
    i.innerHTML = "If Equipped";
    const s = document.createElement("input");
    return s.classList.add("better-items-slots"), s.type = "number", s.min = "0", s.value = e.system.slots.ifEquipped, s.addEventListener("focusout", async (a) => {
      const p = a.target.value ?? s.value, c = parseInt(p);
      Number.isNaN(c) ? (await e.system.parent.unsetFlag(f, "ifEquipped"), s.value = e.system.slots.ifEquipped) : await e.system.parent.setFlag(f, "ifEquipped", c);
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
    for (const a of s)
      a.disabled = !t.unlocked;
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
  var l;
  const i = e.querySelector("div.tidy-tab.details");
  if (i.querySelector(".better-items-slots-group"))
    return;
  const s = (l = i.querySelector(".form-group label[for$='-weight-value']")) == null ? void 0 : l.closest(".form-group");
  if (!s) return;
  s.classList.add("better-items-slots-group");
  const a = s.querySelector("label");
  a && (a.innerHTML = "Slots");
  const p = s.querySelector("div.form-fields");
  if (!p) return;
  const c = b.getSlotsInputComponent(t), o = b.getIfEquippedInputComponent(t), d = document.createElement("div");
  d.classList.add("form-group", "label-top");
  const r = document.createElement("label");
  r.innerHTML = "Capacity";
  const n = document.createElement("input");
  n.classList.add("better-items-slots"), n.type = "number", n.min = "1", n.value = t.system.slots.capacity.max, n.addEventListener("focusout", async (m) => {
    const y = m.target.value ?? n.value, h = parseInt(y);
    Number.isNaN(h) ? (await t.system.parent.unsetFlag(f, "maxCapacity"), n.value = t.system.slots.capacity.max) : await t.system.parent.setFlag(f, "maxCapacity", h);
  }), d.replaceChildren(r, n), p.replaceChildren(c, o, d);
}, K = function(e, t) {
  const i = e.querySelectorAll("fieldset"), s = Array.from(i).find(
    (n) => {
      var l;
      return (l = n.querySelector("legend")) == null ? void 0 : l.textContent.trim().startsWith("Capacity");
    }
  );
  s && s.remove();
  const a = e.querySelectorAll("li.pill"), p = Array.from(a).find((n) => n.textContent.trim().startsWith("Holds"));
  p && (p.textContent = `Holds ${t.system.slots.capacity.max} Slots`);
  const c = e.querySelector("span.capacity-value.text-data");
  if (c) {
    const n = t.system.slotCapacity;
    ge(n) ? n.then((l) => {
      c.innerHTML = l;
    }) : c.innerHTML = t.system.slotCapacity;
  }
  const o = e.querySelector("span.capacity-max.text-data");
  o && (o.innerHTML = t.system.slots.capacity.max);
  const d = e.querySelectorAll(".meter.progress.capacity");
  for (const n of d)
    n.remove();
  const r = e.querySelectorAll('div[data-tidy-column-key="capacityBar"]');
  for (const n of r)
    n.style.display = "none";
  e.querySelectorAll('[data-tidy-column-key="weight"]').forEach((n) => {
    n.textContent.trim() === "Weight" && (n.textContent = "Slots");
  }), e.querySelectorAll('.tidy-table-cell[data-tidy-column-key="weight"]').forEach(async (n) => {
    const l = n.closest("[data-item-id]");
    if (!l) return;
    const m = l.dataset.itemId, y = await t.system.getContainedItem(m), h = y.system.slots.tiny ? Math.ceil(y.system.quantity / 100) : y.system.slots.resolvedValue, v = "slot" + (h > 1 ? "s" : "");
    n.innerHTML = `<span>${h} <span class="color-text-lighter">${v}</span></span>`;
  }), e.querySelectorAll('.tidy-table-cell[data-tidy-column-key="capacityTracker"]').forEach(async (n) => {
    const l = n.closest("[data-item-id]");
    if (!l) return;
    const m = l.dataset.itemId, y = await t.system.getContainedItem(m), h = await y.system.slotCapacity, v = y.system.slots.capacity.max;
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
  const s = t.data.system, a = Array.from(e.querySelectorAll("div")).find(
    (r) => {
      var n, l;
      return ((l = (n = r.querySelector("h4")) == null ? void 0 : n.textContent) == null ? void 0 : l.trim()) === "Action";
    }
  );
  if (!a) return;
  const p = a.querySelector("ul.pills.stacked");
  if (!p) return;
  p.querySelectorAll("li.pill").forEach(async (r) => {
    var l;
    const n = (l = r.textContent) == null ? void 0 : l.trim();
    if (de.test(n)) {
      const m = await L("range", "Range");
      r.replaceChildren(m, n);
    }
  });
  const c = Array.from(e.querySelectorAll("div")).find(
    (r) => {
      var n, l;
      return ((l = (n = r.querySelector("h4")) == null ? void 0 : n.textContent) == null ? void 0 : l.trim()) === "Properties";
    }
  );
  if (!c) return;
  const o = c.querySelector("ul.pills.stacked");
  if (!o) return;
  if (o.querySelectorAll("li.pill").forEach(async (r) => {
    var y;
    const n = (y = r.textContent) == null ? void 0 : y.trim(), l = n.toLowerCase() ?? "";
    if (!(l in { ...V, ...F }))
      return;
    const m = await L(l, n);
    switch (l) {
      case "versatile":
        const h = s.damage.base.number, v = me(s.damage.base.denomination);
        r.replaceChildren(
          m,
          document.createTextNode(` (${h}d${v})`)
        );
        break;
      case "ammunition":
      case "thrown":
        const S = s.range.value, T = s.range.long, D = s.range.units;
        let M = null;
        if (s.ammunition.type) {
          const ae = s.ammunition.type, [re, le] = ue[ae], oe = await foundry.applications.ux.TextEditor.enrichHTML(
            `@UUID[${le}]{${re}}`
          ), N = document.createElement("template");
          N.innerHTML = oe.trim(), M = N.content.firstElementChild;
        }
        const H = document.createElement("span");
        M ? H.replaceChildren(`(${S}/${T} ${D}, `, M, ")") : H.replaceChildren(`(${S}/${T} ${D})`), r.replaceChildren(m, H);
        break;
      case "reload":
        const ie = s.uses.max;
        r.replaceChildren(m, document.createTextNode(` (${ie} shots)`));
        break;
      default:
        r.replaceChildren(m);
    }
  }), console.log(s), ["automatic-rifle"].includes(s.identifier)) {
    const r = await L("burst-fire", "Burst Fire");
    o.insertAdjacentHTML("beforeend", `<li class="pill centered mastery">${r.outerHTML}</li>`);
  }
  const d = s.mastery;
  if (d && !e.querySelector("li.mastery")) {
    const r = await L(d, he(d));
    o.insertAdjacentHTML(
      "beforeend",
      `<li class="pill centered mastery"><span class="text-normal">Mastery</span> ${r.outerHTML}</li>`
    );
  }
}, se = function({ value: e, stack: t, tiny: i, ifEquipped: s }) {
  if (i)
    return "Tiny";
  const a = t === 1 ? "" : ` (Stack: x${t})`, p = s === null ? "" : ` (${s} if equipped)`;
  return `${e}${p}${a}`;
}, ne = function(e, t) {
  var h;
  const i = e.querySelector("div.tidy-tab.details");
  if (i.querySelector(".better-items-slots-group"))
    return;
  const s = (h = i.querySelector(".form-group label[for$='-weight-value']")) == null ? void 0 : h.closest(".form-group");
  if (!s) return;
  s.classList.add("better-items-slots-group");
  const a = s.querySelector("label");
  a && (a.innerHTML = "Slots");
  const p = s.querySelector("div.form-fields");
  if (!p) return;
  const c = b.getSlotsInputComponent(t), o = b.getIfEquippedInputComponent(t), d = document.createElement("div");
  d.classList.add("form-group", "label-top");
  const r = document.createElement("label");
  r.innerHTML = "Stack";
  const n = document.createElement("input");
  n.classList.add("better-items-slots"), n.type = "number", n.min = "1", n.value = t.system.slots.stack, n.addEventListener("focusout", async (v) => {
    const S = v.target.value ?? n.value, T = parseInt(S);
    Number.isNaN(T) ? (await t.system.parent.unsetFlag(f, "stack"), n.value = t.system.slots.stack) : await t.system.parent.setFlag(f, "stack", T);
  }), d.replaceChildren(r, n);
  const l = document.createElement("div");
  l.classList.add("form-group", "label-top"), l.style.alignSelf = "flex-start";
  const m = document.createElement("label");
  m.innerHTML = "Tiny";
  const y = document.createElement("input");
  y.classList.add("better-items-slots"), y.type = "checkbox", y.checked = t.system.slots.tiny, y.addEventListener("change", async (v) => {
    const S = v.target.checked;
    await t.system.parent.setFlag(f, "tiny", S);
  }), l.replaceChildren(m, y), p.replaceChildren(c, d, o, l);
}, q(ee, E);
Hooks.once("init", () => {
  if (!game || !game.settings) return;
  const u = dnd5e.dataModels.item.ContainerData;
  Object.prototype.hasOwnProperty.call(u.prototype, "slotCapacity") || Object.defineProperty(u.prototype, "slotCapacity", {
    get: function() {
      return A.getContainerCapacity(this);
    },
    configurable: !0
  }), game.settings.register(f, "enableTooltips", {
    name: "Enable Property Tooltips",
    hint: "If enabled, item property pills will be replaced with rule reference tooltips.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !0
  });
  for (const e of ["LootData", "WeaponData", "EquipmentData", "ToolData", "ConsumableData"])
    libWrapper.register(
      f,
      `dnd5e.dataModels.item.${e}.prototype.prepareDerivedData`,
      function(t, ...i) {
        let s = t(...i);
        return U.prepareDerivedData(this), s;
      },
      "MIXED"
    );
  libWrapper.register(
    f,
    "dnd5e.dataModels.item.ContainerData.prototype.prepareDerivedData",
    function(e, ...t) {
      let i = e(...t);
      return A.prepareDerivedData(this), i;
    },
    "MIXED"
  ), libWrapper.register(
    f,
    "dnd5e.dataModels.actor.CharacterData.prototype.prepareDerivedData",
    function(e, ...t) {
      let i = e(...t);
      return O.prepareDerivedData(this), i;
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
