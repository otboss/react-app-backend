import { HardwareItem } from "../misc/HardwareItem";
import { Review } from "../misc/Review";

export const resolvers = {
  hello: () => {
    return 'Hello world!';
  },
  hardwareItems: (offset: number, limit: number): Array<HardwareItem> => {
    return [];
  },
  reviews: (itemId: number): Array<Review> => {
    return [{ reviewId: 1 }];
  }
};