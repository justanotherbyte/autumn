from __future__ import annotations

from typing import TYPE_CHECKING

from .http import AsyncHTTPClient
from ..client import Client
from ..features import Features
from ..customers import Customers
from ..products import Products

if TYPE_CHECKING:
    from .shed import AttachParams, CheckParams, TrackParams

__all__ = ("AsyncClient",)


class AsyncClient(Client):
    attach: AttachParams  # type: ignore
    check: CheckParams  # type: ignore
    track: TrackParams  # type: ignore

    def __init__(self, token: str):
        from .. import BASE_URL, VERSION

        self.http = AsyncHTTPClient(BASE_URL, VERSION, token)
        self.customers = Customers(self.http)
        self.features = Features(self.http)
        self.products = Products(self.http)

    async def close(self):
        await self.http.close()
