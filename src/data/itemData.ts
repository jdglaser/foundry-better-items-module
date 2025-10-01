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
  static #resolveItemSlots(data: any) {
    const valueOverride = data.parent.getFlag("dnd5e-better-item-properties", "slots");
    const stackOverride = data.parent.getFlag("dnd5e-better-item-properties", "stack");
    const tinyOverride = data.parent.getFlag("dnd5e-better-item-properties", "tiny");
    const ifEquippedOverride = data.parent.getFlag("dnd5e-better-item-properties", "ifEquipped");

    // types {'weapon', 'equipment', 'consumable', 'loot', 'tool'}
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

    if (ifEquipped !== null) {
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
          value = 2;
          break;
        case "medium":
          value = 2;
          break;
        case "light":
          value = 1;
          break;
      }
    }

    if (parentData.type === "weapon") {
      if (["hvy", "two"].some((prop) => itemData.properties.has(prop))) value = 2;
    }

    // 0 if equipped
    if (["clothes-fine", "clothes-travelers", "fine-clothes"].includes(itemData.identifier)) ifEquipped = 0;

    if (["improvised-weapon", "unarmed-strike", "clawed-gauntlet"].includes(itemData.identifier)) value = 0;

    if (itemData.type && ["gem", "ring"].includes(itemData.type.value)) tiny = true;

    return {
      value,
      stack,
      tiny,
      ifEquipped,
    };
  }
}
