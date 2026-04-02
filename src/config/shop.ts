/**
 * Shop catalog and Razorpay use the same currency (default INR / ₹).
 * Set RAZORPAY_CURRENCY in .env (e.g. INR).
 */
export function getShopCurrency(): string {
  return (process.env.RAZORPAY_CURRENCY || 'INR').toUpperCase()
}
