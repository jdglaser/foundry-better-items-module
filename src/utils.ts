import { BASE_COMPENDIUM_PATH, WEAPON_MASTERY_DOCUMENT_MAP, WEAPON_PROPERTY_DOCUMENT_MAP } from "./constants";

const dieSteps = [4, 6, 8, 10, 12, 20, 100];

export function steppedDenomination(denomination: number, steps: number = 1) {
  return dieSteps[Math.min(dieSteps.indexOf(denomination) + steps, dieSteps.length - 1)] ?? null;
}

export function getDocumentPath(key: string) {
  const id = { ...WEAPON_MASTERY_DOCUMENT_MAP, ...WEAPON_PROPERTY_DOCUMENT_MAP }[key];
  return `${BASE_COMPENDIUM_PATH}.${id}`;
}

export function getDocumentReference(key: string, label: string) {
  return `@UUID[${getDocumentPath(key)}]{${label}}`;
}

export async function getDocumentReferenceHtml(key: string, label: string) {
  const enrichedHtml = await foundry.applications.ux.TextEditor.enrichHTML(getDocumentReference(key, label));
  const template = document.createElement("template");
  template.innerHTML = enrichedHtml.trim();
  const enrichedHtmlElement = template.content.firstElementChild as HTMLElement;
  const icon = enrichedHtmlElement.querySelector("i.fa-solid");
  if (icon) {
    icon.remove();
  }
  return enrichedHtmlElement;
}

export function titleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
