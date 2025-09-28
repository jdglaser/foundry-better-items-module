export class SlotBasedEncumberanceManager {
  static cleanupMutationObserver(app: any) {
    if (app._stowedMutationObserver) {
      app._stowedMutationObserver.disconnect();
      delete app._stowedMutationObserver;
    }
  }

  static setupTidyMutationObserver(app: any, inventoryContentHtml: HTMLElement, data: any) {
    if (app._stowedMutationObserver) return;

    const observer = new MutationObserver((muts) => {
      const addedTableNodes = muts.filter((mut) =>
        mut.addedNodes
          .values()
          .toArray()
          .some((addedNode) => addedNode instanceof HTMLElement && addedNode.matches("section.tidy-table"))
      );

      if (addedTableNodes) {
        SlotBasedEncumberanceManager.injectTidyCharacterSheetEncumberance(app, inventoryContentHtml, data);
      }
    });

    observer.observe(inventoryContentHtml, { childList: true, subtree: true });
    app._stowedMutationObserver = observer;
  }

  static #toggleRemoveEquipButton(actionsHtml: HTMLElement, stowed: boolean) {
    // Prefer toggling a disabled class rather than removing the element so layout/widths remain stable.
    const equipBtn = actionsHtml.querySelector("[data-tooltip='DND5E.ContextMenuActionEquip']") as HTMLElement | null;
    const unequipButton = actionsHtml.querySelector(
      "[data-tooltip='DND5E.ContextMenuActionUnequip']"
    ) as HTMLElement | null;

    if (stowed) {
      if (equipBtn) equipBtn.style.display = "none";
      if (unequipButton) unequipButton.style.display = "none";
    } else {
      if (equipBtn) equipBtn.style.removeProperty("display");
      if (unequipButton) unequipButton.style.removeProperty("display");
    }

    SlotBasedEncumberanceManager.#setActionsColumnWidth(actionsHtml);
  }

  static #getInventoryItems(inventoryContentHtml: HTMLElement) {
    return (
      (inventoryContentHtml
        ?.querySelector("div.tidy-table-container")
        ?.querySelectorAll("div.tidy-table-row-container[data-item-id]")
        ?.values()
        .toArray() as HTMLElement[]) || []
    );
  }

  static #createStowButton(isStowed: boolean) {
    const icon = isStowed ? "fas fa-box" : "fa-regular fa-box-open";
    const tooltip = isStowed ? "Ready Item" : "Stow Item";
    const btn = document.createElement("a");
    btn.setAttribute("data-tooltip", tooltip);
    btn.classList.add("tidy-table-button", "stow-button");
    btn.innerHTML = `<i class="fas ${icon}"></i>`;
    return btn;
  }

  static #insertButtonIntoActions(actions: HTMLElement, btn: HTMLElement) {
    const buttons = actions.querySelectorAll(".tidy-table-button");
    if (buttons.length >= 3) {
      actions.insertBefore(btn, buttons[1]);
    } else if (buttons.length > 0) {
      actions.insertBefore(btn, buttons[0]);
    } else {
      actions.appendChild(btn);
    }
  }

  static #setActionsColumnWidth(actionsHtml: HTMLElement) {
    // const buttons = actionsHtml.querySelectorAll(".tidy-table-button");
    // const displayedButtons = buttons
    //   .values()
    //   .toArray()
    //   .filter((btn) => {
    //     const style = btn.computedStyleMap().get("display");
    //     return style?.toString() !== "none";
    //   });
    const columnWidth = 1.5625 * 4;
    actionsHtml.style.setProperty("--tidy-table-column-width", `${columnWidth}rem`);
  }

  static injectTidyCharacterSheetEncumberance(app: any, inventoryContentHtml: HTMLElement, data: any) {
    //const inventoryPage = html.querySelector("div.inventory-content");
    const inventoryItems = SlotBasedEncumberanceManager.#getInventoryItems(inventoryContentHtml);

    for (const row of inventoryItems) {
      const actions: HTMLElement | null = row.querySelector(".tidy-table-actions");
      if (!actions) continue;

      // Get item from itemId
      const itemId = row.getAttribute("data-item-id");
      const item = data.actor.collections.items.get(itemId);
      if (!item) continue;

      if (item.system.slots && item.system.slots.tiny) {
        SlotBasedEncumberanceManager.#setActionsColumnWidth(actions);
        continue;
      }

      // Avoid duplicates
      if (actions.querySelector(".stow-button")) continue;

      const isStowed = item.getFlag("dnd5e-better-item-properties", "stowed");
      const btn = SlotBasedEncumberanceManager.#createStowButton(isStowed);

      btn.addEventListener("click", async (ev) => {
        ev.preventDefault();
        const current = item.getFlag("dnd5e-better-item-properties", "stowed");

        const newStowed = !current;
        const inneri: any = btn.querySelector("i");
        inneri.className = newStowed ? "fas fa-box" : "fa-regular fa-box-open";
        btn.setAttribute("data-tooltip", newStowed ? "Ready Item" : "Stow Item");

        SlotBasedEncumberanceManager.#toggleRemoveEquipButton(actions, newStowed);
        if (newStowed && item.system.equipped) {
          await item.update({
            "system.equipped": false,
          });
        }

        game.tooltip?.deactivate();
        game.tooltip?.activate(btn);
        await item.setFlag("dnd5e-better-item-properties", "stowed", newStowed);
        app.render();
      });

      SlotBasedEncumberanceManager.#insertButtonIntoActions(actions, btn);

      SlotBasedEncumberanceManager.#toggleRemoveEquipButton(actions, isStowed);

      app.render();
    }
  }

  static #formatSlotsShorthand({
    value,
    stack,
    tiny,
    ifEquipped,
  }: {
    value: number;
    stack: number;
    tiny: boolean;
    ifEquipped: number;
  }) {
    if (tiny) {
      return "Tiny";
    }

    const stackText = stack === 1 ? "" : ` (Stack: x${stack})`;
    const ifEquippedText = value === ifEquipped ? "" : ` (${ifEquipped} if equipped)`;
    return `${value}${ifEquippedText}${stackText}`;
  }

  static replaceTidyItemSheetSlots(detailsContent: HTMLElement, data: any) {
    if (detailsContent.querySelector(".better-items-slots-group")) {
      return;
    }

    const weightGroup = detailsContent.querySelector(".form-group label[for$='-weight-value']")?.closest(".form-group");
    if (!weightGroup) return;

    weightGroup.classList.add("better-items-slots-group");
    const label = weightGroup.querySelector("label");
    if (label) label.innerHTML = "Slots";
    const formFields = weightGroup.querySelector("div.form-fields");

    // Slots
    const slotsInputContainer = document.createElement("div");
    slotsInputContainer.classList.add("form-group", "label-top");
    const slotsLabel = document.createElement("label");
    slotsLabel.innerHTML = "Slots";

    const slotsInput = document.createElement("input");
    slotsInput.classList.add("better-items-slots");
    slotsInput.type = "number";
    slotsInput.min = "0";
    slotsInput.value = data.system.slots.value;

    slotsInput.addEventListener("focusout", async (ev) => {
      const value = (ev.target as HTMLInputElement).value ?? slotsInput.value;
      await data.system.parent.setFlag("dnd5e-better-item-properties", "slots", parseInt(value));
    });

    slotsInputContainer.replaceChildren(slotsLabel, slotsInput);

    slotsInput.setAttribute("data-tidy-field", "flags.dnd5e-better-item-properties.slots");

    // Stack
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
      await data.system.parent.setFlag("dnd5e-better-item-properties", "stack", parseInt(value));
    });

    stackInputContainer.replaceChildren(stackLabel, stackInput);

    // Tiny
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

    formFields?.replaceChildren(slotsInputContainer, stackInputContainer, tinyInputContainer);
  }

  static replaceItemWeightValue(headerHtml: HTMLElement, data: any) {
    const itemWeightValue = headerHtml.querySelector(".item-weight-value");
    console.log("ITEM WEIGHT VALUE:", itemWeightValue);
    if (itemWeightValue)
      itemWeightValue.innerHTML = SlotBasedEncumberanceManager.#formatSlotsShorthand(data.system.slots);
  }

  static handleLockedTidyItemSheetSlots(detailsContent: HTMLElement, data: any) {
    const inputs = detailsContent.querySelectorAll("input.better-items-slots") as NodeListOf<HTMLInputElement>;
    for (const input of inputs) {
      input.disabled = !data.unlocked;
    }
  }

  static #createTidyProgressBar(value: number, max: number, icon: string, tooltip: string) {
    return `
      <div role="meter" 
        aria-valuemin="0" 
        data-tooltip-direction="UP" 
        data-tooltip="${tooltip}"
        class="meter progress encumbrance theme-dark medium" 
        aria-valuenow="${(value / max) * 100}" 
        aria-valuetext="${value}" 
        aria-valuemax="${max}" 
        style="--bar-percentage: ${Math.round((value / max) * 100)}%; 
        --encumbrance-low: 33.333333333333336%; 
        --encumbrance-high: 66.66666666666667%;">
          <div class="label">
            <i class="${icon} text-label-icon"></i>
             <span class="value font-weight-label">${value}</span> 
             <span class="separator">/</span> 
             <span class="max color-text-default">${max}</span>
          </div> 
          <i class="breakpoint encumbrance-low arrow-up" role="presentation"></i> 
          <i class="breakpoint encumbrance-low arrow-down" role="presentation"></i> 
          <i class="breakpoint encumbrance-high arrow-up" role="presentation"></i> 
          <i class="breakpoint encumbrance-high arrow-down" role="presentation"></i>
        </div>
    `;
  }

  static replaceTidyEncumberanceDetails(inventoryContentHtml: HTMLElement, data: any) {
    const encumbranceDetails = inventoryContentHtml.querySelector("div.encumbrance-details");
    if (!encumbranceDetails) return;

    //const { value: readiedItems, max: maxReadiedItems } = data.system.slotBasedEncumberance.readied;
    const { value: stowedItems, max: maxStowedItems } = data.system.slotBasedEncumberance.stowed;

    encumbranceDetails.innerHTML = `
      <div class="pill flexshrink"><span class="text-normal">Strength</span> <span>${
        data.system.abilities.str.value
      }</span></div>
      ${
        /*SlotBasedEncumberanceManager.#createTidyProgressBar(
        readiedItems,
        maxReadiedItems,
        "fa-regular fa-box-open",
        "Readied Items"
      )*/ ""
      }
      ${SlotBasedEncumberanceManager.#createTidyProgressBar(
        stowedItems,
        maxStowedItems,
        "fas fa-weight-hanging",
        "Item Slots"
      )}
    `;

    const capacityBars = inventoryContentHtml.querySelectorAll(
      'div[data-tidy-column-key="capacityBar"]'
    ) as NodeListOf<HTMLElement>;
    console.log("CAPACITY BAR:", capacityBars);
    for (const bar of capacityBars) {
      bar.style.display = "none";
    }
  }

  static async addCharacterSlotBasedEnumberance(characterData: any) {
    const allItems = [
      ...characterData.parent.itemTypes.equipment,
      ...characterData.parent.itemTypes.consumable,
      ...characterData.parent.itemTypes.loot,
      ...characterData.parent.itemTypes.weapon,
      ...characterData.parent.itemTypes.container,
    ];

    //const stowedItems = allItems.filter((item) => item.getFlag("dnd5e-better-item-properties", "stowed"));
    //const readiedItems = allItems.filter((item) => !item.getFlag("dnd5e-better-item-properties", "stowed"));

    let currentStowedCapacity = 0;
    const { cp = 0, sp = 0, ep = 0, gp = 0, pp = 0 } = characterData.currency;
    let tinyItems = cp + sp + ep + gp + pp;
    for (const item of allItems) {
      if (item.system.slots.stack > 1) {
        currentStowedCapacity += Math.ceil(item.system.quantity / item.system.slots.stack) * item.system.slots.value;
      } else if (item.system.slots.tiny) {
        tinyItems += item.system.quantity;
      } else {
        if (item.system.slots.ifEquipped !== item.system.slots.value && item.system.equipped) {
          currentStowedCapacity += item.system.quantity * item.system.slots.ifEquipped;
        } else {
          currentStowedCapacity += item.system.quantity * item.system.slots.value;
        }
      }
    }

    currentStowedCapacity += Math.ceil(tinyItems / 100);

    // let currentReadiedCapacity = 0;
    // for (const item of readiedItems) {
    //   if (item.system.slots.stack > 1) {
    //     currentReadiedCapacity += Math.ceil(item.system.quantity / item.system.slots.stack) * item.system.slots.value;
    //   } else {
    //     currentReadiedCapacity += item.system.quantity * item.system.slots.value;
    //   }
    // }

    characterData.slotBasedEncumberance = {
      stowed: {
        value: currentStowedCapacity,
        max: characterData.abilities.str.value + 10,
      },
      // readied: {
      //   value: currentReadiedCapacity,
      //   max: Math.floor(characterData.abilities.str.value / 2),
      // },
    };
  }

  static #resolveSlots(itemData: any, parentData: any, systemData: any) {
    let stack = 1;
    let value = 1;
    let tiny = false;
    let ifEquipped = value;
    if (itemData.type && itemData.type.value === "ammo") {
      switch (itemData.identifier) {
        case "arrows":
          stack = 20;
          break;
        case "bullets-firearm":
          stack = 10;
          break;
        case "bullets-sling":
          stack = 20;
          break;
        case "needles":
          stack = 50;
          break;
        case "bolts":
          stack = 20;
          break;
      }
    }

    if (parentData.type === "equipment" && itemData.type) {
      switch (itemData.type.value) {
        case "heavy":
          value = 2;
          break;
        case "medium":
          value = 2;
          break;
        case "light":
          value = 1;
          break;
      }
    }

    if (parentData.type === "weapon") {
      if (["hvy", "two"].some((prop) => itemData.properties.has(prop))) value = 2;
    }

    // 0 if equipped
    if (["clothes-fine", "clothes-travelers", "fine-clothes"].includes(itemData.identifier)) ifEquipped = 0;

    if (["improvised-weapon", "unarmed-strike", "clawed-gauntlet"].includes(itemData.identifier)) value = 0;

    if (itemData.type && ["gem", "ring"].includes(itemData.type.value)) tiny = true;

    return {
      value,
      stack,
      tiny,
      ifEquipped,
    };
  }

  static #getContainerSlots() {}

  static addItemSlots(itemData: any) {
    const valueOverride = itemData.parent.getFlag("dnd5e-better-item-properties", "slots");
    const stackOverride = itemData.parent.getFlag("dnd5e-better-item-properties", "stack");
    const tinyOverride = itemData.parent.getFlag("dnd5e-better-item-properties", "tiny");
    const ifEquippedOverride = itemData.parent.getFlag("dnd5e-better-item-properties", "ifEquipped");

    console.log("ITEM DATA:", itemData);
    if (itemData.parent.type === "container") {
      console.log("CONTENTS:", itemData.contents);
      console.log("");
    }

    // types {'weapon', 'equipment', 'consumable', 'loot', 'tool'}
    const parent = itemData.parent;
    const systemData = parent.system;

    const { value, stack, tiny, ifEquipped } = SlotBasedEncumberanceManager.#resolveSlots(itemData, parent, systemData);

    itemData.slots = {
      value: valueOverride ?? value,
      stack: stackOverride ?? stack,
      tiny: tinyOverride ?? tiny,
      ifEquipped: ifEquippedOverride ?? ifEquipped,
    };
  }
}
