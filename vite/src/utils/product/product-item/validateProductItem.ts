import { invalidNumber, notNullish } from "@/utils/genUtils";
import { Feature, FeatureUsageType, ProductItem } from "@autumn/shared";
import { toast } from "sonner";
import { isFeatureItem, isFeaturePriceItem } from "../getItemType";

export const validateProductItem = ({
  item,
  // show,
  features,
}: {
  item: ProductItem;
  // show: any;
  features: Feature[];
}) => {
  const feature = features.find((f) => f.id == item.feature_id);

  if (
    feature &&
    feature.config?.usage_type == FeatureUsageType.Continuous &&
    isFeatureItem(item)
  ) {
    item.interval = null;
  }

  if (notNullish(item.price)) {
    if (invalidNumber(item.price)) {
      toast.error("Please enter a valid price amount");
      return null;
    }
    item.price = parseFloat(item.price!.toString());
  }

  if ((item.included_usage as any) === "") {
    item.included_usage = null;
  } else if (!invalidNumber(item.included_usage)) {
    item.included_usage = Number(item.included_usage);
  }

  //if both item.tiers and item.price are set, set item.price to null
  if (item.tiers && item.price) {
    item.price = null;
  }

  // Usage/Feature item validation (when tiers are set)
  if (item.tiers) {
    let previousTo = 0;

    for (let i = 0; i < item.tiers.length; i++) {
      const tier = item.tiers[i];

      // Check if amount is actually a number
      if (typeof tier.amount !== "number") {
        tier.amount = parseFloat(tier.amount);
      }

      // Check if amount is valid
      if (invalidNumber(tier.amount)) {
        toast.error("Please enter valid prices for all tiers");
        return null;
      }

      // Check if amount is negative
      if (tier.amount < 0) {
        toast.error("Please set a positive usage price");
        return null;
      }

      // Skip other validations if 'to' is "inf"
      if (tier.to === "inf") {
        continue;
      }

      tier.to = Number(tier.to);

      // Check if 'to' is a number and valid
      if (typeof tier.to !== "number" || invalidNumber(tier.to)) {
        toast.error("Please enter valid usage limits for all tiers");
        return null;
      }

      // Ensure tiers are in ascending order
      if (tier.to <= previousTo) {
        toast.error("Tiers must be in ascending order");
        return null;
      }

      previousTo = tier.to;
    }
  }

  // Validate billing units
  if (item.billing_units && invalidNumber(item.billing_units)) {
    toast.error("Please enter valid billing units");
    return null;
  } else {
    if (isFeaturePriceItem(item)) {
      item.billing_units = Number(item.billing_units);
    } else {
      item.billing_units = undefined;
    }
  }

  return item;
};
