/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface BillableMetricGroup {
  /** @example "region" */
  key?: string;
  values?: (string | object)[];
}

export interface BillableMetricObject {
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
  /** @example "bm1" */
  name?: string;
  /** @example "example_code" */
  code?: string;
  /** @example "description" */
  description?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  created_at?: string;
  /** @example "amount" */
  field_name?: string;
  /** Aggregation type */
  aggregation_type?: "count_agg" | "sum_agg" | "max_agg" | "unique_count_agg" | "recurring_count_agg";
  group?: BillableMetricGroup;
}

export interface BillableMetric {
  billable_metric?: BillableMetricObject;
}

export interface BillableMetrics {
  billable_metrics?: BillableMetricObject[];
}

export interface BillableMetricInput {
  billable_metric?: {
    /** @example "bm1" */
    name?: string;
    /** @example "example_code" */
    code?: string;
    /** @example "description" */
    description?: string;
    /** @example "amount" */
    field_name?: string;
    /** Aggregation type */
    aggregation_type?: "count_agg" | "sum_agg" | "max_agg" | "unique_count_agg" | "recurring_count_agg";
    group?: BillableMetricGroup;
  };
}

export interface GroupObject {
  /** @example "region" */
  key?: string;
  /** @example "EU" */
  value?: string;
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
}

export interface Groups {
  groups?: GroupObject[];
}

export interface AddOnObject {
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
  /** @example "example name" */
  name?: string;
  /** @example "example_code" */
  code?: string;
  /** @example "description" */
  description?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  created_at?: string;
  /** @example 1200 */
  amount_cents?: number;
  /** @example "EUR" */
  amount_currency?: string;
}

export interface AddOn {
  add_on?: AddOnObject;
}

export interface AddOns {
  add_ons?: AddOnObject[];
}

export interface AddOnInput {
  add_on?: {
    /** @example "example name" */
    name?: string;
    /** @example "example_code" */
    code?: string;
    /** @example "description" */
    description?: string;
    /** @example 1200 */
    amount_cents?: number;
    /** @example "EUR" */
    amount_currency?: string;
  };
}

export interface AppliedAddOnObject {
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
  /** @example "457uj93c-c007-4fbb-afcd-b00c07c41kki" */
  lago_add_on_id?: string;
  /** @example "code" */
  add_on_code?: string;
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_customer_id?: string;
  /** @example 1234567 */
  external_customer_id?: string;
  /** @example 1200 */
  amount_cents?: number;
  /** @example "EUR" */
  amount_currency?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  created_at?: string;
}

export interface AppliedAddOn {
  applied_add_on?: AppliedAddOnObject;
}

export interface AppliedAddOnInput {
  applied_add_on?: {
    /** @example 1234567 */
    external_customer_id?: string;
    /** @example "code" */
    add_on_code?: string;
    /** @example 1200 */
    amount_cents?: number;
    /** @example "EUR" */
    amount_currency?: string;
  };
}

export interface CouponObject {
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
  /** @example "coupon1" */
  name?: string;
  /** @example "example_code" */
  code?: string;
  /** Coupon type */
  coupon_type?: "fixed_amount" | "percentage";
  /** @example 1200 */
  amount_cents?: number;
  /** @example "EUR" */
  amount_currency?: string;
  /** @example true */
  reusable?: boolean;
  /** @example "2022-09-14T16:35:31.000Z" */
  created_at?: string;
  /** @example 25 */
  percentage_rate?: number;
  /** Frequency type */
  frequency?: "once" | "recurring";
  /** @example 3 */
  frequency_duration?: number;
  /** @example "2022-09-14T23:59:59.000Z" */
  expiration_at?: string;
  /** Expiration type */
  expiration?: "no_expiration" | "time_limit";
}

export interface Coupon {
  coupon?: CouponObject;
}

export interface Coupons {
  coupons?: CouponObject[];
}

export interface CouponInput {
  coupon?: {
    /** @example "coupon1" */
    name?: string;
    /** @example "example_code" */
    code?: string;
    /** Coupon type */
    coupon_type?: "fixed_amount" | "percentage";
    /** @example 1200 */
    amount_cents?: number;
    /** @example "EUR" */
    amount_currency?: string;
    /** @example true */
    reusable?: boolean;
    /** @example 25 */
    percentage_rate?: number;
    /** Frequency type */
    frequency?: "once" | "recurring";
    /** @example 3 */
    frequency_duration?: number;
    /** @example "2022-09-14T23:59:59.000Z" */
    expiration_at?: string;
    /** Expiration type */
    expiration?: "no_expiration" | "time_limit";
  };
}

export interface AppliedCouponObject {
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
  /** @example "544da83c-c007-4fbb-afcd-b00c07c41iit" */
  lago_coupon_id?: string;
  /** @example "example_code" */
  coupon_code?: string;
  /** @example "321da83c-c007-4fbb-afcd-b00c07c41ssd" */
  lago_customer_id?: string;
  /** @example 123456 */
  external_customer_id?: string;
  /** Status */
  status?: "active" | "terminated";
  /** @example 1200 */
  amount_cents?: number;
  /** @example 800 */
  amount_cents_remaining?: number;
  /** @example "EUR" */
  amount_currency?: string;
  /** @example 25 */
  percentage_rate?: number;
  /** Frequency type */
  frequency?: "once" | "recurring";
  /** @example 3 */
  frequency_duration?: number;
  /** @example 2 */
  frequency_duration_remaining?: number;
  /** @example "2022-09-14T23:59:59.000Z" */
  expiration_at?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  created_at?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  terminated_at?: string;
}

export interface AppliedCoupon {
  applied_coupon?: AppliedCouponObject;
}

export interface AppliedCoupons {
  applied_coupons?: AppliedCouponObject[];
}

export interface AppliedCouponInput {
  applied_coupon?: {
    /** @example 123456 */
    external_customer_id?: string;
    /** @example "example_code" */
    coupon_code?: string;
    /** Frequency type */
    frequency?: "once" | "recurring";
    /** @example 3 */
    frequency_duration?: number;
    /** @example 1200 */
    amount_cents?: number;
    /** @example "EUR" */
    amount_currency?: string;
    /** @example 25 */
    percentage_rate?: number;
  };
}

