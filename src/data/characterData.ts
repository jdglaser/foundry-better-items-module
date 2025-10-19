export class CharacterData {
  /**
   * Prepare derived CharacterData
   */
  static async prepareDerivedData(data: any) {
    this.#resolveSlotBasedEnumberance(data);
    this.#handleEquipmentProficiency(data);
  }

  /* -------------------------------------------- */

  /**
   * Resolve equipment proficiency penalties
   */
  static async #handleEquipmentProficiency(data: any) {
    const ac = data.attributes.ac;

    const { armors, shields } = data.parent.itemTypes.equipment.reduce(
      (obj: any, equip: any) => {
        if (!equip.system.equipped || !(equip.system.type.value in CONFIG.DND5E.armorTypes)) return obj;
        if (equip.system.type.value === "shield") obj.shields.push(equip);
        else obj.armors.push(equip);
        return obj;
      },
      { armors: [], shields: [] }
    );

    const isProficientShields = data.traits.armorProf.value.has("shl");

    if (shields.length && !isProficientShields) {
      ac.shield = 0;
      ac.value = Math.max(ac.min, ac.base + ac.shield + ac.bonus + ac.cover);
    }

    let wearingNonProficientArmor = false;

    armors.forEach((armor: any) => {
      if (armor.system.proficiencyMultiplier === 0) {
        wearingNonProficientArmor = true;
      }
    });

    if (wearingNonProficientArmor) {
      data.attributes.movement.walk -= 10;
    }
  }

  /* -------------------------------------------- */

  /**
   * Resolve slot based encumberance data for Character
   */
  static async #resolveSlotBasedEnumberance(data: any) {
    console.log("ACTOR:", data);
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
      if (item.system.container) {
        const containerItem = data.parent.collections.items.get(item.system.container);
        console.log("CONTAINERITEM:", containerItem);
        if (containerItem.system.properties.has("weightlessContents")) {
          console.log("WEIGHTLESS:", item);
          continue;
        }
      }

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
