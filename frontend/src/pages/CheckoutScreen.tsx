import { useState } from 'react'
import { CreditCard, Lock } from 'lucide-react'
import BackButton from '../components/BackButton'
import type { OrderSummary, PaymentForm } from '../types'

const defaultOrder: OrderSummary = {
  projectTitle: 'The Golden Years: A Family Tapestry',
  relationshipFocus: 'Grandparents',
  estimatedLength: '50-75 Pages',
  interviewTime: '2-3 hours',
  subtotal: 299,
  tax: 0,
  totalDue: 299,
}

export default function CheckoutScreen() {
  const [order] = useState<OrderSummary>(defaultOrder)
  const [form, setForm] = useState<PaymentForm>({
    nameOnCard: '',
    cardNumber: '',
    expirationDate: '',
    cvc: '',
    billingZip: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentForm, string>>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  const update = (field: keyof PaymentForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return digits
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentForm, string>> = {}
    if (!form.nameOnCard.trim()) newErrors.nameOnCard = 'Required'
    if (form.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Enter a valid card number'
    if (form.expirationDate.length < 5) newErrors.expirationDate = 'MM/YY'
    if (form.cvc.length < 3) newErrors.cvc = 'Required'
    if (!form.billingZip.trim()) newErrors.billingZip = 'Required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setIsProcessing(true)
    // eslint-disable-next-line no-console
    console.log('Processing payment:', form)
    setTimeout(() => setIsProcessing(false), 2000)
  }

  return (
    <div className="min-h-screen bg-cream px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <BackButton to="/dashboard" className="text-ink/60 hover:text-ink" />
        </div>
        <h1 className="font-display text-[32px] font-medium text-ink">Review &amp; Checkout</h1>
        <p className="mt-2 text-[15px] text-ink/60">
          Finalize your details to begin preserving your story.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Order Summary */}
          <div className="rounded-2xl border border-gold-200/50 bg-white p-8 shadow-card">
            <h2 className="font-display text-xl text-ink">Order Summary</h2>

            <div className="mt-6 space-y-5">
              <OrderRow label="Project Title" value={order.projectTitle} />
              <OrderRow label="Relationship focus" value={order.relationshipFocus} />
              <OrderRow label="Estimated Length" value={order.estimatedLength} />
              <OrderRow
                label="Interview Time"
                value={order.interviewTime}
                icon={<span className="mr-1 text-clay-500">⏱</span>}
              />
            </div>

            <div className="mt-10 border-t border-ink/10 pt-6">
              <div className="flex items-center justify-between text-sm text-ink/60">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-ink/60">
                <span>Tax</span>
                <span>{order.tax === 0 ? 'Calculated next' : `$${order.tax.toFixed(2)}`}</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
                <span className="font-display text-lg text-ink">Total Due</span>
                <span className="font-display text-lg font-medium text-clay-600">
                  ${order.totalDue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="rounded-2xl border border-gold-200/50 bg-white p-8 shadow-card">
            <h2 className="font-display text-xl text-ink">Payment Details</h2>

            <div className="mt-6 space-y-5">
              <FormField
                label="NAME ON CARD"
                value={form.nameOnCard}
                onChange={(v) => update('nameOnCard', v)}
                placeholder="Eleanor Vance"
                error={errors.nameOnCard}
              />
              <FormField
                label="CARD NUMBER"
                value={form.cardNumber}
                onChange={(v) => update('cardNumber', formatCardNumber(v))}
                placeholder="0000 0000 0000 0000"
                error={errors.cardNumber}
                icon={<CreditCard className="h-4 w-4 text-ink/30" strokeWidth={1.75} />}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="EXPIRATION DATE"
                  value={form.expirationDate}
                  onChange={(v) => update('expirationDate', formatExpiry(v))}
                  placeholder="MM/YY"
                  error={errors.expirationDate}
                />
                <FormField
                  label="CVC"
                  value={form.cvc}
                  onChange={(v) => update('cvc', v.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  error={errors.cvc}
                />
              </div>
              <FormField
                label="BILLING ZIP CODE"
                value={form.billingZip}
                onChange={(v) => update('billingZip', v)}
                placeholder="ZIP Code"
                error={errors.billingZip}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isProcessing}
              className="mt-8 w-full rounded-lg bg-clay-600 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-clay-700 disabled:cursor-not-allowed disabled:bg-clay-500/50"
            >
              {isProcessing ? 'Processing...' : 'Confirm & Pay'}
            </button>
            <p className="mt-3 text-center text-xs text-ink/45">One-time payment. No subscription.</p>

            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-ink/40">
              <Lock className="h-3 w-3" strokeWidth={2} />
              <span>25-day money-back guarantee · Private &amp; secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderRow({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between border-b border-ink/10 pb-4">
      <span className="text-sm text-ink/55">{label}</span>
      <span className="text-right text-sm font-medium text-ink">
        {icon}
        {value}
      </span>
    </div>
  )
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  error,
  icon,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  error?: string
  icon?: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-ink/55">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border ${
            error ? 'border-red-400' : 'border-ink/15'
          } bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink/30 focus:border-clay-500 focus:outline-none focus:ring-1 focus:ring-clay-500`}
        />
        {icon && <span className="absolute right-3 top-1/2 -translate-y-1/2">{icon}</span>}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
