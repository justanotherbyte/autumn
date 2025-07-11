import { z } from "zod";
import { ProcessorType } from "../genModels/genEnums.js";
import { ProductSchema } from "../productModels/productModels.js";
import { PriceSchema } from "../productModels/priceModels/priceModels.js";
import {
  CustomerEntitlementSchema,
  FullCustomerEntitlementSchema,
} from "./cusEntModels/cusEntModels.js";
import { EntitlementSchema } from "../productModels/entModels/entModels.js";
import { FeatureSchema } from "../featureModels/featureModels.js";
import { CustomerSchema } from "../cusModels/cusModels.js";
import { FreeTrialSchema } from "../productModels/freeTrialModels/freeTrialModels.js";
import {
  CustomerPriceSchema,
  FullCustomerPriceSchema,
} from "./cusPriceModels/cusPriceModels.js";
import { CollectionMethod } from "./cusProductEnums.js";
import { CusProductStatus } from "./cusProductEnums.js";

export const FeatureOptionsSchema = z.object({
  feature_id: z.string(),
  quantity: z.number(), // same as prepaid
  upcoming_quantity: z.number().nullish(),

  adjustable_quantity: z.boolean().nullish(),
  internal_feature_id: z.string().nullish(),
});

export const BillingCycleAnchorConfig = z.object({
  month: z.number(),
  day: z.number(),
  hour: z.number(),
  minute: z.number(),
  second: z.number(),
});

export const CusProductSchema = z.object({
  id: z.string(),
  internal_product_id: z.string(),
  product_id: z.string(),
  internal_customer_id: z.string(),
  customer_id: z.string().nullish(),
  internal_entity_id: z.string().nullish(),
  entity_id: z.string().nullish(),
  created_at: z.number(),

  // Useful for event-driven subscriptions (and usage-based to check limits)
  status: z.nativeEnum(CusProductStatus),

  starts_at: z.number().default(Date.now()),
  trial_ends_at: z.number().optional().nullable(),
  canceled_at: z.number().optional().nullable(),
  ended_at: z.number().optional().nullable(),

  options: z.array(FeatureOptionsSchema),
  free_trial_id: z.string().optional().nullable(),
  collection_method: z.nativeEnum(CollectionMethod),

  // Fixed-cycle configuration
  subscription_ids: z.array(z.string()).nullish(),
  scheduled_ids: z.array(z.string()).nullish(),
  processor: z
    .object({
      type: z.nativeEnum(ProcessorType),
      subscription_id: z.string().optional().nullable(),
      subscription_schedule_id: z.string().optional().nullable(),
      last_invoice_id: z.string().optional().nullable(),
    })
    .optional(),

  quantity: z.number().default(1),
  api_version: z.number().nullish(),
});

export const FullCusProductSchema = CusProductSchema.extend({
  customer_prices: z.array(FullCustomerPriceSchema),
  customer_entitlements: z.array(FullCustomerEntitlementSchema),

  customer: CustomerSchema.optional(),
  product: ProductSchema,
  free_trial: FreeTrialSchema.nullish(),
  is_custom: z.boolean().default(false),
});

export type CusProduct = z.infer<typeof CusProductSchema>;
export type FeatureOptions = z.infer<typeof FeatureOptionsSchema>;
export type FullCusProduct = z.infer<typeof FullCusProductSchema>;
