import { RANGE_REGEX } from "./constants";
import { SlotBasedEncumberanceManager } from "./slotBasedEncumberance";
import { getDocumentReferenceHtml, steppedDenomination, titleCase } from "./utils";

Hooks.once("init", () => {
  if (!game || !game.settings) return;
  game.settings.register("dnd5e-better-item-properties" as any, "enableTooltips" as any, {
    name: "Enable Property Tooltips",
    hint: "If enabled, item property pills will be replaced with rule reference tooltips.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
  });

  for (const itemDataClass of [
    "LootData",
    "WeaponData",
    "EquipmentData",
    "ToolData",
    "ConsumableData",
    "ContainerData",
  ]) {
    libWrapper.register(
      "dnd5e-better-item-properties",
      `dnd5e.dataModels.item.${itemDataClass}.prototype.prepareDerivedData`,
      function (wrapped: any, ...args: any) {
        SlotBasedEncumberanceManager.addItemSlots(this);
        let result = wrapped(...args);
        return result;
      }
    );
  }

  libWrapper.register(
    "dnd5e-better-item-properties",
    "dnd5e.dataModels.actor.CharacterData.prototype.prepareDerivedData",
    function (wrapped: any, ...args: any) {
      // ... do things ...
      let result = wrapped(...args);

      const ac = this.attributes.ac;

      const { armors, shields } = this.parent.itemTypes.equipment.reduce(
        (obj: any, equip: any) => {
          if (!equip.system.equipped || !(equip.system.type.value in CONFIG.DND5E.armorTypes)) return obj;
          if (equip.system.type.value === "shield") obj.shields.push(equip);
          else obj.armors.push(equip);
          return obj;
        },
        { armors: [], shields: [] }
      );

      const isProficientShields = this.traits.armorProf.value.has("shl");

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
        this.attributes.movement.walk -= 10;
      }

      SlotBasedEncumberanceManager.addCharacterSlotBasedEnumberance(this);

      // ... do things ...
      return result;
    },
    "MIXED" /* optional, since this is the default type */
  );
});

Hooks.on("renderTidy5eContainerSheetQuadrone" as any, async (app: any, html: HTMLElement, data: any) => {
  const detailsContent = html.querySelector("div.tidy-tab.details") as HTMLElement;

  SlotBasedEncumberanceManager.replaceTidyItemSheetSlots(detailsContent, data);
  SlotBasedEncumberanceManager.handleLockedTidyItemSheetSlots(detailsContent, data);
  SlotBasedEncumberanceManager.replaceItemWeightValue(html, data);
});

Hooks.on("renderTidy5eItemSheetQuadrone" as any, async (app: any, html: HTMLElement, data: any) => {
  const detailsContent = html.querySelector("div.tidy-tab.details") as HTMLElement;
  console.log(detailsContent);

  SlotBasedEncumberanceManager.replaceTidyItemSheetSlots(detailsContent, data);
  SlotBasedEncumberanceManager.handleLockedTidyItemSheetSlots(detailsContent, data);
  SlotBasedEncumberanceManager.replaceItemWeightValue(html, data);
  const type = data.data.type;

  // Only weapons and armor/equipment
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
      li.innerHTML = `<span class="text-normal">Range</span>${label}`;
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

    switch (identifier) {
      case "versatile":
        const versatileDamageNumber = systemData.damage.base.number;
        const versatileDamageDenomination = steppedDenomination(systemData.damage.base.denomination);
        const enrichedhtml = await getDocumentReferenceHtml(identifier, label);

        li.replaceChildren(
          enrichedhtml,
          document.createTextNode(` (${versatileDamageNumber}d${versatileDamageDenomination})`)
        );
        break;
      case "thrown":
        const thrownRangeNormal = systemData.range.value;
        const thrownRangeLong = systemData.range.long;
        const thrownRangeUnits = systemData.range.units;
        const enrichedHtml = await getDocumentReferenceHtml(identifier, label);

        li.replaceChildren(
          enrichedHtml,
          document.createTextNode(` (${thrownRangeNormal}/${thrownRangeLong} ${thrownRangeUnits})`)
        );
    }
  });

  const mastery = systemData.mastery;
  if (mastery && !html.querySelector("li.mastery")) {
    const enrichedhtml = await getDocumentReferenceHtml(mastery, titleCase(mastery));
    pillList.insertAdjacentHTML(
      "beforeend",
      `<li class="pill centered mastery"><span class="text-normal">Mastery</span> ${enrichedhtml.outerHTML}</li>`
    );
  }
});

Hooks.on("renderTidy5eCharacterSheetQuadrone" as any, async (app: any, html: HTMLElement, data: any, ...args: any) => {
  const inventoryContentHtml = html.querySelector("div.inventory-content") as HTMLElement;
  if (!inventoryContentHtml) return;

  //SlotBasedEncumberanceManager.injectTidyCharacterSheetEncumberance(app, inventoryContentHtml, data);
  //SlotBasedEncumberanceManager.setupTidyMutationObserver(app, inventoryContentHtml, data);
  SlotBasedEncumberanceManager.replaceTidyEncumberanceDetails(inventoryContentHtml, data);
});

Hooks.on("tidy5e-sheet.sheetModeConfiguring" as any, (app: any, html: HTMLElement, { unlocked }: any) => {
  /*console.log("UNLOCKED:", unlocked);
  console.log("APP:", app);
  console.log("HTML:", html);
  if (!html) return;
  const inputs = html.querySelectorAll("input.better-items-slots");
  console.log("INPUTS:", inputs);
  for (const input of inputs) {
    input.disabled = !unlocked;
  }*/
});

Hooks.on("closeTidy5eCharacterSheetQuadrone" as any, async (app: any) => {
  SlotBasedEncumberanceManager.cleanupMutationObserver(app);
});
