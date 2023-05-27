import SlotBase from "./SlotBase";

type DotSlot = SlotBase & {
  type: '.'
  length: number;
}

export default DotSlot;