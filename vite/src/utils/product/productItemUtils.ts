import {
  BillingInterval,
  EntInterval,
  Feature,
  Infinite,
  ProductItem,
  ProductItemFeatureType,
  ProductItemType,
  UsageModel,
} from "@autumn/shared";
import { notNullish, nullish } from "../genUtils";
import { isFeatureItem, isFeaturePriceItem, isPriceItem } from "./getItemType";
import { itemToUsageType } from "./productItemUtils/convertItem";

export const itemIsUnlimited = (item: ProductItem) => {
  return item.included_usage == Infinite;
};

export const formatAmount = ({
  defaultCurrency,
  amount,
  maxFractionDigits = 6,
}: {
  defaultCurrency: string;
  amount: number;
  maxFractionDigits?: number;
}) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: defaultCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits || 6,
  }).format(amount);
};

export const getItemType = (item: ProductItem) => {
  if (isPriceItem(item)) {
    return ProductItemType.Price;
  } else if (isFeatureItem(item)) {
    return ProductItemType.Feature;
  }

  return ProductItemType.FeaturePrice;
};

export const intervalIsNone = (interval: any) => {
  return (
    nullish(interval) ||
    interval == EntInterval.Lifetime ||
    interval == BillingInterval.OneOff
  );
};

export const getShowParams = (item: ProductItem | null) => {
  if (!item) {
    return {
      price: false,
      feature: false,
      allowance: false,
      perEntity: false,
      cycle: false,
    };
  }

  return {
    price: notNullish(item.price) || notNullish(item.tiers),
    feature: !isPriceItem(item),
    allowance: true,
    perEntity: notNullish(item.entity_feature_id),
    cycle: true,
  };
};

export const shouldShowProrationConfig = ({
  item,
  features,
}: {
  item: ProductItem;
  features: Feature[];
}) => {
  if (!isFeaturePriceItem(item)) return false;

  // If pay per use single use
  const usageType = itemToUsageType({ item, features });

  if (item.usage_model == UsageModel.Prepaid) return true;

  // if (
  //   usageType == ProductItemFeatureType.SingleUse &&
  //   item.usage_model == UsageModel.Prepaid
  // ) {
  //   return true;
  // } else

  if (
    usageType == ProductItemFeatureType.ContinuousUse
    // &&item.usage_model !== UsageModel.Prepaid
  ) {
    return true;
  }
  return false;
};
