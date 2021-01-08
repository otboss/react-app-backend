/**
 * Structures information for a hardware item
 * */
export class HardwareItem {
  public category: string = ItemCategory[ItemCategory.Tools];
  public reviews: Array<Review> = [];
  constructor(
    public itemId: string,
    public rating: 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5,
    public label: string,
    public image: string,
    public cost: number,
    public description: string,
    public shippingFee: number,
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

interface Review {
  username: string;
  comment: string;
  rating: 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;
  timestamp: number;
}