import SlotBase from "./SlotBase";

type StringSlot = SlotBase & {
  type: 's';
  content: string;
}

export default StringSlot;