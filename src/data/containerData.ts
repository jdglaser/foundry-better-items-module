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
  static async getContainerCapacity(data: any) {
    const contents = (await data.contents) ?? [];
    let totalSlots = 0;
    const { cp = 0, sp = 0, ep = 0, gp = 0, pp = 0 } = data.currency;
    let tinyItems = cp + sp + ep + gp + pp;
    for (const item of contents) {
      if (item.type === "container") {
        const capacity = await item.system.slotCapacity;
        totalSlots += capacity;
      } else if (item.system.slots.tiny) {
        tinyItems += item.system.quantity;
      } else {
        totalSlots += item.system.slots.resolvedValue;
      }
    }

    totalSlots += Math.ceil(tinyItems / 100);
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
    let ifEquipped = null;
    let value = 1;
    let maxCapacity = 10;

    // TODO
    return {
      value,
      ifEquipped,
      maxCapacity,
    };
  }
}
