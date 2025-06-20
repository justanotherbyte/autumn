.. autumn.py documentation master file, created by
   sphinx-quickstart on Fri Jun  6 16:23:39 2025.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to Autumn.py!
=======================

Autumn.py is an *unofficial* SDK for interacting with the `Autumn API <https://useautumn.com/>`_, supporting both synchronous and asynchronous usage.

.. note::

    This SDK is not affiliated with Autumn. It is a solo-project currently in development.

This SDK currently supports Autumn's public REST API. While integrations with libraries such as `FastAPI <https://fastapi.tiangolo.com/>`_ are planned, they are not currently supported.
If you are looking for JavaScript support, this is not the SDK for you. This SDK, written in Python, is designed to be used on the server, with you responsible for handling communication of data to and from the client.
This SDK is designed to assist you with this, but knowledge of the Autumn flow is still required.

Quickstart
----------

To start using the SDK, you'll need your API key. You can find it in the `Autumn Dashboard <https://app.useautumn.com/sandbox/dev>`_.
The order of steps is the same as listed on the `Autumn docs <https://docs.useautumn.com/understanding>`_.

.. note::
   It is recommended to use a sandbox environment for testing. This can be controlled via the token you choose to give to the client.
   To securely store your API key, you can use environment variables.

.. code-block:: python

   import autumn

   # First, initialize a client.
   client = autumn.Client(token="your_api_key")

   # Attach a customer to a product
   client.attach(
        customer_id="john_doe",
        product_id="chat_messages",
   )

   # Check if the customer has access to the product
   check = client.check(
        customer_id="john_doe",
        product_id="chat_messages",
   )
   if check.allowed is True:
      print("Sending chat message...")

   # Once the customer uses a chat message:
   client.track(
        customer_id="john_doe",
        feature_id="chat_messages",
        value=1,
   )

   # Let's say the customer has run out of chat messages.
   check = client.check(
      customer_id="john_doe",
      product_id="chat_messages",
   )
   if check.allowed is False:
      print("Customer has run out of chat messages.")


Getting Help
------------

- Report bugs and request features on the `GitHub repository <https://github.com/justanotherbyte/autumn/issues>`_.
- Join the `Autumn Discord <https://discord.gg/QDjfwGGWKT>`_ for general API support. We do not have an official support Discord, but we're happy to help you out on GitHub.


.. toctree::
   :maxdepth: 2
   :caption: Contents:

   asyncio
   api

