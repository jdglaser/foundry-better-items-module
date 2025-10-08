import { MODULE_ID } from "../constants";
import { ContainerSlots } from "../types";
import { isPromise } from "../utils";
import { Shared } from "./shared";

export class TidyContainerSheet {
  /**
   * Render the TidyItemSheet changes
   */
  static render(html: HTMLElement, data: any) {
    this.#injectSlotsDetails(html, data);
    this.#replaceHTMLElements(html, data);
    Shared.injectWeightValue(html, this.#formatSlotsShorthand(data.system.slots));
    Shared.toggleSlotsDetailsLock(html, data);
  }

  /* -------------------------------------------- */

  /**
   * Format the slots object as a string
   */
  static #formatSlotsShorthand({ value, ifEquipped }: ContainerSlots) {
    const ifEquippedText = ifEquipped === null ? "" : ` (${ifEquipped} if equipped)`;
    return `${value}${ifEquippedText}`;
  }

  /* -------------------------------------------- */

  /**
   * Inject HTML for handling slot configuration for a container
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

    // Capacity input
    const capacityInputContainer = document.createElement("div");
    capacityInputContainer.classList.add("form-group", "label-top");
    const capacityLabel = document.createElement("label");
    capacityLabel.innerHTML = "Capacity";

    const capacityInput = document.createElement("input");
    capacityInput.classList.add("better-items-slots");
    capacityInput.type = "number";
    capacityInput.min = "1";
    capacityInput.value = data.system.slots.capacity.max;

    capacityInput.addEventListener("focusout", async (ev) => {
      const value = (ev.target as HTMLInputElement).value ?? capacityInput.value;
      const parsedValue = parseInt(value);
      if (Number.isNaN(parsedValue)) {
        await data.system.parent.unsetFlag(MODULE_ID, "maxCapacity");
        capacityInput.value = data.system.slots.capacity.max;
      } else {
        await data.system.parent.setFlag(MODULE_ID, "maxCapacity", parsedValue);
      }
    });

    capacityInputContainer.replaceChildren(capacityLabel, capacityInput);

    // Inject elements
    formFields.replaceChildren(slotsInputContainer, ifEquippedInputContainer, capacityInputContainer);
  }

  /* -------------------------------------------- */

  /**
   * Inject HTML for slots used
   */
  static #replaceHTMLElements(html: HTMLElement, data: any) {
    // Remove legacy capacity settings
    const fieldsets = html.querySelectorAll("fieldset");
    const capacityFieldset = Array.from(fieldsets).find((fs) =>
      fs.querySelector("legend")?.textContent.trim().startsWith("Capacity")
    );
    if (capacityFieldset) capacityFieldset.remove();

    // Update capacity pill
    // If there are multiple pills, filter by text
    const pills = html.querySelectorAll("li.pill");
    const capacityPill = Array.from(pills).find((p) => p.textContent.trim().startsWith("Holds"));

    if (capacityPill) {
      capacityPill.textContent = `Holds ${data.system.slots.capacity.max} Slots`;
    }

    // Update the capacity counter
    const capacityValueText = html.querySelector("span.capacity-value.text-data");
    if (capacityValueText) {
      const slotCapacity = data.system.slotCapacity;
      if (isPromise(slotCapacity)) {
        slotCapacity.then((value) => {
          capacityValueText.innerHTML = value;
        });
      } else {
        capacityValueText.innerHTML = data.system.slotCapacity;
      }
    }

    const capacityMaxText = html.querySelector("span.capacity-max.text-data");
    if (capacityMaxText) capacityMaxText.innerHTML = data.system.slots.capacity.max;

    // Remove progress meter
    const progressMeters = html.querySelectorAll(".meter.progress.capacity");
    for (const meter of progressMeters) {
      meter.remove();
    }

    // Hide weight based capacity bar for container items
    const capacityBars = html.querySelectorAll('div[data-tidy-column-key="capacityBar"]') as NodeListOf<HTMLElement>;
    for (const bar of capacityBars) {
      bar.style.display = "none";
    }

    // Update all weight rows to slots
    html.querySelectorAll('[data-tidy-column-key="weight"]').forEach((el) => {
      if (el.textContent.trim() === "Weight") {
        el.textContent = "Slots";
      }
    });
    html.querySelectorAll('.tidy-table-cell[data-tidy-column-key="weight"]').forEach(async (el) => {
      const row = el.closest("[data-item-id]") as HTMLElement | null;
      if (!row) return;

      const itemId = row.dataset.itemId;
      const item = await data.system.getContainedItem(itemId);

      const slotValue = item.system.slots.tiny
        ? Math.ceil(item.system.quantity / 100)
        : item.system.slots.resolvedValue;
      const slotLabel = "slot" + (slotValue > 1 ? "s" : "");
      el.innerHTML = `<span>${slotValue} <span class="color-text-lighter">${slotLabel}</span></span>`;
    });

    // Replace container capacity tracker cells
    html.querySelectorAll('.tidy-table-cell[data-tidy-column-key="capacityTracker"]').forEach(async (el) => {
      const row = el.closest("[data-item-id]") as HTMLElement | null;
      if (!row) return;

      const itemId = row.dataset.itemId;
      const item = await data.system.getContainedItem(itemId);

      // Grab slots
      const used = await item.system.slotCapacity;
      const max = item.system.slots.capacity.max;

      // Replace HTML
      el.innerHTML = `
      <div class="inline-container-capacity-tracker">
        <div class="label">
          <span class="value font-weight-label">${used}</span>
          <span class="separator">/</span>
          <span class="max color-text-default">${max}</span>
          <span class="units color-text-lightest">slots</span>
        </div>
      </div>
    `;
    });
  }
}
