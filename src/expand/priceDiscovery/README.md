# price_discovery

# stream Transactions:

1. client_info and stream_transactions_ethereum tables must be created in environment.

    Scripts for the same

    CREATE TABLE IF NOT EXISTS public.client_info
(
    row_id uuid NOT NULL DEFAULT gen_random_uuid(),
    client_id character varying(5) COLLATE pg_catalog."default" NOT NULL,
    address character varying(66) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "clientInfo_pkey" PRIMARY KEY (row_id)
)

CREATE TABLE IF NOT EXISTS public.transactions_ethereum
(
    row_id uuid NOT NULL DEFAULT gen_random_uuid(),
    block_hash character varying(66) COLLATE pg_catalog."default" NOT NULL,
    block_number bigint NOT NULL,
    chain_id character varying(5) COLLATE pg_catalog."default" NOT NULL,
    "from" character varying(48) COLLATE pg_catalog."default" NOT NULL,
    gas bigint NOT NULL,
    gas_price bigint NOT NULL,
    hash character varying(66) COLLATE pg_catalog."default" NOT NULL,
    input character varying(1024) COLLATE pg_catalog."default" NOT NULL,
    nonce integer NOT NULL,
    r character varying(66) COLLATE pg_catalog."default" NOT NULL,
    s character varying(66) COLLATE pg_catalog."default" NOT NULL,
    "to" character varying(66) COLLATE pg_catalog."default" NOT NULL,
    transaction_index integer NOT NULL,
    type integer NOT NULL,
    v character(32) COLLATE pg_catalog."default" NOT NULL,
    value character varying(128) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT stream_transaction_ethereum_pkey PRIMARY KEY (row_id)
)

2. Stream transaction and it's Socket server is started within app.js of our server

3. Socket can be listened using our server url
   Guidelines to implement socket client https://socket.io/docs/v4/client-initialization/