export interface BillingConfigurationOrganization {
  /** @example "text" */
  invoice_footer?: string;
  /** @example 25 */
  vat_rate?: number;
  /** @example 5 */
  invoice_grace_period?: number;
}

export interface OrganizationObject {
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
  /** @example "example name" */
  name?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  created_at?: string;
  /** @example "https://example.com" */
  webhook_url?: string;
  /** @example "CZ" */
  country?: string;
  /** @example "address1" */
  address_line1?: string;
  /** @example "address2" */
  address_line2?: string;
  /** @example "state1" */
  state?: string;
  /** @example 10000 */
  zipode?: string;
  /** @example "example@example.com" */
  email?: string;
  /** @example "City" */
  city?: string;
  /** @example "name1" */
  legal_name?: string;
  /** @example 10000 */
  legal_number?: string;
  /** @example "UTC" */
  timezone?: string;
  billing_configuration?: BillingConfigurationOrganization;
}

export interface Organization {
  organization?: OrganizationObject;
}

export interface OrganizationInput {
  organization?: {
    /** @example "https://example.com" */
    webhook_url?: string;
    /** @example "CZ" */
    country?: string;
    /** @example "address1" */
    address_line1?: string;
    /** @example "address2" */
    address_line2?: string;
    /** @example "state1" */
    state?: string;
    /** @example 10000 */
    zipode?: string;
    /** @example "example@example.com" */
    email?: string;
    /** @example "City" */
    city?: string;
    /** @example "name1" */
    legal_name?: string;
    /** @example 10000 */
    legal_number?: string;
    /** @example "Europe/Paris" */
    timezone?: string;
    billing_configuration?: BillingConfigurationOrganization;
  };
}

export interface BillingConfigurationCustomer {
  /** @example 3 */
  invoice_grace_period?: number;
  /** @example 25 */
  vat_rate?: number;
  /** Payment provider type */
  payment_provider?: "stripe" | "gocardless";
  /** @example 123456 */
  provider_customer_id?: string;
  /** @example true */
  sync_with_provider?: boolean;
  [key: string]: any;
}

export interface CustomerObject {
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
  /** @example "886da83c-c007-4fbb-afcd-b00c07c41ffe" */
  external_id?: string;
  /** @example "John Doe" */
  name?: string;
  /** @example 12345 */
  sequential_id?: number;
  /** @example "slug" */
  slug?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  created_at?: string;
  /** @example "CZ" */
  country?: string;
  /** @example "address1" */
  address_line1?: string;
  /** @example "address2" */
  address_line2?: string;
  /** @example "state1" */
  state?: string;
  /** @example 10000 */
  zipode?: string;
  /** @example "example@example.com" */
  email?: string;
  /** @example "City" */
  city?: string;
  /** @example "https://example.com" */
  url?: string;
  /** @example 3551234567 */
  phone?: string;
  /** @example "https://lago.url" */
  lago_url?: string;
  /** @example "name1" */
  legal_name?: string;
  /** @example 10000 */
  legal_number?: string;
  /** @example "EUR" */
  currency?: string;
  /** @example "UTC" */
  timezone?: string;
  /** @example "UTC" */
  applicable_timezone?: string;
  billing_configuration?: BillingConfigurationCustomer;
}

export interface Customer {
  customer?: CustomerObject;
}

export interface Customers {
  customers?: CustomerObject[];
}

export interface CustomerInput {
  customer?: {
    /** @example "886da83c-c007-4fbb-afcd-b00c07c41ffe" */
    external_id?: string;
    /** @example "John Doe" */
    name?: string;
    /** @example "CZ" */
    country?: string;
    /** @example "address1" */
    address_line1?: string;
    /** @example "address2" */
    address_line2?: string;
    /** @example "state1" */
    state?: string;
    /** @example 10000 */
    zipode?: string;
    /** @example "example@example.com" */
    email?: string;
    /** @example "City" */
    city?: string;
    /** @example "https://example.com" */
    url?: string;
    /** @example 3551234567 */
    phone?: string;
    /** @example "https://lago.url" */
    lago_url?: string;
    /** @example "name1" */
    legal_name?: string;
    /** @example 10000 */
    legal_number?: string;
    /** @example "EUR" */
    currency?: string;
    /** @example "Europe/Paris" */
    timezone?: string;
    billing_configuration?: BillingConfigurationCustomer;
  };
}

export interface ChargeUsageObject {
  /** @example 3 */
  units?: number;
  /** @example 1200 */
  amount_cents?: number;
  /** @example "EUR" */
  amount_currency?: string;
  charge?: {
    /** @example "278da83c-c007-4fbb-afcd-b00c07c41utg" */
    lago_id?: string;
    /** Charge model type */
    charge_model?: "standard" | "graduated" | "package" | "percentage" | "volume";
  };
  billable_metric?: {
    /** @example "278da83c-c007-4fbb-afcd-b00c07c41utg" */
    lago_id?: string;
    /** @example "Example name" */
    name?: string;
    /** @example "code" */
    code?: string;
    /** Aggregation type */
    aggregation_type?: "count_agg" | "sum_agg" | "max_agg" | "unique_count_agg" | "recurring_count_agg";
  };
  groups?: {
    /** @example "278da83c-c007-4fbb-afcd-b00c07c41utg" */
    lago_id?: string;
    /** @example "key" */
    key?: string;
    /** @example "value" */
    value?: string;
    /** @example 3.5 */
    units?: number;
    /** @example 1200 */
    amount_cents?: number;
  }[];
}

export interface CustomerUsageObject {
  /** @example "2022-09-14T00:00:00.000Z" */
  from_datetime?: string;
  /** @example "2022-09-14T00:00:00.000Z" */
  to_datetime?: string;
  /** @example "2022-09-15T00:00:00.000Z" */
  issuing_date?: string;
  /** @example 1200 */
  amount_cents?: number;
  /** @example "EUR" */
  amount_currency?: string;
  /** @example 1400 */
  total_amount_cents?: number;
  /** @example "EUR" */
  total_amount_currency?: string;
  /** @example 200 */
  vat_amount_cents?: number;
  /** @example "EUR" */
  vat_amount_currency?: string;
  charges_usage?: ChargeUsageObject[];
}

