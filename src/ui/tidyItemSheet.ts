import {
  AMMO_TYPE_MAP,
  MODULE_ID,
  RANGE_REGEX,
  WEAPON_MASTERY_DOCUMENT_MAP,
  WEAPON_PROPERTY_DOCUMENT_MAP,
} from "../constants";
import { ItemSlots } from "../types";
import { Shared } from "./shared";
import { getDocumentReferenceHtml, steppedDenomination, titleCase } from "../utils";

export class TidyItemSheet {
  /**
   * Render the TidyItemSheet changes
   */
  static render(html: HTMLElement, data: any) {
    this.#injectSlotsDetails(html, data);
    this.#injectItemHoverPills(html, data);
    Shared.injectWeightValue(html, this.#formatSlotsShorthand(data.system.slots));
    Shared.toggleSlotsDetailsLock(html, data);
  }

  static async #injectItemHoverPills(html: HTMLElement, data: any) {
    // Only weapons and armor/equipment
    const type = data.data.type;
    if (!["weapon", "equipment"].includes(type)) return;

    const systemData = data.data.system;

    // Handle Actions
    const actionDiv = Array.from(html.querySelectorAll("div")).find(
      (div) => div.querySelector("h4")?.textContent?.trim() === "Action"
    );

    // TODO: Handle in function so we can early return only there
    if (!actionDiv) return;

    const actionPillList = actionDiv.querySelector("ul.pills.stacked");
    if (!actionPillList) return;

    actionPillList.querySelectorAll("li.pill").forEach(async (li) => {
      const label = li.textContent?.trim();

      if (RANGE_REGEX.test(label)) {
        const enrichedhtml = await getDocumentReferenceHtml("range", "Range");
        li.replaceChildren(enrichedhtml, label);
      }
    });

    // Handle Properties
    const propertyDiv = Array.from(html.querySelectorAll("div")).find(
      (div) => div.querySelector("h4")?.textContent?.trim() === "Properties"
    );

    // TODO: Handle in function
    if (!propertyDiv) return;

    const pillList = propertyDiv.querySelector("ul.pills.stacked");
    if (!pillList) return;

    // Loop through each <li class="pill">
    pillList.querySelectorAll("li.pill").forEach(async (li) => {
      const label = li.textContent?.trim();
      const identifier = label.toLowerCase() ?? "";
      if (!(identifier in { ...WEAPON_MASTERY_DOCUMENT_MAP, ...WEAPON_PROPERTY_DOCUMENT_MAP })) {
        return;
      }

      const enrichedhtml = await getDocumentReferenceHtml(identifier, label);
      switch (identifier) {
        case "versatile":
          const versatileDamageNumber = systemData.damage.base.number;
          const versatileDamageDenomination = steppedDenomination(systemData.damage.base.denomination);

          li.replaceChildren(
            enrichedhtml,
            document.createTextNode(` (${versatileDamageNumber}d${versatileDamageDenomination})`)
          );
          break;
        case "ammunition":
        case "thrown":
          const rangeNormal = systemData.range.value;
          const rangeLong = systemData.range.long;
          const rangeUnits = systemData.range.units;

          let enrichedAmmoHTML = null;
          if (systemData.ammunition.type) {
            const ammoType = systemData.ammunition.type;
            const [label, itemDocument] = AMMO_TYPE_MAP[ammoType];
            const enrichedAmmoHTMLString = await foundry.applications.ux.TextEditor.enrichHTML(
              `@UUID[${itemDocument}]{${label}}`
            );
            const template = document.createElement("template");
            template.innerHTML = enrichedAmmoHTMLString.trim();
            enrichedAmmoHTML = template.content.firstElementChild as HTMLElement;
          }

          const parenSpan = document.createElement("span");
          if (enrichedAmmoHTML) {
            parenSpan.replaceChildren(`(${rangeNormal}/${rangeLong} ${rangeUnits}, `, enrichedAmmoHTML, ")");
          } else {
            parenSpan.replaceChildren(`(${rangeNormal}/${rangeLong} ${rangeUnits})`);
          }

          li.replaceChildren(enrichedhtml, parenSpan);
          break;
        case "reload":
          const reloadShots = systemData.uses.max;

          li.replaceChildren(enrichedhtml, document.createTextNode(` (${reloadShots} shots)`));
          break;
        default:
          li.replaceChildren(enrichedhtml);
      }
    });

    console.log(systemData);
    if (["automatic-rifle"].includes(systemData.identifier)) {
      const enrichedhtml = await getDocumentReferenceHtml("burst-fire", "Burst Fire");
      pillList.insertAdjacentHTML("beforeend", `<li class="pill centered mastery">${enrichedhtml.outerHTML}</li>`);
    }

    const mastery = systemData.mastery;
    if (mastery && !html.querySelector("li.mastery")) {
      const enrichedhtml = await getDocumentReferenceHtml(mastery, titleCase(mastery));
      pillList.insertAdjacentHTML(
        "beforeend",
        `<li class="pill centered mastery"><span class="text-normal">Mastery</span> ${enrichedhtml.outerHTML}</li>`
      );
    }
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
        await data.system.parent.unsetFlag(MODULE_ID, "stack");
        stackInput.value = data.system.slots.stack;
      } else {
        await data.system.parent.setFlag(MODULE_ID, "stack", parsedValue);
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
      await data.system.parent.setFlag(MODULE_ID, "tiny", checked);
    });

    tinyInputContainer.replaceChildren(tinyLabel, tinyInput);

    // Inject elements
    formFields.replaceChildren(slotsInputContainer, stackInputContainer, ifEquippedInputContainer, tinyInputContainer);
  }
}
