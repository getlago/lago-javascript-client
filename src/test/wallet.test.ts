import type {
  Wallet,
  WalletInput,
  Wallets,
  WalletUpdateInput,
} from "../main.ts";
import { lagoTest, unprocessableErrorResponse } from "./utils.ts";

const walletInput = {
  "wallet": {
    "name": "Wallet name",
    "rate_amount": 2,
    "currency": "EUR",
    "paid_credits": 500,
    "granted_credits": 10,
    "external_customer_id": "12345",
    "expiration_at": "2022-09-14T23:59:59Z",
  },
} as const satisfies WalletInput;

const walletResponse = {
  "wallet": {
    "lago_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
    "lago_customer_id": "254da83c-c007-4fbb-afcd-b00c07c41oit",
    "external_customer_id": "12345",
    "status": "active",
    "currency": "EUR",
    "name": "Name",
    "rate_amount": 2,
    "credits_balance": 500,
    "balance": 1000,
    "consumed_credits": 100,
    "created_at": "2022-09-14T16:35:31Z",
    "expiration_at": "2022-09-14T23:59:59Z",
    "last_balance_sync_at": "2022-09-14T16:35:31Z",
    "last_consumed_credit_at": "2022-09-14T16:35:31Z",
    "terminated_at": "2022-09-14T16:35:31Z",
  },
} as const satisfies Wallet;

const walletUpdateInput = {
  "wallet": {
    "name": "Wallet name",
    "expiration_at": "2022-09-14T23:59:59Z",
  },
} as const satisfies WalletUpdateInput;

const walletsResponse = {
  wallets: [walletInput.wallet],
} satisfies Wallets;

Deno.test("Successfully sent wallet responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/wallets",
    clientPath: ["wallets", "createWallet"],
    inputParams: [walletInput],
    responseObject: walletResponse,
    status: 200,
  });
});

Deno.test("Status code is not 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "POST@/api/v1/wallets",
    clientPath: ["wallets", "createWallet"],
    inputParams: [walletInput],
    responseObject: unprocessableErrorResponse,
    status: 422,
  });
});

Deno.test("Successfully sent wallet update request responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "PUT@/api/v1/wallets/id",
    clientPath: ["wallets", "updateWallet"],
    inputParams: ["id", walletUpdateInput],
    responseObject: walletResponse,
    status: 200,
  });
});

Deno.test("Successfully sent wallet find request responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "GET@/api/v1/wallets/id",
    clientPath: ["wallets", "findWallet"],
    inputParams: ["id"],
    responseObject: walletResponse,
    status: 200,
  });
});

Deno.test("Successfully sent wallet destroy request responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "DELETE@/api/v1/wallets/id",
    clientPath: ["wallets", "destroyWallet"],
    inputParams: ["id"],
    responseObject: walletResponse,
    status: 200,
  });
});

Deno.test("Successfully sent wallet find all request responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "GET@/api/v1/wallets/",
    clientPath: ["wallets", "findAllWallets"],
    inputParams: [{ external_customer_id: "external-123" }],
    responseObject: walletsResponse,
    status: 200,
    urlParams: { external_customer_id: "external-123" },
  });
});

Deno.test(
  "Successfully sent wallet find all request with options responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "GET@/api/v1/wallets/",
      clientPath: ["wallets", "findAllWallets"],
      inputParams: [{
        external_customer_id: "external-123",
        per_page: 2,
        page: 3,
      }],
      responseObject: walletsResponse,
      status: 200,
      urlParams: {
        external_customer_id: "external-123",
        per_page: "2",
        page: "3",
      },
    });
  },
);
