from enum import StrEnum
from typing import Literal, List, Optional, Union

from pydantic import BaseModel


class FreeTrialDuration(StrEnum):
    DAY = "day"


class UsageModel(StrEnum):
    PREPAID = "prepaid"
    PAY_PER_USE = "pay_per_use"


class ProductItemInterval(StrEnum):
    MINUTE = "minute"
    HOUR = "hour"
    DAY = "day"
    WEEK = "week"
    MONTH = "month"
    QUARTER = "quarter"
    SEMI_ANNUAL = "semi_annual"
    YEAR = "year"
    MULTIPLE = "multiple"


class PriceCurrencyPair(BaseModel):
    price: float
    currency: str


class PriceTier(BaseModel):
    to: float
    amount: Union[float, str]  # Can be a number or "inf"


class ProductItem(BaseModel):
    feature_id: Optional[str] = None
    included_usage: Optional[Union[float, str]] = None  # Infinite is "inf"
    interval: Optional[ProductItemInterval] = None
    usage_model: Optional[UsageModel] = None
    price: Optional[float] = None
    billing_units: Optional[float] = None
    entity_feature_id: Optional[str] = None
    reset_usage_on_billing: Optional[bool] = None
    reset_usage_when_enabled: Optional[bool] = None


class FreeTrial(BaseModel):
    duration: FreeTrialDuration
    length: float
    unique_fingerprint: bool


class Product(BaseModel):
    autumn_id: str
    created_at: float
    id: str
    name: str
    env: Literal["sandbox", "live"]
    is_add_on: bool
    is_default: bool
    group: str
    version: float
    items: List[ProductItem]
    free_trial: Optional[FreeTrial] = None
