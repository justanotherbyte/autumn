from __future__ import annotations

from typing import Awaitable, Callable, TypedDict, TYPE_CHECKING
import contextlib

from starlette.routing import Router, Route

from .routes import (
    attach_route,
    check_route,
    track_route,
    cancel_route,
    billing_portal_route,
)
from ..aio.client import AsyncClient

if TYPE_CHECKING:
    from starlette.requests import Request


class _CustomerData(TypedDict):
    name: str
    email: str


class AutumnData(TypedDict):
    customer_id: str
    customer_data: _CustomerData


class AutumnASGI:
    def __init__(
        self,
        token: str,
        *,
        identify: Callable[[Request], Awaitable[AutumnData]],
    ):
        @contextlib.asynccontextmanager
        async def lifespan(_):
            async with AsyncClient(token=token) as client:
                yield {"autumn": client, "identify": identify}

        router = Router(
            lifespan=lifespan,
            routes=[
                Route("/attach", attach_route, methods={"POST"}),
                Route("/check", check_route, methods={"POST"}),
                Route("/track", track_route, methods={"POST"}),
                Route("/cancel", cancel_route, methods={"POST"}),
                Route("/billing_portal", billing_portal_route, methods={"POST"}),
            ],
        )
        self._router = router

    async def __call__(self, scope, receive, send):
        await self._router(scope, receive, send)