export interface CustomerUsage {
  customer_usage?: CustomerUsageObject;
}

export interface EventObject {
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
  /** @example 987654321 */
  transaction_id?: string;
  /** @example "111da83c-c007-4fbb-afcd-b00c07c41iop" */
  lago_customer_id?: string;
  /** @example 123456 */
  external_customer_id?: string;
  /** @example "code" */
  code?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  timestamp?: string;
  properties?: object;
  /** @example "447da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_subscription_id?: string;
  /** @example 123456 */
  external_subscription_id?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  created_at?: string;
}

export interface Event {
  event?: EventObject;
}

export interface EventInput {
  event?: {
    /** @example 123456 */
    transaction_id?: string;
    /** @example 654321 */
    external_customer_id?: string;
    /** @example "code" */
    code?: string;
    /** @example 1669823754 */
    timestamp?: number;
    /** @example 123456 */
    external_subscription_id?: string;
    properties?: object;
  };
}

export interface BatchEventInput {
  event?: {
    /** @example 123456 */
    transaction_id?: string;
    /** @example 654321 */
    external_customer_id?: string;
    /** @example "code" */
    code?: string;
    /** @example 1669823754 */
    timestamp?: number;
    external_subscription_ids?: string[];
    properties?: object;
  };
}

export interface GroupPropertiesObject {
  /** @example 123456 */
  group_id?: string;
  values?: object;
}

export interface ChargeObject {
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
  /** @example "278da83c-c007-4fbb-afcd-b00c07c41utg" */
  lago_billable_metric_id?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  created_at?: string;
  /** Charge model type */
  charge_model?: "standard" | "graduated" | "package" | "percentage" | "volume";
  properties?: object;
  group_properties?: GroupPropertiesObject[];
}

export interface PlanObject {
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
  /** @example "example name" */
  name?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  created_at?: string;
  /** @example "example_code" */
  code?: string;
  /** Plan interval */
  interval?: "weekly" | "monthly" | "yearly";
  /** @example "description" */
  description?: string;
  /** @example 1200 */
  amount_cents?: number;
  /** @example "EUR" */
  amount_currency?: string;
  /** @example 2 */
  trial_period?: number;
  /** @example true */
  pay_in_advance?: boolean;
  /** @example false */
  bill_charges_monthly?: boolean;
  charges?: ChargeObject[];
}

export interface Plan {
  plan?: PlanObject;
}

export interface Plans {
  plans?: PlanObject[];
}

export interface PlanInput {
  plan?: {
    /** @example "example name" */
    name?: string;
    /** @example "example_code" */
    code?: string;
    /** Plan interval */
    interval?: "weekly" | "monthly" | "yearly";
    /** @example "description" */
    description?: string;
    /** @example 1200 */
    amount_cents?: number;
    /** @example "EUR" */
    amount_currency?: string;
    /** @example 2 */
    trial_period?: number;
    /** @example true */
    pay_in_advance?: boolean;
    /** @example false */
    bill_charges_monthly?: boolean;
    charges?: {
      /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
      id?: string;
      /** @example "278da83c-c007-4fbb-afcd-b00c07c41utg" */
      billable_metric_id?: string;
      /** Charge model type */
      charge_model?: "standard" | "graduated" | "package" | "percentage" | "volume";
      properties?: object;
      group_properties?: {
        /** @example 123456 */
        group_id?: string;
        values?: object;
      }[];
    }[];
  };
}

export interface SubscriptionObject {
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
  /** @example 12345 */
  external_id?: string;
  /** @example "995da83c-c007-4fbb-afcd-b00c07c41tre" */
  lago_customer_id?: string;
  /** @example 54321 */
  external_customer_id?: string;
  /** @example "Test subscription" */
  name?: string;
  /** @example "plan_code" */
  plan_code?: string;
  /** Subscription status */
  status?: "active" | "pending" | "terminated" | "canceled";
  /** Billing time */
  billing_time?: "calendar" | "anniversary";
  /** @example "2022-09-14T16:35:31.000Z" */
  subscription_at?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  started_at?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  terminated_at?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  canceled_at?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  created_at?: string;
  /** @example "previous_code" */
  previous_plan_code?: string;
  /** @example "next_code" */
  next_plan_code?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  downgrade_plan_date?: string;
}

export interface Subscription {
  subscription?: SubscriptionObject;
}

export interface Subscriptions {
  subscriptions?: SubscriptionObject[];
}

export interface SubscriptionCreateInput {
  subscription?: {
    /** @example 12345 */
    external_customer_id?: string;
    /** @example "example_code" */
    plan_code?: string;
    /** @example "Test name" */
    name?: string;
    /** @example 54321 */
    external_id?: string;
    /** Billing time */
    billing_time?: "calendar" | "anniversary";
    /** @example "2022-08-08T00:00:00.000Z" */
    subscription_at?: string;
  };
}

export interface SubscriptionUpdateInput {
  subscription?: {
    /** @example "New name" */
    name?: string;
    /** @example "2022-08-08T00:00:00.000Z" */
    subscription_at?: string;
  };
}

export interface CreditObject {
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
  /** @example 1200 */
  amount_cents?: number;
  /** @example "EUR" */
  amount_currency?: string;
  item?: {
    /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
    lago_id?: string;
    /** @example "coupon" */
    type?: string;
    /** @example "code" */
    code?: string;
    /** @example "name" */
    name?: string;
  };
}

export interface FeeObject {
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_group_id?: string;
  /** @example 1200 */
  amount_cents?: number;
  /** @example "EUR" */
  amount_currency?: string;
  /** @example 1200 */
  vat_amount_cents?: number;
  /** @example "EUR" */
  vat_amount_currency?: string;
  /** @example 2.5 */
  units?: number;
  /** @example 5 */
  events_count?: number;
  item?: {
    /** Billing time */
    type?: "charge" | "add_on" | "subscription" | "credit";
    /** @example "code" */
    code?: string;
    /** @example "name" */
    name?: string;
  };
}

