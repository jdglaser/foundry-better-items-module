import { MODULE_ID } from "../constants";
import { ContainerSlots } from "../types";

export class ContainerData {
  /**
   * Prepare derived ItemData
   */
  static prepareDerivedData(data: any) {
    this.#resolveSlots(data);
  }

  /* -------------------------------------------- */

  /**
   * Getter method for resolving container capacity slots. Needs to be a getter to avoid race conditions encountered
   * when using prepareDerivedData
   */
  static getContainerCapacity(data: any) {
    const contents = data.contents ?? [];
    let totalSlots = 0;
    for (const item of contents) {
      if (item.type === "container") {
        totalSlots += item.system.slotCapacity + item.system.slots.resolvedValue;
      } else {
        totalSlots += item.system.slots.resolvedValue;
      }
    }

    const { cp = 0, sp = 0, ep = 0, gp = 0, pp = 0 } = data.currency;
    totalSlots += Math.ceil((cp + sp + ep + gp + pp) / 100);
    console.log("totalSlots:", totalSlots);
    return totalSlots;
  }

  /* -------------------------------------------- */

  /**
   * Resolve item slots for item
   */
  static #resolveSlots(data: any) {
    const valueOverride = data.parent.getFlag(MODULE_ID, "slots");
    const ifEquippedOverride = data.parent.getFlag(MODULE_ID, "ifEquipped");
    const maxCapacityOverride = data.parent.getFlag(MODULE_ID, "maxCapacity");

    const parent = data.parent;
    const systemData = parent.system;

    const {
      value: defaultValue,
      ifEquipped: defaultIfEquipped,
      maxCapacity: defaultMaxCapacity,
    } = this.#resolveDefaultContainerSlots(data, parent, systemData);

    const value = valueOverride ?? defaultValue;
    const ifEquipped = ifEquippedOverride ?? defaultIfEquipped;
    const maxCapacity = maxCapacityOverride ?? defaultMaxCapacity;

    let resolvedValue = data.quantity * value;

    if (ifEquipped !== null && data.equipped) {
      resolvedValue = data.quantity * ifEquipped;
    }

    const slots: ContainerSlots = {
      value,
      resolvedValue,
      ifEquipped,
      capacity: {
        max: maxCapacity,
      },
    };

    data.slots = slots;
  }

  /* -------------------------------------------- */

  /**
   * Resolves default slot data for containers
   */
  static #resolveDefaultContainerSlots(data: any, parent: any, systemData: any) {
    // TODO
    return {
      value: 1,
      ifEquipped: null,
      maxCapacity: 10,
    };
  }
}
