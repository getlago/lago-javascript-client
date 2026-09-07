import type { WalletTransactionCreateInput } from "../mod.ts";
import { lagoTest, unprocessableErrorResponse } from "./utils.ts";

const walletTransactionInput = {
  "wallet_transaction": {
    "wallet_id": "985da83c-c007-4fbb-afcd-b00c07c41ffe",
    "paid_credits": "100",
    "granted_credits": "10",
  },
} as const satisfies WalletTransactionCreateInput;

Deno.test(
  "Successfully sent wallet transaction responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "POST@/api/v1/wallet_transactions",
      clientPath: ["walletTransactions", "createWalletTransaction"],
      inputParams: [walletTransactionInput],
      responseObject: {
        wallet_transactions: [
          {
            lago_id: "183da83c-c007-4fbb-afcd-b00c07c41ffe",
            lago_wallet_id: "wallet-id",
            lago_invoice_id: null,
            lago_credit_note_id: null,
            lago_voided_invoice_id: null,
            source: "manual",
            transaction_status: "purchased",
            invoice_requires_successful_payment: false,
            metadata: [],
            remaining_amount_cents: 500,
            remaining_credit_amount: "500",
            priority: 0,
            failed_at: null,
            name: null,
            payment_method: { payment_method_type: "provider" },
            status: "settled",
            transaction_type: "inbound",
            amount: "500",
            credit_amount: "500",
            settled_at: "2022-09-14T16:35:31Z",
            created_at: "2022-09-14T16:35:31Z",
          },
        ],
      },
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
