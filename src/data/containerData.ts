import { ItemSlots } from "../types";

export class ItemData {
  /**
   * Prepare derived ItemData
   */
  static async prepareDerivedData(data: any) {
    this.#resolveItemSlots(data);
  }

  /* -------------------------------------------- */

  /**
   * Resolve item slots for item
   */
  static #resolveItemSlots(data: any) {}
}
