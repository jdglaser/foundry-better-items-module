export class TidyCharacterSheet {
  /**
   * Render the TidyCharacterSheet changes
   */
  static render(html: HTMLElement, data: any) {
    this.#injectTidyEncumberanceDetails(html, data);
  }

  /* -------------------------------------------- */

  /**
   * Inject new slot based encumberance details on character page
   */
  static #injectTidyEncumberanceDetails(html: HTMLElement, data: any) {
    const inventoryContentHtml = html.querySelector("div.inventory-content") as HTMLElement;
    if (!inventoryContentHtml) return;

    const encumbranceDetails = inventoryContentHtml.querySelector("div.encumbrance-details");
    if (!encumbranceDetails) return;

    const { value, max } = data.system.slotBasedEncumberance;

    encumbranceDetails.innerHTML = `
      <div class="pill flexshrink"><span class="text-normal">Strength</span> <span>${
        data.system.abilities.str.value
      }</span></div>
      ${this.#getTidyProgressBarHTMLString(value, max, "fas fa-weight-hanging", "Item Slots")}
    `;

    // Hide weight based capacity bar for container items
    const capacityBars = inventoryContentHtml.querySelectorAll(
      'div[data-tidy-column-key="capacityBar"]'
    ) as NodeListOf<HTMLElement>;

    for (const bar of capacityBars) {
      bar.style.display = "none";
    }
  }

  /**
   * Get HTML string to render tidy progress bar
   */
  static #getTidyProgressBarHTMLString(value: number, max: number, icon: string, tooltip: string) {
    const percentage = Math.round((value / max) * 100);
    return `
      <div role="meter" 
        aria-valuemin="0" 
        data-tooltip-direction="UP" 
        data-tooltip="${tooltip}"
        class="meter progress encumbrance theme-dark medium${percentage >= 100 ? "high" : ""}" 
        aria-valuenow="${(value / max) * 100}" 
        aria-valuetext="${value}" 
        aria-valuemax="${max}" 
        style="--bar-percentage: ${percentage}%; 
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
}
