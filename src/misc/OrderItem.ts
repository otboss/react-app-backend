import { HardwareItem } from "./HardwareItem";

export class OrderItem {
  public order_item_id: number;
  public item_id: number;
  public item: HardwareItem;
  public quantity: number;
}