import { MODULE_ID, RANGE_REGEX } from "./constants";
import { CharacterData } from "./data/characterData";
import { ContainerData } from "./data/containerData";
import { ItemData } from "./data/itemData";
import { TidyCharacterSheet } from "./ui/tidyCharacterSheet";
import { TidyContainerSheet } from "./ui/tidyContainerSheet";
import { TidyItemSheet } from "./ui/tidyItemSheet";
import { getDocumentReferenceHtml, steppedDenomination, titleCase } from "./utils";

Hooks.once("init", () => {
  if (!game || !game.settings) return;

  // @ts-ignore
  const DndContainerData = dnd5e.dataModels.item.ContainerData;

  if (!Object.prototype.hasOwnProperty.call(DndContainerData.prototype, "slotCapacity")) {
    Object.defineProperty(DndContainerData.prototype, "slotCapacity", {
      get: function () {
        return ContainerData.getContainerCapacity(this);
      },
      configurable: true,
    });
  }

  game.settings.register(MODULE_ID as any, "enableTooltips" as any, {
    name: "Enable Property Tooltips",
    hint: "If enabled, item property pills will be replaced with rule reference tooltips.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
  });

  for (const itemDataClass of ["LootData", "WeaponData", "EquipmentData", "ToolData", "ConsumableData"]) {
    libWrapper.register(
      MODULE_ID,
      `dnd5e.dataModels.item.${itemDataClass}.prototype.prepareDerivedData`,
      function (wrapped: any, ...args: any) {
        let result = wrapped(...args);
        ItemData.prepareDerivedData(this);
        return result;
      },
      "MIXED"
    );
  }

  libWrapper.register(
    MODULE_ID,
    "dnd5e.dataModels.item.ContainerData.prototype.prepareDerivedData",
    function (wrapped: any, ...args: any) {
      let result = wrapped(...args);
      ContainerData.prepareDerivedData(this);
      return result;
    },
    "MIXED"
  );

  libWrapper.register(
    MODULE_ID,
    "dnd5e.dataModels.abstract.ItemDataModel.prototype.richTooltip",
    async function (wrapped: any, ...args: any) {
      let { content, classes } = await wrapped(...args);
      const newContent = await ItemData.updateRichTooltip(this, content);
      return { content: newContent, classes };
    },
    "MIXED"
  );

  libWrapper.register(
    MODULE_ID,
    "dnd5e.dataModels.actor.CharacterData.prototype.prepareDerivedData",
    function (wrapped: any, ...args: any) {
      let result = wrapped(...args);
      CharacterData.prepareDerivedData(this);
      return result;
    },
    "MIXED"
  );
});

Hooks.on("renderTidy5eContainerSheetQuadrone" as any, async (app: any, html: HTMLElement, data: any) => {
  TidyContainerSheet.render(html, data);
});

Hooks.on("renderTidy5eItemSheetQuadrone" as any, async (app: any, html: HTMLElement, data: any) => {
  TidyItemSheet.render(html, data);
});

Hooks.on("renderTidy5eCharacterSheetQuadrone" as any, async (app: any, html: HTMLElement, data: any) => {
  TidyCharacterSheet.render(html, data);
});
