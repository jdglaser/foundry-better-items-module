import { ItemSlots } from "../types";
import { Shared } from "./shared";

export class TidyItemSheet {
  /**
   * Render the TidyItemSheet changes
   */
  static render(html: HTMLElement, data: any) {
    this.#injectSlotsDetails(html, data);
    Shared.injectWeightValue(html, this.#formatSlotsShorthand(data.system.slots));
    Shared.toggleSlotsDetailsLock(html, data);
  }

  /* -------------------------------------------- */

  /**
   * Format the slots object as a string
   */
  static #formatSlotsShorthand({ value, stack, tiny, ifEquipped }: ItemSlots) {
    if (tiny) {
      return "Tiny";
    }

    const stackText = stack === 1 ? "" : ` (Stack: x${stack})`;
    const ifEquippedText = ifEquipped === null ? "" : ` (${ifEquipped} if equipped)`;
    return `${value}${ifEquippedText}${stackText}`;
  }

  /* -------------------------------------------- */

  /**
   * Inject HTML for handling slot configuration for an item
   */
  static #injectSlotsDetails(html: HTMLElement, data: any) {
    // Get details tab of item sheet
    const detailsContent = html.querySelector("div.tidy-tab.details") as HTMLElement;

    // Avoid adding the weight group again on re-renders
    if (detailsContent.querySelector(".better-items-slots-group")) {
      return;
    }

    // Get the existing weight group form
    const weightGroup = detailsContent.querySelector(".form-group label[for$='-weight-value']")?.closest(".form-group");
    if (!weightGroup) return;
    weightGroup.classList.add("better-items-slots-group");

    const label = weightGroup.querySelector("label");
    if (label) label.innerHTML = "Slots";

    const formFields = weightGroup.querySelector("div.form-fields");
    if (!formFields) return;

    // Slots input
    const slotsInputContainer = Shared.getSlotsInputComponent(data);

    // If Equipped input
    const ifEquippedInputContainer = Shared.getIfEquippedInputComponent(data);

    // Stack input
    const stackInputContainer = document.createElement("div");
    stackInputContainer.classList.add("form-group", "label-top");
    const stackLabel = document.createElement("label");
    stackLabel.innerHTML = "Stack";

    const stackInput = document.createElement("input");
    stackInput.classList.add("better-items-slots");
    stackInput.type = "number";
    stackInput.min = "1";
    stackInput.value = data.system.slots.stack;

    stackInput.addEventListener("focusout", async (ev) => {
      const value = (ev.target as HTMLInputElement).value ?? stackInput.value;
      const parsedValue = parseInt(value);
      if (Number.isNaN(parsedValue)) {
        await data.system.parent.unsetFlag("dnd5e-better-item-properties", "stack");
        stackInput.value = data.system.slots.stack;
      } else {
        await data.system.parent.setFlag("dnd5e-better-item-properties", "stack", parsedValue);
      }
    });

    stackInputContainer.replaceChildren(stackLabel, stackInput);

    // Tiny input
    const tinyInputContainer = document.createElement("div");
    tinyInputContainer.classList.add("form-group", "label-top");
    tinyInputContainer.style.alignSelf = "flex-start";
    const tinyLabel = document.createElement("label");
    tinyLabel.innerHTML = "Tiny";

    const tinyInput = document.createElement("input");
    tinyInput.classList.add("better-items-slots");
    tinyInput.type = "checkbox";
    tinyInput.checked = data.system.slots.tiny;

    tinyInput.addEventListener("change", async (ev) => {
      const checked = (ev.target as HTMLInputElement).checked;
      await data.system.parent.setFlag("dnd5e-better-item-properties", "tiny", checked);
    });

    tinyInputContainer.replaceChildren(tinyLabel, tinyInput);

    // Inject elements
    formFields.replaceChildren(slotsInputContainer, stackInputContainer, ifEquippedInputContainer, tinyInputContainer);
  }
}
