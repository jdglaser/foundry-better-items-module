export interface ItemSlots {
  value: number;
  stack: number;
  tiny: boolean;
  ifEquipped: number | null;
}

export interface ContainerSlots {
  value: number;
  ifEquipped: number | null;
  capacity: number;
}
