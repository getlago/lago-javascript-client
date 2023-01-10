import type { WalletTransaction, WalletTransactionInput } from "../main.ts";
import { lagoTest, unprocessableErrorResponse } from "./utils.ts";

const walletTransactionInput = {
  "wallet_transaction": {
    "wallet_id": "985da83c-c007-4fbb-afcd-b00c07c41ffe",
    "paid_credits": 100,
    "granted_credits": 10,
  },
} as const satisfies WalletTransactionInput;

const walletTransactionResponse = {
  "wallet_transaction": {
    "lago_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
    "lago_wallet_id": "985da83c-c007-4fbb-afcd-b00c07c41ffe",
    "status": "pending",
    "transaction_type": "inbound",
    "amount": 500,
    "credit_amount": 100,
    "settled_at": "2022-09-14T16:35:31Z",
    "created_at": "2022-09-14T16:35:31Z",
  },
} as const satisfies WalletTransaction;

Deno.test(
  "Successfully sent wallet transaction responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "POST@/api/v1/wallet_transactions",
      clientPath: ["walletTransactions", "createWalletTransaction"],
      inputParams: [walletTransactionInput],
      responseObject: walletTransactionResponse,
      status: 200,
    });
  },
);

Deno.test("Status code is not 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "POST@/api/v1/wallet_transactions",
    clientPath: ["walletTransactions", "createWalletTransaction"],
    inputParams: [walletTransactionInput],
    responseObject: unprocessableErrorResponse,
    status: 422,
  });
});
