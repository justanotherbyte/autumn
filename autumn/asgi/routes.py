from __future__ import annotations

from typing import TYPE_CHECKING

from starlette.responses import JSONResponse

if TYPE_CHECKING:
    from starlette.requests import Request
    from ..aio.client import AsyncClient


async def attach_route(request: Request):
    identify = await request.state.identify(request)
    json = await request.json()
    autumn: AsyncClient = request.state.autumn

    response = await autumn.attach(**identify, **json)
    return JSONResponse(response.model_dump(mode="json"))


async def check_route(request: Request):
    identify = await request.state.identify(request)
    json = await request.json()
    autumn: AsyncClient = request.state.autumn

    response = await autumn.check(**identify, **json)
    return JSONResponse(response.model_dump(mode="json"))


async def track_route(request: Request):
    identify = await request.state.identify(request)
    json = await request.json()
    autumn: AsyncClient = request.state.autumn

    response = await autumn.track(**identify, **json)
    return JSONResponse(response.model_dump(mode="json"))


async def cancel_route(request: Request):
    identify = await request.state.identify(request)
    json = await request.json()
    autumn: AsyncClient = request.state.autumn

    response = await autumn.products.cancel_product(
        customer_id=identify["customer_id"], **json
    )
    return JSONResponse(response.model_dump(mode="json"))


async def billing_portal_route(request: Request):
    identify = await request.state.identify(request)
    json = await request.json()
    autumn: AsyncClient = request.state.autumn

    response = await autumn.customers.get_billing_portal(
        customer_id=identify["customer_id"], **json
    )
    return JSONResponse(response.model_dump(mode="json"))


async def create_entity_route(request: Request):
    identify = await request.state.identify(request)
    json = await request.json()
    autumn: AsyncClient = request.state.autumn

    response = await autumn.features.create_entity(
        customer_id=identify["customer_id"], **json
    )

    return JSONResponse(response.model_dump(mode="json"))
