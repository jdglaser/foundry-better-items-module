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
      ...data.parent.itemTypes.container,
    ];

    let currentCapacity = 0;
    const { cp = 0, sp = 0, ep = 0, gp = 0, pp = 0 } = data.currency;
    let tinyItems = cp + sp + ep + gp + pp;
    for (const item of allItems) {
      if (item.system.slots.tiny) {
        tinyItems += item.system.quantity;
      } else {
        currentCapacity += item.system.slots.resolvedValue;
      }
    }

    currentCapacity += Math.ceil(tinyItems / 100);

    data.slotBasedEncumberance = {
      value: currentCapacity,
      max: data.abilities.str.value + 10,
    };
  }
}
