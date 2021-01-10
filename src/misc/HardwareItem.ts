import { Review } from "./Review";

/**
 * Structures information for a hardware item
 * */
export class HardwareItem {
  public category: string = ItemCategory[ItemCategory.Tools];
  public reviews: Array<Review> = [];
  constructor(
    public item_id: string,
    public rating: number,
    public label: string,
    public image: string,
    public cost: number,
    public description: string,
    public shipping_fee: number,
    category?: ItemCategory
  ) {
    if (category != null) {
      this.category = ItemCategory[category];
    }
  }
}

export enum ItemCategory {
  "Tools",
  "Plumbing",
  "Sheets and Rods",
  "Painting",
  "Fire Safety",
  "Door",
  "Mailboxes and Post",
  "Screws and Anchors",
  "Signs",
  "Angles, Braces and Brackets",
}