import type {
  Wallet,
  WalletInput,
  Wallets,
  WalletUpdateInput,
} from "../mod.ts";
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
    "purchase_order_number": "PO-123",
    "recurring_transaction_rules": [
      {
        "trigger": "interval",
        "interval": "monthly",
        "method": "fixed",
        "paid_credits": 100,
        "granted_credits": 10,
        "purchase_order_number": "PO-RULE-123",
      },
    ],
  },
} satisfies WalletInput & {
  wallet: {
    purchase_order_number: string;
    recurring_transaction_rules: Array<{ purchase_order_number: string }>;
  };
};

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
    "purchase_order_number": "PO-123",
    "recurring_transaction_rules": [
      {
        "lago_id": "483da83c-c007-4fbb-afcd-b00c07c41ffe",
        "trigger": "interval",
        "interval": "monthly",
        "method": "fixed",
        "paid_credits": 100,
        "granted_credits": 10,
        "purchase_order_number": "PO-RULE-123",
      },
    ],
  },
} satisfies Wallet & {
  wallet: {
    purchase_order_number: string;
    recurring_transaction_rules: Array<{ purchase_order_number: string }>;
  };
};

const walletUpdateInput = {
  "wallet": {
    "name": "Wallet name",
    "expiration_at": "2022-09-14T23:59:59Z",
    "purchase_order_number": "PO-123",
  },
} satisfies WalletUpdateInput & {
  wallet: { purchase_order_number: string };
};

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
    expectedBody: walletInput,
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
    expectedBody: walletUpdateInput,
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
    route: "GET@/api/v1/wallets",
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
      route: "GET@/api/v1/wallets",
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
