import {
  BillingInterval,
  BillingType,
  EntitlementWithFeature,
  Feature,
  FixedPriceConfig,
  FullCusProduct,
  FullCustomerPrice,
  FullProduct,
  getFeatureName,
  getFeatureNameWithCapital,
  Organization,
  Price,
  UsagePriceConfig,
} from "@autumn/shared";
import {
  getBillingType,
  getPriceEntitlement,
} from "../products/prices/priceUtils.js";
import { cusProductToEnts } from "../customers/cusProducts/cusProductUtils/convertCusProduct.js";
import {
  getCusPriceUsage,
  getRelatedCusEnt,
} from "../customers/cusProducts/cusPrices/cusPriceUtils.js";
import { getFeatureQuantity } from "../customers/cusProducts/cusProductUtils.js";
import { formatAmount } from "@/utils/formatUtils.js";

const getSingularAndPlural = (feature: Feature) => {
  const singular = getFeatureName({
    feature,
    plural: false,
  });
  const plural = getFeatureName({
    feature,
    plural: true,
  });
  return { singular, plural };
};

export const formatPrepaidPrice = ({
  quantity,
  ents,
  price,
}: {
  quantity: number;
  ents: EntitlementWithFeature[];
  price: Price;
}) => {
  const ent = getPriceEntitlement(price, ents);

  const { singular, plural } = getSingularAndPlural(ent.feature);

  const config = price.config as UsagePriceConfig;
  const billingUnits = config.billing_units || 1;

  if (billingUnits == 1) {
    if (quantity == 1)
      return `${quantity} ${singular}`; // eg. 1 credit
    else return `${quantity} ${plural}`; // eg. 4 credits
  } else {
    return `${quantity} x ${billingUnits} ${plural}`; // eg. 4 x 100 credits
  }
};

export const formatFixedPrice = ({
  org,
  price,
}: {
  org: Organization;
  price: Price;
}) => {
  const config = price.config as FixedPriceConfig;
  const amount = formatAmount({ org, amount: config.amount });

  if (config.interval == BillingInterval.OneOff) {
    return `${amount}`;
  } else {
    return `${amount} / ${config.interval}`;
  }
};

// export const formatUsageInArrear = ({
//   price,
//   cusProduct,
//   logger,
// }: {
//   price: Price;
//   feature: Feature;
//   cusProduct: FullCusProduct;
//   logger: any;
// }) => {
//   // const cusPrice = cusProduct.customer_prices.find(
//   //   (cp) => cp.price.id == price.id,
//   // );

//   // const { usage, overage, roundedUsage } = getCusPriceUsage({
//   //   cusPrice: cusPrice!,
//   //   cusProduct,
//   //   logger,
//   // });

//   // const cusEnt = getRelatedCusEnt({
//   //   cusPrice: cusPrice!,
//   //   cusEnts: cusProduct.customer_entitlements,
//   // })!;

//   const { singular, plural } = getSingularAndPlural(cusEnt.entitlement.feature);

//   if (usage == 1) {
//     return `${usage} x ${singular}`;
//   } else {
//     return `${usage} x ${plural}`;
//   }
// };

export const formatInArrearProrated = ({
  price,
  ents,
  quantity,
}: {
  price: Price;
  ents: EntitlementWithFeature[];
  quantity?: number;
}) => {
  const ent = getPriceEntitlement(price, ents);

  const { singular, plural } = getSingularAndPlural(ent.feature);

  if (quantity == 1) {
    return `${quantity} x ${singular}`;
  } else {
    return `${quantity} x ${plural}`;
  }
};

export const priceToInvoiceDescription = ({
  org,
  price,
  cusProduct,
  quantity,
  logger,
}: {
  price: Price;
  cusProduct: FullCusProduct;
  org?: Organization;
  quantity?: number;
  logger: any;
}) => {
  let billingType = getBillingType(price.config);
  let productName = cusProduct.product.name;
  const ents = cusProductToEnts({ cusProduct });

  let description = "";
  if (billingType == BillingType.UsageInAdvance) {
    const ent = getPriceEntitlement(price, ents);
    const quantity = getFeatureQuantity({
      cusProduct,
      internalFeatureId: ent.feature.internal_id,
    });

    description = formatPrepaidPrice({ price, ents, quantity });
  }

  if (
    billingType == BillingType.FixedCycle ||
    billingType == BillingType.OneOff
  ) {
    description = formatFixedPrice({ org: org!, price });
  }

  if (billingType == BillingType.InArrearProrated) {
    description = formatInArrearProrated({ price, ents, quantity });
  }

  return `${productName} - ${description}`;
};

export const newPriceToInvoiceDescription = ({
  org,
  price,
  product,
  quantity,
  withProductPrefix = true,
  ents,
}: {
  org: Organization;
  price: Price;
  product: FullProduct;
  quantity?: number;
  withProductPrefix?: boolean;
  ents?: EntitlementWithFeature[];
}) => {
  const billingType = getBillingType(price.config);

  if (!ents) {
    ents = product.entitlements;
  }

  let description = "";
  if (
    billingType == BillingType.FixedCycle ||
    billingType == BillingType.OneOff
  ) {
    description = formatFixedPrice({ org, price });
  }

  if (billingType == BillingType.InArrearProrated) {
    description = formatInArrearProrated({ price, ents, quantity });
  }

  if (billingType == BillingType.UsageInArrear) {
    const ent = getPriceEntitlement(price, ents);
    description = getFeatureNameWithCapital({ feature: ent.feature });
  }

  if (billingType == BillingType.UsageInAdvance) {
    description = formatPrepaidPrice({ price, ents, quantity: quantity! });
  }

  return `${withProductPrefix ? `${product.name} - ` : ""}${description}`;
};
