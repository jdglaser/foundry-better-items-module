import { ContainerSlots } from "../types";

export class ContainerData {
  /**
   * Prepare derived ItemData
   */
  static prepareDerivedData(data: any) {
    console.log("PREP");
    this.#resolveSlots(data);
  }

  static prepareBaseData(data: any) {
    console.log("BASE:", data);
    data.system.slots = {
      value: 0,
      resolvedValue: 0,
      ifEquipped: null,
      capacity: {
        value: 0,
        max: 0,
      },
    };
  }

  /* -------------------------------------------- */

  /**
   * Resolve item slots for item
   */
  static #resolveSlots(data: any) {
    const valueOverride = data.parent.getFlag("dnd5e-better-item-properties", "slots");
    const ifEquippedOverride = data.parent.getFlag("dnd5e-better-item-properties", "ifEquipped");
    const maxCapacityOverride = data.parent.getFlag("dnd5e-better-item-properties", "maxCapacity");

    const parent = data.parent;
    const systemData = parent.system;

    console.log("RESOLVE");

    const {
      value: defaultValue,
      ifEquipped: defaultIfEquipped,
      maxCapacity: defaultMaxCapacity,
    } = this.#resolveDefaultContainerSlots(data, parent, systemData);
    const currentValue = this.#calculateContainerCurrentCapacity(data);
    console.log("CURRENT VALUE:", currentValue);

    const value = valueOverride ?? defaultValue;
    const ifEquipped = ifEquippedOverride ?? defaultIfEquipped;
    const maxCapacity = maxCapacityOverride ?? defaultMaxCapacity;

    let resolvedValue = data.quantity * value;

    if (ifEquipped !== null) {
      resolvedValue = data.quantity * ifEquipped;
    }

    const slots: ContainerSlots = {
      value,
      resolvedValue,
      ifEquipped,
      capacity: {
        value: currentValue,
        max: maxCapacity,
      },
    };

    console.log("SLOTS:", slots);

    data.slots = slots;
  }

  static #resolveDefaultContainerSlots(data: any, parent: any, systemData: any) {
    // TODO
    return {
      value: 1,
      ifEquipped: null,
      maxCapacity: 10,
    };
  }

  static #calculateContainerCurrentCapacity(data: any) {
    const contents = data.contents;
    console.log("CONTAINER:", data);
    let totalSlots = 0;
    for (const item of contents) {
      console.log("SUB ITEM:", item);
      if (item.type === "container") {
        /*while (!item.system.slots) {
          console.log("IN LOOP for ", item.name);
          //await item.prepareBaseData();
          await item.prepareDerivedData();
        }*/
        console.log("CONTAINER ITEM:", item);
        console.log("CONTAINER ITEM SLOTS:", item.system.slots);
        totalSlots += item.system.slots.capacity.value + item.system.slots.resolvedValue;
      } else {
        console.log("FAILED ITEM:", item);
        totalSlots += item.system.slots.resolvedValue;
      }
    }
    return totalSlots;
  }
}
