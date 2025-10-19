import { MODULE_ID } from "../constants";
import { ItemSlots } from "../types";

export class ItemData {
  /**
   * Prepare derived ItemData
   */
  static prepareDerivedData(data: any) {
    this.#resolveItemSlots(data);
  }

  /* -------------------------------------------- */

  /**
   * Resolve item slots for item
   */
  static async updateRichTooltip(data: any, content: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const weightDiv = doc.querySelector(".weight");
    if (weightDiv) {
      const span = weightDiv.querySelector("span");
      if (span) {
        if (data.slots.tiny) {
          span.textContent = "Tiny";
        } else if (data.slots.stack && data.slots.stack !== data.slots.resolvedValue) {
          span.textContent = `${data.slots.resolvedValue} (x${data.slots.stack})`;
        } else {
          span.textContent = data.slots.resolvedValue;
        }
      }
    }
    return doc.body.innerHTML.trim();
  }

  /* -------------------------------------------- */

  /**
   * Resolve item slots for item
   */
  static #resolveItemSlots(data: any) {
    const valueOverride = data.parent.getFlag(MODULE_ID, "slots");
    const stackOverride = data.parent.getFlag(MODULE_ID, "stack");
    const tinyOverride = data.parent.getFlag(MODULE_ID, "tiny");
    const ifEquippedOverride = data.parent.getFlag(MODULE_ID, "ifEquipped");

    const parent = data.parent;
    const systemData = parent.system;

    const {
      value: defaultValue,
      stack: defaultStack,
      tiny: defaultTiny,
      ifEquipped: defaultIfEquipped,
    } = this.#resolveDefaultItemSlots(data, parent, systemData);

    const value = valueOverride ?? defaultValue;
    const stack = stackOverride ?? defaultStack;
    const tiny = tinyOverride ?? defaultTiny;
    const ifEquipped = ifEquippedOverride ?? defaultIfEquipped;

    let resolvedValue = data.quantity * value;
    if (stack > 1) {
      resolvedValue = Math.ceil(data.quantity / stack) * value;
    }

    if (ifEquipped !== null && data.equipped) {
      resolvedValue = data.quantity * ifEquipped;
    }

    data.slots = {
      value,
      resolvedValue,
      stack,
      tiny,
      ifEquipped,
    };
  }

  /* -------------------------------------------- */

  /**
   * Resolve default item slots for item
   */
  static #resolveDefaultItemSlots(itemData: any, parentData: any, systemData: any) {
    let stack = 1;
    let value = 1;
    let tiny = false;
    let ifEquipped = null;
    if (itemData.type && itemData.type.value === "ammo") {
      switch (itemData.identifier) {
        case "arrows":
          stack = 20;
          break;
        case "bullets-firearm":
          stack = 10;
          break;
        case "bullets-sling":
          stack = 20;
          break;
        case "needles":
          stack = 50;
          break;
        case "bolts":
          stack = 20;
          break;
      }
    }

    if (parentData.type === "equipment" && itemData.type) {
      switch (itemData.type.value) {
        case "heavy":
          if (["plate-armor", "splint-armor"].includes(itemData.identifier)) {
            value = 3;
          } else {
            value = 2;
          }
          break;
        case "medium":
          value = 2;
          break;
        case "light":
          value = 1;
          break;
      }
    }

    if (["gunpowder-keg"].includes(itemData.identifier)) {
      value = 2;
    }

    if (["ladder"].includes(itemData.identifier)) {
      value = 3;
    }

    if (parentData.type === "weapon") {
      if (["hvy", "two"].some((prop) => itemData.properties.has(prop))) value = 2;
    }

    if (
      ["clothes-fine", "clothes-travelers", "fine-clothes", "costume"].includes(itemData.identifier) ||
      itemData.identifier.startsWith("belt") ||
      itemData.identifier.startsWith("boots") ||
      itemData.identifier.startsWith("bracers") ||
      itemData.identifier.includes("robe")
    )
      ifEquipped = 0;

    if (["improvised-weapon", "unarmed-strike", "clawed-gauntlet"].includes(itemData.identifier)) value = 0;

    if (
      (itemData.type && ["gem", "ring"].includes(itemData.type.value)) ||
      ["string"].includes(itemData.identifier) ||
      itemData.identifier.startsWith("figurine") ||
      itemData.identifier.includes("ioun-stone") ||
      itemData.identifier.includes("amulet") ||
      itemData.identifier.startsWith("bead-")
    )
      tiny = true;

    if (["candle", "torch", "rations", "ink-pen", "lock"].includes(itemData.identifier)) {
      stack = 3;
    }

    if (["tent"].includes(itemData.identifier)) {
      value = 2;
    }

    if (itemData.type && ["potion", "poison"].includes(itemData.type.value)) {
      stack = 3;
    }

    if (["parchment", "paper"].includes(itemData.identifier)) {
      stack = 20;
    }

    // TODO: More defaults, but I'm all done

    return {
      value,
      stack,
      tiny,
      ifEquipped,
    };
  }
}