export interface InvoiceObject {
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
  /** @example 12345 */
  sequential_id?: number;
  /** @example 222345 */
  number?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  issuing_date?: string;
  /** Invoice type */
  invoice_type?: "subscription" | "add_on" | "credit";
  /** Status */
  payment_status?: "pending" | "succeeded" | "failed";
  /** @example 1200 */
  amount_cents?: number;
  /** @example "EUR" */
  amount_currency?: string;
  /** @example 20 */
  vat_amount_cents?: number;
  /** @example "EUR" */
  vat_amount_currency?: string;
  /** @example 20 */
  credit_amount_cents?: number;
  /** @example "EUR" */
  credit_amount_currency?: string;
  /** @example 1220 */
  total_amount_cents?: number;
  /** @example "EUR" */
  total_amount_currency?: string;
  /** @example true */
  legacy?: boolean;
  /** @example "https://example.com" */
  file_url?: string;
  customer?: CustomerObject;
  subscriptions?: SubscriptionObject[];
  fees?: FeeObject[];
  credits?: CreditObject[];
}

export interface Invoice {
  invoice?: InvoiceObject;
}

export interface Invoices {
  invoices?: InvoiceObject[];
}

export interface InvoiceInput {
  invoice?: {
    /** Status */
    payment_status?: "pending" | "succeeded" | "failed";
  };
}

export interface WalletObject {
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
  /** @example "254da83c-c007-4fbb-afcd-b00c07c41oit" */
  lago_customer_id?: string;
  /** @example 12345 */
  external_customer_id?: string;
  /** Status */
  status?: "active" | "terminated";
  /** @example "EUR" */
  currency?: string;
  /** @example "Name" */
  name?: string;
  /** @example 2 */
  rate_amount?: number;
  /** @example 500 */
  credits_balance?: number;
  /** @example 1000 */
  balance?: number;
  /** @example 100 */
  consumed_credits?: number;
  /** @example "2022-09-14T16:35:31.000Z" */
  created_at?: string;
  /** @example "2022-09-14T23:59:59.000Z" */
  expiration_at?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  last_balance_sync_at?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  last_consumed_credit_at?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  terminated_at?: string;
}

export interface Wallet {
  wallet?: WalletObject;
}

export interface Wallets {
  wallets?: WalletObject[];
}

export interface WalletInput {
  wallet?: {
    /** @example "Wallet name" */
    name?: string;
    /** @example 2 */
    rate_amount?: number;
    /** @example "EUR" */
    currency?: string;
    /** @example 500 */
    paid_credits?: number;
    /** @example 10 */
    granted_credits?: number;
    /** @example 12345 */
    external_customer_id?: string;
    /** @example "2022-09-14T23:59:59.000Z" */
    expiration_at?: string;
  };
}

export interface WalletUpdateInput {
  wallet?: {
    /** @example "Wallet name" */
    name?: string;
    /** @example "2022-09-14T23:59:59.000Z" */
    expiration_at?: string;
  };
}

export interface WalletTransactionObject {
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
  /** @example "985da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_wallet_id?: string;
  /** Status */
  status?: "pending" | "settled";
  /** Transaction type */
  transaction_type?: "inbound" | "outbound";
  /** @example 500 */
  amount?: number;
  /** @example 100 */
  credit_amount?: number;
  /** @example "2022-09-14T16:35:31.000Z" */
  settled_at?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  created_at?: string;
}

export interface WalletTransaction {
  wallet_transaction?: WalletTransactionObject;
}

export interface WalletTransactionInput {
  wallet_transaction?: {
    /** @example "985da83c-c007-4fbb-afcd-b00c07c41ffe" */
    wallet_id?: string;
    /** @example 100 */
    paid_credits?: number;
    /** @example 10 */
    granted_credits?: number;
  };
}

export interface CreditNoteItemObject {
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
  /** @example 1220 */
  amount_cents?: number;
  /** @example "EUR" */
  amount_currency?: string;
  fee?: FeeObject;
}

export interface CreditNoteObject {
  /** @example "183da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_id?: string;
  /** @example 1234 */
  sequential_id?: number;
  /** @example 123456789 */
  number?: string;
  /** @example "144da83c-c007-4fbb-afcd-b00c07c41ffe" */
  lago_invoice_id?: string;
  /** @example 123456789 */
  invoice_number?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  issuing_date?: string;
  /** Credit status */
  credit_status?: "available" | "consumed" | "voided";
  /** Refund status */
  refund_status?: "pending" | "succeeded" | "failed";
  /** Reason */
  reason?:
    | "duplicated_charge"
    | "product_unsatisfactory"
    | "order_change"
    | "order_cancellation"
    | "fraudulent_charge"
    | "other";
  /** @example "description" */
  description?: string;
  /** @example 1220 */
  total_amount_cents?: number;
  /** @example "EUR" */
  total_amount_currency?: string;
  /** @example 20 */
  vat_amount_cents?: number;
  /** @example "EUR" */
  vat_amount_currency?: string;
  /** @example 1000 */
  sub_total_vat_excluded_amount_cents?: number;
  /** @example "EUR" */
  sub_total_vat_excluded_amount_currency?: string;
  /** @example 20 */
  balance_amount_cents?: number;
  /** @example "EUR" */
  balance_amount_currency?: string;
  /** @example 20 */
  credit_amount_cents?: number;
  /** @example "EUR" */
  credit_amount_currency?: string;
  /** @example 20 */
  refund_amount_cents?: number;
  /** @example "EUR" */
  refund_amount_currency?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  created_at?: string;
  /** @example "2022-09-14T16:35:31.000Z" */
  updated_at?: string;
  /** @example "https://example.com" */
  file_url?: string;
  customer?: CustomerObject;
  items?: CreditNoteItemObject[];
}

export interface CreditNote {
  credit_note?: CreditNoteObject;
}

