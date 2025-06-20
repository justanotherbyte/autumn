from __future__ import annotations

from typing import TYPE_CHECKING

from .http import AsyncHTTPClient
from ..client import Client
from ..features import Features
from ..customers import Customers
from ..products import Products

if TYPE_CHECKING:
    from typing import Self
    from .shed import AttachParams, CheckParams, TrackParams

__all__ = ("AsyncClient",)


class AsyncClient(Client):
    """
    The ``async`` client class for interacting with the Autumn API.

    Parameters
    ----------
    token: str
        The API key to use for authentication.

    Attributes
    ----------
    customers: :class:`~autumn.customers.Customers`
        An interface to Autumn's customer API.
    features: :class:`~autumn.features.Features`
        An interface to Autumn's feature API.
    products: :class:`~autumn.products.Products`
        An interface to Autumn's product API.

    """

    attach: AttachParams  # type: ignore
    check: CheckParams  # type: ignore
    track: TrackParams  # type: ignore

    def __init__(self, token: str):
        from .. import BASE_URL, VERSION

        self.http = AsyncHTTPClient(BASE_URL, VERSION, token)
        self.customers = Customers(self.http)
        self.features = Features(self.http)
        self.products = Products(self.http)

    async def __aenter__(self) -> Self:
        return self

    async def __aexit__(self, _exc_type, _exc, _tb):
        await self.close()

    async def close(self):
        await self.http.close()
