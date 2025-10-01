export interface ItemSlots {
  value: number;
  resolvedValue: number;
  stack: number;
  tiny: boolean;
  ifEquipped: number | null;
}

export interface ContainerCapacity {
  value: number;
  max: number;
}

export interface ContainerSlots {
  value: number;
  resolvedValue: number;
  ifEquipped: number | null;
  capacity: ContainerCapacity;
}
