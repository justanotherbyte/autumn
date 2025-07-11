import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { ProductItemConfig } from "./ProductItemConfig";
import { ProductItemContext } from "./ProductItemContext";
import { CreateFeature } from "@/views/features/CreateFeature";
import {
  ProductItemInterval,
  ProductItem,
  CreateFeature as CreateFeatureType,
  UpdateProductSchema,
} from "@autumn/shared";

import { useProductContext } from "../ProductContext";
import { validateProductItem } from "@/utils/product/product-item/validateProductItem";

import { DialogContentWrapper } from "@/components/general/modal-components/DialogContentWrapper";
import { ItemConfigFooter } from "./product-item-config/item-config-footer/ItemConfigFooter";
import { ProductService } from "@/services/products/ProductService";
import { useAxiosInstance } from "@/services/useAxiosInstance";

export const defaultProductItem: ProductItem = {
  feature_id: null,

  included_usage: null,

  interval: ProductItemInterval.Month,

  // Price config
  price: null,
  tiers: null,
  billing_units: 1,

  // Others
  entity_feature_id: null,
  reset_usage_when_enabled: true,
};

const defaultPriceItem: ProductItem = {
  feature_id: null,
  included_usage: null,

  interval: ProductItemInterval.Month,

  // Price config
  price: 0,
  tiers: null,
  billing_units: 1,

  // Others
  entity_feature_id: null,
  reset_usage_when_enabled: true,
};

export function CreateProductItem() {
  const [open, setOpen] = useState(false);
  const [showCreateFeature, setShowCreateFeature] = useState(false);
  const [item, setItem] = useState<ProductItem>(defaultProductItem);
  const { features, product, setProduct, setFeatures, counts, mutate } =
    useProductContext();

  const axiosInstance = useAxiosInstance();
  const hasCustomers = counts?.all > 0;

  const setSelectedFeature = (feature: CreateFeatureType) => {
    setFeatures([...features, feature]);
    setItem({ ...item, feature_id: feature.id! });
  };

  const handleCreateProductItem = async (entityFeatureId?: string) => {
    const validatedItem = validateProductItem({
      item: {
        ...item,
        entity_feature_id: entityFeatureId
          ? entityFeatureId
          : item.entity_feature_id,
      },
      // show: {
      //   price: true,
      // },
      features,
    });

    if (!validatedItem) return;

    const newItems = [...product.items, validatedItem];
    setProduct({ ...product, items: newItems });

    setOpen(false);
  };

  return (
    <ProductItemContext.Provider
      value={{
        item,
        setItem,
        showCreateFeature,
        setShowCreateFeature,
        isUpdate: false,
        handleCreateProductItem,
      }}
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex gap-0">
          <DialogTrigger asChild>
            <Button
              variant="add"
              className="w-24"
              onClick={() => setItem(defaultProductItem)}
            >
              Feature
            </Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button
              variant="add"
              className="w-24 border-l-0"
              onClick={() => setItem(defaultPriceItem)}
            >
              Price
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className="translate-y-[0%] top-[20%] flex flex-col gap-0 w-fit p-0">
          <DialogContentWrapper>
            <DialogHeader className="p-0">
              <div className="flex flex-col  ">
                {showCreateFeature && (
                  <Button
                    variant="ghost"
                    className="text-xs py-0 px-2 w-fit -ml-5 -mt-5 hover:bg-transparent"
                    onClick={() => setShowCreateFeature(false)}
                  >
                    ← Product
                  </Button>
                )}

                <DialogTitle>
                  {showCreateFeature ||
                  (features.length == 0 && item.price === null)
                    ? "Create Feature"
                    : "Add Product Item"}
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="flex !overflow-visible  w-fit">
              {showCreateFeature ||
              (features.length == 0 && item.price === null) ? (
                <div className="w-full -mt-2">
                  <CreateFeature
                    isFromEntitlement={true}
                    setShowFeatureCreate={setShowCreateFeature}
                    setSelectedFeature={setSelectedFeature}
                    setOpen={setOpen}
                    open={open}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-4 w-fit !overflow-visible">
                  <ProductItemConfig />
                </div>
              )}
            </div>
          </DialogContentWrapper>
          {showCreateFeature ||
          (features.length == 0 && item.price === null) ? (
            <div className="" />
          ) : (
            <ItemConfigFooter />
          )}
        </DialogContent>
      </Dialog>
    </ProductItemContext.Provider>
  );
}
