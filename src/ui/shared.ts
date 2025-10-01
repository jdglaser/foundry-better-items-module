export class Shared {
  static getSlotsInputComponent(data: any) {
    const slotsInputContainer = document.createElement("div");
    slotsInputContainer.classList.add("form-group", "label-top");
    const slotsLabel = document.createElement("label");
    slotsLabel.innerHTML = "Slots";

    const slotsInput = document.createElement("input");
    slotsInput.classList.add("better-items-slots");
    slotsInput.type = "number";
    slotsInput.min = "0";
    console.log("DATA IN SLOTS:", data);
    slotsInput.value = data.system.slots.value;

    slotsInput.addEventListener("focusout", async (ev) => {
      const value = (ev.target as HTMLInputElement).value ?? slotsInput.value;
      const parsedValue = parseInt(value);
      if (Number.isNaN(parsedValue)) {
        await data.system.parent.unsetFlag("dnd5e-better-item-properties", "slots");
        slotsInput.value = data.system.slots.value;
      } else {
        await data.system.parent.setFlag("dnd5e-better-item-properties", "slots", parsedValue);
      }
    });

    slotsInputContainer.replaceChildren(slotsLabel, slotsInput);
    return slotsInputContainer;
  }

  static getIfEquippedInputComponent(data: any) {
    const ifEquippedInputContainer = document.createElement("div");
    ifEquippedInputContainer.classList.add("form-group", "label-top");
    const ifEquippedLabel = document.createElement("label");
    ifEquippedLabel.innerHTML = "If Equipped";

    const ifEquippedInput = document.createElement("input");
    ifEquippedInput.classList.add("better-items-slots");
    ifEquippedInput.type = "number";
    ifEquippedInput.min = "0";
    ifEquippedInput.value = data.system.slots.ifEquipped;

    ifEquippedInput.addEventListener("focusout", async (ev) => {
      const value = (ev.target as HTMLInputElement).value ?? ifEquippedInput.value;
      const parsedValue = parseInt(value);
      if (Number.isNaN(parsedValue)) {
        await data.system.parent.unsetFlag("dnd5e-better-item-properties", "ifEquipped");
        ifEquippedInput.value = data.system.slots.ifEquipped;
      } else {
        await data.system.parent.setFlag("dnd5e-better-item-properties", "ifEquipped", parsedValue);
      }
    });

    ifEquippedInputContainer.replaceChildren(ifEquippedLabel, ifEquippedInput);
    return ifEquippedInputContainer;
  }

  static injectWeightValue(html: HTMLElement, value: string) {
    const headerHtml = html.querySelector("div.item-header-summary") as HTMLElement | null;
    if (!headerHtml) return;

    const itemWeightValue = headerHtml.querySelector("span.item-weight-value");
    if (itemWeightValue) itemWeightValue.innerHTML = value;
  }

  static toggleSlotsDetailsLock(html: HTMLElement, data: any) {
    const detailsContent = html.querySelector("div.tidy-tab.details") as HTMLElement | null;
    if (!detailsContent) return;

    const inputs = detailsContent.querySelectorAll("input.better-items-slots") as NodeListOf<HTMLInputElement>;
    for (const input of inputs) {
      input.disabled = !data.unlocked;
    }
  }
}