export interface CreditNotes {
  credit_notes?: CreditNoteObject[];
}

export interface CreditNoteInput {
  credit_note?: {
    /** @example "194da83c-c007-4fbb-afcd-b00c07c41fzh" */
    invoice_id?: string;
    /** Reason */
    reason?:
      | "duplicated_charge"
      | "product_unsatisfactory"
      | "order_change"
      | "order_cancellation"
      | "fraudulent_charge"
      | "other";
    /** @example "description" */
    description?: string;
    /** @example 20 */
    credit_amount_cents?: number;
    /** @example 20 */
    refund_amount_cents?: number;
    items?: {
      /** @example "144da83c-c007-4fbb-afcd-b00c07c41ffe" */
      fee_id?: string;
      /** @example 20 */
      amount_cents?: number;
    }[];
  };
}

export interface CreditNoteUpdateInput {
  credit_note?: {
    /** Refund status */
    refund_status?: "pending" | "succeeded" | "failed";
  };
}

export interface ApiResponseBadRequest {
  /**
   * @format int32
   * @example 400
   */
  status?: number;
  /** @example "Bad request" */
  error?: string;
}

export interface ApiResponseUnauthorized {
  /**
   * @format int32
   * @example 401
   */
  status?: number;
  /** @example "Unauthorized" */
  error?: string;
}

export interface ApiResponseUnprocessableEntity {
  /**
   * @format int32
   * @example 422
   */
  status?: number;
  /** @example "Unprocessable entity" */
  error?: string;
  /** @example "validation_errors" */
  code?: string;
  error_details?: object;
}

export interface ApiResponseNotFound {
  /**
   * @format int32
   * @example 404
   */
  status?: number;
  /** @example "Not Found" */
  error?: string;
  /** @example "object_not_found" */
  code?: string;
}

