import type { SelectedService } from "@shared/schema";
import { budgetPackageServices, ballerPackageServices } from "@shared/constants/packages";

export { budgetPackageServices, ballerPackageServices };

export const packageDetails = {
  "budget": {
    name: "Budget-Friendly Package",
    className: "from-primary-600/20 to-primary-600/5",
    buttonClassName: "bg-primary-600 hover:bg-primary-700",
    discountBadgeClassName: "bg-primary-600/20 text-primary-400"
  },
  "baller": {
    name: "Baller Package",
    className: "from-secondary-600/20 to-secondary-600/5",
    buttonClassName: "bg-secondary-600 hover:bg-secondary-700",
    discountBadgeClassName: "bg-secondary-600/20 text-secondary-400"
  }
};
