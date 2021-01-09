import { User } from "./User"

export class Review {
  public review_id: number;
  public item_id: number;
  public user_id: number;
  public user: User;
  public message: string;
  public rating: number;
}