export interface ApiResponseNotAllowed {
  /**
   * @format int32
   * @example 405
   */
  status?: number;
  /** @example "Method Not Allowed" */
  error?: string;
  /** @example "not_allowed" */
  code?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://api.getlago.com/api/v1";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Lago API documentation
 * @version 0.0.1
 * @baseUrl https://api.getlago.com/api/v1
 * @externalDocs https://github.com/getlago
 * @contact <tech@getlago.com>
 *
 * Lago API allows your application to push customer information and metrics (events) from your application to the billing application.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  billableMetrics = {
    /**
     * @description Create a new billable metric
     *
     * @tags billable_metrics
     * @name CreateBillableMetric
     * @summary Create a new billable metric
     * @request POST:/billable_metrics
     * @secure
     */
    createBillableMetric: (data: BillableMetricInput, params: RequestParams = {}) =>
      this.request<BillableMetric, ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseUnprocessableEntity>({
        path: `/billable_metrics`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing billable metric by code
     *
     * @tags billable_metrics
     * @name UpdateBillableMetric
     * @summary Update an existing billable metric
     * @request PUT:/billable_metrics/{code}
     * @secure
     */
    updateBillableMetric: (code: string, data: BillableMetricInput, params: RequestParams = {}) =>
      this.request<
        BillableMetric,
        ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseUnprocessableEntity
      >({
        path: `/billable_metrics/${code}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Return a single billable metric
     *
     * @tags billable_metrics
     * @name FindBillableMetric
     * @summary Find billable metric by code
     * @request GET:/billable_metrics/{code}
     * @secure
     */
    findBillableMetric: (code: string, params: RequestParams = {}) =>
      this.request<BillableMetric, ApiResponseUnauthorized | ApiResponseNotFound>({
        path: `/billable_metrics/${code}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a billable metric
     *
     * @tags billable_metrics
     * @name DestroyBillableMetric
     * @summary Delete a billable metric
     * @request DELETE:/billable_metrics/{code}
     * @secure
     */
    destroyBillableMetric: (code: string, params: RequestParams = {}) =>
      this.request<BillableMetric, ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseNotAllowed>({
        path: `/billable_metrics/${code}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Find all billable metrics in certain organisation
     *
     * @tags billable_metrics
     * @name FindAllBillableMetrics
     * @summary Find Billable metrics
     * @request GET:/billable_metrics/
     * @secure
     */
    findAllBillableMetrics: (
      query?: {
        /**
         * Number of page
         * @example 2
         */
        page?: number;
        /**
         * Number of records per page
         * @example 20
         */
        per_page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BillableMetrics, ApiResponseUnauthorized>({
        path: `/billable_metrics/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Find all billable metric groups in certain organisation
     *
     * @tags billable_metrics
     * @name FindAllBillableMetricGroups
     * @summary Find Billable metric groups
     * @request GET:/billable_metrics/{code}/groups
     * @secure
     */
    findAllBillableMetricGroups: (
      code: string,
      query?: {
        /**
         * Number of page
         * @example 2
         */
        page?: number;
        /**
         * Number of records per page
         * @example 20
         */
        per_page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Groups, ApiResponseUnauthorized>({
        path: `/billable_metrics/${code}/groups`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  addOns = {
    /**
     * @description Create a new add-on
     *
     * @tags add_ons
     * @name CreateAddOn
     * @summary Create a new add-on
     * @request POST:/add_ons
     * @secure
     */
    createAddOn: (data: AddOnInput, params: RequestParams = {}) =>
      this.request<AddOn, ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseUnprocessableEntity>({
        path: `/add_ons`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing add-on by code
     *
     * @tags add_ons
     * @name UpdateAddOn
     * @summary Update an existing add-on
     * @request PUT:/add_ons/{code}
     * @secure
     */
    updateAddOn: (code: string, data: AddOnInput, params: RequestParams = {}) =>
      this.request<
        AddOn,
        ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseUnprocessableEntity
      >({
        path: `/add_ons/${code}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Return a single add-on
     *
     * @tags add_ons
     * @name FindAddOn
     * @summary Find add-on by code
     * @request GET:/add_ons/{code}
     * @secure
     */
    findAddOn: (code: string, params: RequestParams = {}) =>
      this.request<AddOn, ApiResponseUnauthorized | ApiResponseNotFound>({
        path: `/add_ons/${code}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete an add-on
     *
     * @tags add_ons
     * @name DestroyAddOn
     * @summary Delete an add-on
     * @request DELETE:/add_ons/{code}
     * @secure
     */
    destroyAddOn: (code: string, params: RequestParams = {}) =>
      this.request<AddOn, ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseNotAllowed>({
        path: `/add_ons/${code}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Find all add-ons in certain organisation
     *
     * @tags add_ons
     * @name FindAllAddOns
     * @summary Find add-ons
     * @request GET:/add_ons/
     * @secure
     */
    findAllAddOns: (
      query?: {
        /**
         * Number of page
         * @example 2
         */
        page?: number;
        /**
         * Number of records per page
         * @example 20
         */
        per_page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AddOns, ApiResponseUnauthorized>({
        path: `/add_ons/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  appliedAddOns = {
    /**
     * @description Apply an add-on to a customer
     *
     * @tags add_ons
     * @name ApplyAddOn
     * @summary Apply an add-on to a customer
     * @request POST:/applied_add_ons
     * @secure
     */
    applyAddOn: (data: AppliedAddOnInput, params: RequestParams = {}) =>
      this.request<
        AppliedAddOn,
        ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseUnprocessableEntity
      >({
        path: `/applied_add_ons`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  coupons = {
    /**
     * @description Create a new coupon
     *
     * @tags coupons
     * @name CreateCoupon
     * @summary Create a new coupon
     * @request POST:/coupons
     * @secure
     */
    createCoupon: (data: CouponInput, params: RequestParams = {}) =>
      this.request<Coupon, ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseUnprocessableEntity>({
        path: `/coupons`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing coupon by code
     *
     * @tags coupons
     * @name UpdateCoupon
     * @summary Update an existing coupon
     * @request PUT:/coupons/{code}
     * @secure
     */
    updateCoupon: (code: string, data: CouponInput, params: RequestParams = {}) =>
      this.request<
        Coupon,
        ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseUnprocessableEntity
      >({
        path: `/coupons/${code}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Return a single coupon
     *
     * @tags coupons
     * @name FindCoupon
     * @summary Find coupon by code
     * @request GET:/coupons/{code}
     * @secure
     */
    findCoupon: (code: string, params: RequestParams = {}) =>
      this.request<Coupon, ApiResponseUnauthorized | ApiResponseNotFound>({
        path: `/coupons/${code}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a coupon
     *
     * @tags coupons
     * @name DestroyCoupon
     * @summary Delete a coupon
     * @request DELETE:/coupons/{code}
     * @secure
     */
    destroyCoupon: (code: string, params: RequestParams = {}) =>
      this.request<Coupon, ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseNotAllowed>({
        path: `/coupons/${code}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Find all coupons in certain organisation
     *
     * @tags coupons
     * @name FindAllCoupons
     * @summary Find Coupons
     * @request GET:/coupons/
     * @secure
     */
    findAllCoupons: (
      query?: {
        /**
         * Number of page
         * @example 2
         */
        page?: number;
        /**
         * Number of records per page
         * @example 20
         */
        per_page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Coupons, ApiResponseUnauthorized>({
        path: `/coupons/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  appliedCoupons = {
    /**
     * @description Apply a coupon to a customer
     *
     * @tags coupons
     * @name ApplyCoupon
     * @summary Apply a coupon to a customer
     * @request POST:/applied_coupons
     * @secure
     */
    applyCoupon: (data: AppliedCouponInput, params: RequestParams = {}) =>
      this.request<
        AppliedCoupon,
        ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseUnprocessableEntity
      >({
        path: `/applied_coupons`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Find all applied coupons
     *
     * @tags coupons
     * @name FindAllAppliedCoupons
     * @summary Find Applied Coupons
     * @request GET:/applied_coupons/
     * @secure
     */
    findAllAppliedCoupons: (
      query?: {
        /**
         * Number of page
         * @example 2
         */
        page?: number;
        /**
         * Number of records per page
         * @example 20
         */
        per_page?: number;
        /** Status */
        status?: "active" | "terminated";
        /**
         * External customer ID
         * @example 12345
         */
        external_customer_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AppliedCoupons, ApiResponseUnauthorized>({
        path: `/applied_coupons/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  organizations = {
    /**
     * @description Update an existing organization
     *
     * @tags organizations
     * @name UpdateOrganization
     * @summary Update an existing Organization
     * @request PUT:/organizations/
     * @secure
     */
    updateOrganization: (data: OrganizationInput, params: RequestParams = {}) =>
      this.request<Organization, ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseUnprocessableEntity>({
        path: `/organizations/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  customers = {
    /**
     * @description Create a new customer
     *
     * @tags customers
     * @name CreateCustomer
     * @summary Create a customer
     * @request POST:/customers
     * @secure
     */
    createCustomer: (data: CustomerInput, params: RequestParams = {}) =>
      this.request<Customer, ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseUnprocessableEntity>({
        path: `/customers`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Return a single customer
     *
     * @tags customers
     * @name FindCustomer
     * @summary Find customer by external ID
     * @request GET:/customers/{external_id}
     * @secure
     */
    findCustomer: (externalId: string, params: RequestParams = {}) =>
      this.request<Customer, ApiResponseUnauthorized | ApiResponseNotFound>({
        path: `/customers/${externalId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Return a customer current usage
     *
     * @tags customers
     * @name FindCustomerCurrentUsage
     * @summary Find customer current usage
     * @request GET:/customers/{customer_external_id}/current_usage
     * @secure
     */
    findCustomerCurrentUsage: (
      customerExternalId: string,
      query: {
        /**
         * External subscription ID
         * @example 54321
         */
        external_subscription_id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CustomerUsage, ApiResponseUnauthorized | ApiResponseNotFound>({
        path: `/customers/${customerExternalId}/current_usage`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Find all customers in certain organisation
     *
     * @tags customers
     * @name FindAllCustomers
     * @summary Find customers
     * @request GET:/customers/
     * @secure
     */
    findAllCustomers: (
      query?: {
        /**
         * Number of page
         * @example 2
         */
        page?: number;
        /**
         * Number of records per page
         * @example 20
         */
        per_page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Customers, ApiResponseUnauthorized>({
        path: `/customers/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  events = {
    /**
     * @description Create a new event
     *
     * @tags events
     * @name CreateEvent
     * @summary Create a new event
     * @request POST:/events
     * @secure
     */
    createEvent: (data: EventInput, params: RequestParams = {}) =>
      this.request<void, ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseUnprocessableEntity>({
        path: `/events`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Create batch events
     *
     * @tags events
     * @name CreateBatchEvents
     * @summary Create batch events
     * @request POST:/events/batch
     * @secure
     */
    createBatchEvents: (data: BatchEventInput, params: RequestParams = {}) =>
      this.request<void, ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseUnprocessableEntity>({
        path: `/events/batch`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Return a single event
     *
     * @tags events
     * @name FindEvent
     * @summary Find event by transaction ID
     * @request GET:/events/{id}
     * @secure
     */
    findEvent: (id: string, params: RequestParams = {}) =>
      this.request<Event, ApiResponseUnauthorized | ApiResponseNotFound>({
        path: `/events/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  plans = {
    /**
     * @description Create a new plan
     *
     * @tags plans
     * @name CreatePlan
     * @summary Create a new plan
     * @request POST:/plans
     * @secure
     */
    createPlan: (data: PlanInput, params: RequestParams = {}) =>
      this.request<
        Plan,
        ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseUnprocessableEntity
      >({
        path: `/plans`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing plan by code
     *
     * @tags plans
     * @name UpdatePlan
     * @summary Update an existing plan
     * @request PUT:/plans/{code}
     * @secure
     */
    updatePlan: (code: string, data: PlanInput, params: RequestParams = {}) =>
      this.request<
        Plan,
        ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseUnprocessableEntity
      >({
        path: `/plans/${code}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Return a single plan
     *
     * @tags plans
     * @name FindPlan
     * @summary Fin plan by code
     * @request GET:/plans/{code}
     * @secure
     */
    findPlan: (code: string, params: RequestParams = {}) =>
      this.request<Plan, ApiResponseUnauthorized | ApiResponseNotFound>({
        path: `/plans/${code}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a plan
     *
     * @tags plans
     * @name DestroyPlan
     * @summary Delete a plan
     * @request DELETE:/plans/{code}
     * @secure
     */
    destroyPlan: (code: string, params: RequestParams = {}) =>
      this.request<Plan, ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseNotAllowed>({
        path: `/plans/${code}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Find all plans in certain organisation
     *
     * @tags plans
     * @name FindAllPlans
     * @summary Find plans
     * @request GET:/plans/
     * @secure
     */
    findAllPlans: (
      query?: {
        /**
         * Number of page
         * @example 2
         */
        page?: number;
        /**
         * Number of records per page
         * @example 20
         */
        per_page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Plans, ApiResponseUnauthorized>({
        path: `/plans/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  subscriptions = {
    /**
     * @description Assign a plan to a customer
     *
     * @tags subscriptions
     * @name CreateSubscription
     * @summary Assign a plan to a customer
     * @request POST:/subscriptions
     * @secure
     */
    createSubscription: (data: SubscriptionCreateInput, params: RequestParams = {}) =>
      this.request<
        Subscription,
        ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseUnprocessableEntity
      >({
        path: `/subscriptions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing subscription by external ID
     *
     * @tags subscriptions
     * @name UpdateSubscription
     * @summary Update an existing subscription
     * @request PUT:/subscriptions/{external_id}
     * @secure
     */
    updateSubscription: (externalId: string, data: SubscriptionUpdateInput, params: RequestParams = {}) =>
      this.request<
        Subscription,
        ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseUnprocessableEntity
      >({
        path: `/subscriptions/${externalId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Terminate a subscription
     *
     * @tags subscriptions
     * @name DestroySubscription
     * @summary Terminate a subscription
     * @request DELETE:/subscriptions/{external_id}
     * @secure
     */
    destroySubscription: (externalId: string, params: RequestParams = {}) =>
      this.request<Subscription, ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseNotAllowed>({
        path: `/subscriptions/${externalId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Find all suscriptions for certain customer
     *
     * @tags subscriptions
     * @name FindAllSubscriptions
     * @summary Find subscriptions
     * @request GET:/subscriptions/
     * @secure
     */
    findAllSubscriptions: (
      query: {
        /**
         * Number of page
         * @example 2
         */
        page?: number;
        /**
         * Number of records per page
         * @example 20
         */
        per_page?: number;
        /**
         * External customer ID
         * @example 12345
         */
        external_customer_id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Subscriptions, ApiResponseUnauthorized | ApiResponseNotFound>({
        path: `/subscriptions/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  webhooks = {
    /**
     * @description Webhook public key
     *
     * @tags webhooks
     * @name FetchPublicKey
     * @summary Fetch webhook public key
     * @request GET:/webhooks/public_key/
     * @secure
     */
    fetchPublicKey: (params: RequestParams = {}) =>
      this.request<string, ApiResponseUnauthorized>({
        path: `/webhooks/public_key/`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  invoices = {
    /**
     * @description Update an existing invoice
     *
     * @tags invoices
     * @name UpdateInvoice
     * @summary Update an existing invoice status
     * @request PUT:/invoices/{id}
     * @secure
     */
    updateInvoice: (id: string, data: InvoiceInput, params: RequestParams = {}) =>
      this.request<
        Invoice,
        ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseUnprocessableEntity
      >({
        path: `/invoices/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Return a single invoice
     *
     * @tags invoices
     * @name FindInvoice
     * @summary Find invoice by ID
     * @request GET:/invoices/{id}
     * @secure
     */
    findInvoice: (id: string, params: RequestParams = {}) =>
      this.request<Invoice, ApiResponseUnauthorized | ApiResponseNotFound>({
        path: `/invoices/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Download an existing invoice
     *
     * @tags invoices
     * @name DownloadInvoice
     * @summary Download an existing invoice
     * @request POST:/invoices/{id}/download
     * @secure
     */
    downloadInvoice: (id: string, params: RequestParams = {}) =>
      this.request<Invoice, ApiResponseUnauthorized | ApiResponseNotFound>({
        path: `/invoices/${id}/download`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Find all invoices in certain organisation
     *
     * @tags invoices
     * @name FindAllInvoices
     * @summary Find ainvoices
     * @request GET:/invoices/
     * @secure
     */
    findAllInvoices: (
      query?: {
        /**
         * Number of page
         * @example 2
         */
        page?: number;
        /**
         * Number of records per page
         * @example 20
         */
        per_page?: number;
        /**
         * External customer ID
         * @example 12345
         */
        external_customer_id?: string;
        /**
         * Date from
         * @example "2022-07-08T00:00:00.000Z"
         */
        issuing_date_from?: string;
        /**
         * Date to
         * @example "2022-08-09T00:00:00.000Z"
         */
        issuing_date_to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Invoices, ApiResponseUnauthorized>({
        path: `/invoices/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  wallets = {
    /**
     * @description Create a new wallet
     *
     * @tags wallets
     * @name CreateWallet
     * @summary Create a new wallet
     * @request POST:/wallets
     * @secure
     */
    createWallet: (data: WalletInput, params: RequestParams = {}) =>
      this.request<Wallet, ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseUnprocessableEntity>({
        path: `/wallets`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing wallet
     *
     * @tags wallets
     * @name UpdateWallet
     * @summary Update an existing wallet
     * @request PUT:/wallets/{id}
     * @secure
     */
    updateWallet: (id: string, data: WalletUpdateInput, params: RequestParams = {}) =>
      this.request<
        Wallet,
        ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseUnprocessableEntity
      >({
        path: `/wallets/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Return a wallet
     *
     * @tags wallets
     * @name FindWallet
     * @summary Find wallet
     * @request GET:/wallets/{id}
     * @secure
     */
    findWallet: (id: string, params: RequestParams = {}) =>
      this.request<Wallet, ApiResponseUnauthorized | ApiResponseNotFound>({
        path: `/wallets/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a wallet
     *
     * @tags wallets
     * @name DestroyWallet
     * @summary Delete a wallet
     * @request DELETE:/wallets/{id}
     * @secure
     */
    destroyWallet: (id: string, params: RequestParams = {}) =>
      this.request<Wallet, ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseNotAllowed>({
        path: `/wallets/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Find all wallets for certain customer
     *
     * @tags wallets
     * @name FindAllWallets
     * @summary Find wallets
     * @request GET:/wallets/
     * @secure
     */
    findAllWallets: (
      query: {
        /**
         * Number of page
         * @example 2
         */
        page?: number;
        /**
         * Number of records per page
         * @example 20
         */
        per_page?: number;
        /**
         * External customer ID
         * @example 12345
         */
        external_customer_id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Wallets, ApiResponseUnauthorized>({
        path: `/wallets/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  walletTransactions = {
    /**
     * @description Create a new wallet transaction
     *
     * @tags wallets
     * @name CreateWalletTransaction
     * @summary Create a new wallet transaction
     * @request POST:/wallet_transactions
     * @secure
     */
    createWalletTransaction: (data: WalletTransactionInput, params: RequestParams = {}) =>
      this.request<WalletTransaction, ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseUnprocessableEntity>(
        {
          path: `/wallet_transactions`,
          method: "POST",
          body: data,
          secure: true,
          type: ContentType.Json,
          format: "json",
          ...params,
        },
      ),
  };
  creditNotes = {
    /**
     * @description Create a new credit note
     *
     * @tags credit_notes
     * @name CreateCreditNote
     * @summary Create a new Credit note
     * @request POST:/credit_notes
     * @secure
     */
    createCreditNote: (data: CreditNoteInput, params: RequestParams = {}) =>
      this.request<CreditNote, ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseUnprocessableEntity>({
        path: `/credit_notes`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing credit note
     *
     * @tags credit_notes
     * @name UpdateCreditNote
     * @summary Update an existing credit note
     * @request PUT:/credit_notes/{id}
     * @secure
     */
    updateCreditNote: (id: string, data: CreditNoteUpdateInput, params: RequestParams = {}) =>
      this.request<
        CreditNote,
        ApiResponseBadRequest | ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseUnprocessableEntity
      >({
        path: `/credit_notes/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Return a single credit note
     *
     * @tags credit_notes
     * @name FindCreditNote
     * @summary Find credit note
     * @request GET:/credit_notes/{id}
     * @secure
     */
    findCreditNote: (id: string, params: RequestParams = {}) =>
      this.request<CreditNote, ApiResponseUnauthorized | ApiResponseNotFound>({
        path: `/credit_notes/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Download an existing credit note
     *
     * @tags credit_notes
     * @name DownloadCreditNote
     * @summary Download an existing credit note
     * @request POST:/credit_notes/{id}/download
     * @secure
     */
    downloadCreditNote: (id: string, params: RequestParams = {}) =>
      this.request<CreditNote, ApiResponseUnauthorized | ApiResponseNotFound>({
        path: `/credit_notes/${id}/download`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Void an existing credit note
     *
     * @tags credit_notes
     * @name VoidCreditNote
     * @summary Void existing credit note
     * @request PUT:/credit_notes/{id}/void
     * @secure
     */
    voidCreditNote: (id: string, params: RequestParams = {}) =>
      this.request<CreditNote, ApiResponseUnauthorized | ApiResponseNotFound | ApiResponseNotAllowed>({
        path: `/credit_notes/${id}/void`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Find all credit notes in certain organisation
     *
     * @tags credit_notes
     * @name FindAllCreditNotes
     * @summary Find Credit notes
     * @request GET:/credit_notes/
     * @secure
     */
    findAllCreditNotes: (
      query?: {
        /**
         * Number of page
         * @example 2
         */
        page?: number;
        /**
         * Number of records per page
         * @example 20
         */
        per_page?: number;
        /**
         * External customer ID
         * @example 12345
         */
        external_customer_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CreditNotes, ApiResponseUnauthorized>({
        path: `/credit_notes/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
