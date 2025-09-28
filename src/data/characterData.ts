export class CharacterData {
  /**
   * Prepare derived CharacterData
   */
  static async prepareDerivedData(data: any) {
    this.#resolveSlotBasedEnumberance(data);
  }

  /* -------------------------------------------- */

  /**
   * Resolve slot based encumberance data for Character
   */
  static async #resolveSlotBasedEnumberance(data: any) {
    const allItems = [
      ...data.parent.itemTypes.equipment,
      ...data.parent.itemTypes.consumable,
      ...data.parent.itemTypes.loot,
      ...data.parent.itemTypes.weapon,
      // TODO ...data.parent.itemTypes.container,
    ];

    let currentCapacity = 0;
    const { cp = 0, sp = 0, ep = 0, gp = 0, pp = 0 } = data.currency;
    let tinyItems = cp + sp + ep + gp + pp;
    for (const item of allItems) {
      if (item.system.slots.stack > 1) {
        currentCapacity += Math.ceil(item.system.quantity / item.system.slots.stack) * item.system.slots.value;
      } else if (item.system.slots.tiny) {
        tinyItems += item.system.quantity;
      } else {
        if (item.system.slots.ifEquipped !== item.system.slots.value && item.system.equipped) {
          currentCapacity += item.system.quantity * item.system.slots.ifEquipped;
        } else {
          currentCapacity += item.system.quantity * item.system.slots.value;
        }
      }
    }

    // TODO: Handle containers

    currentCapacity += Math.ceil(tinyItems / 100);

    data.slotBasedEncumberance = {
      value: currentCapacity,
      max: data.abilities.str.value + 10,
    };
  }
}
