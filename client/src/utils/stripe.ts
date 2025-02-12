import { loadStripe, Stripe } from "@stripe/stripe-js";

const stripePromise: Promise<Stripe | null> = loadStripe("pk_test_51Qn2WiQ61pydXpHxZ9hkjpAXtvwQ8207k0rQnN9EM09ENCVjDcjtyaPzchs1piIO6ueIx6wfqeMY0lYcEPLzuBvy00X4cdEEDo");

export default stripePromise;
