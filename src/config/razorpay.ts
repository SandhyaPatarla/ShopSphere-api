import Razorpay from 'razorpay'

let instance: Razorpay | null = null

export function getRazorpay(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set')
  }
  if (!instance) {
    instance = new Razorpay({ key_id: keyId, key_secret: keySecret })
  }
  return instance
}

export function getRazorpayKeySecret(): string {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) {
    throw new Error('RAZORPAY_KEY_SECRET is not set')
  }
  return secret
}

export function getRazorpayWebhookSecret(): string {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) {
    throw new Error('RAZORPAY_WEBHOOK_SECRET is not set')
  }
  return secret
}
