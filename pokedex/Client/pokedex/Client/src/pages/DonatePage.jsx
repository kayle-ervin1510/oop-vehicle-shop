import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { supabase } from '../lib/supabase'
import { useApp } from '../context/AppContext'

// Initialize Stripe once, outside any component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const PRESET_AMOUNTS = [
  { label: '$5',  cents: 500 },
  { label: '$10', cents: 1000 },
  { label: '$25', cents: 2500 },
  { label: '$50', cents: 5000 },
]

const cardElementOptions = {
  style: {
    base: {
      color: '#ffffff',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': { color: '#aab7c4' },
    },
    invalid: { color: '#fa755a', iconColor: '#fa755a' },
  },
}

function DonateForm() {
  const stripe = useStripe()
  const elements = useElements()
  const { currentUser } = useApp()

  const [selectedPreset, setSelectedPreset] = useState(null) // cents or null
  const [customAmount, setCustomAmount] = useState('')        // dollars string
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)   // { amountDollars }
  const [cardError, setCardError] = useState(null)
  const [networkError, setNetworkError] = useState(false)
  const [validationError, setValidationError] = useState(null)

  function getAmountCents() {
    if (selectedPreset !== null) return selectedPreset
    const dollars = parseFloat(customAmount)
    if (!isNaN(dollars) && dollars >= 1) return Math.round(dollars * 100)
    return null
  }

  function resetForm() {
    setSelectedPreset(null)
    setCustomAmount('')
    setCardError(null)
    setNetworkError(false)
    setValidationError(null)
    setSuccess(null)
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setCardError(null)
    setNetworkError(false)
    setValidationError(null)

    const amountCents = getAmountCents()
    if (!amountCents) {
      setValidationError('Please select or enter a donation amount.')
      return
    }

    if (!stripe || !elements) return

    setLoading(true)

    let clientSecret
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData?.session?.access_token

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-donation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ amount: amountCents, user_id: currentUser?.id }),
        }
      )

      if (!res.ok) {
        throw new Error(`Edge function returned ${res.status}`)
      }

      const json = await res.json()
      clientSecret = json.client_secret

      if (!clientSecret) {
        throw new Error('No client_secret in response')
      }
    } catch {
      setLoading(false)
      setNetworkError(true)
      return
    }

    const cardElement = elements.getElement(CardElement)
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card: cardElement } }
    )

    setLoading(false)

    if (stripeError) {
      setCardError(stripeError.message || 'Your card was declined. Please try again.')
      return
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      const amountDollars = (amountCents / 100).toFixed(0)
      setSuccess({ amountDollars })
    }
  }

  // Success state
  if (success) {
    return (
      <div data-testid="donate-success" style={styles.resultBox}>
        <h2 style={{ color: '#4caf50', marginBottom: 12 }}>Thank you!</h2>
        <p style={{ fontSize: 18 }}>
          Thank you for your ${success.amountDollars} donation! Your support keeps Zap App going.
        </p>
        <button style={styles.button} onClick={resetForm}>
          Donate again
        </button>
      </div>
    )
  }

  // Network error state
  if (networkError) {
    return (
      <div data-testid="donate-network-error" style={styles.resultBox}>
        <h2 style={{ color: '#f44336', marginBottom: 12 }}>Connection Error</h2>
        <p>Something went wrong. Please try again.</p>
        <button style={styles.button} onClick={resetForm}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {/* Preset amount buttons */}
      <div style={styles.amountGrid}>
        {PRESET_AMOUNTS.map(({ label, cents }) => (
          <button
            key={cents}
            type="button"
            onClick={() => {
              setSelectedPreset(cents)
              setCustomAmount('')
              setValidationError(null)
            }}
            style={{
              ...styles.presetBtn,
              ...(selectedPreset === cents ? styles.presetBtnActive : {}),
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Or enter a custom amount ($)</label>
        <input
          type="number"
          min={1}
          step="any"
          placeholder="e.g. 15"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value)
            setSelectedPreset(null)
            setValidationError(null)
          }}
          style={styles.input}
        />
      </div>

      {validationError && (
        <p style={styles.errorText}>{validationError}</p>
      )}

      {/* Card element */}
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Card details</label>
        <div style={styles.cardBox}>
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Stripe card error */}
      {cardError && (
        <div data-testid="donate-error" style={styles.errorBox}>
          <p style={{ margin: 0 }}>{cardError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Processing…' : 'Donate'}
      </button>
    </form>
  )
}

// Outer wrapper — provides Stripe Elements context and page layout
function DonatePageWrapper() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Support Zap App</h1>
        <p style={styles.subheading}>
          Help us keep parental screen-time management free for every family.
        </p>

        <Elements stripe={stripePromise}>
          <DonateForm />
        </Elements>

        <p style={styles.secureNote}>
          Payments are processed securely by Stripe. We never store your card details.
        </p>
      </div>
    </div>
  )
}

export default DonatePageWrapper

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
    padding: '24px 16px',
  },
  card: {
    background: 'rgba(255,255,255,0.07)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: '40px 36px',
    width: '100%',
    maxWidth: 480,
    color: '#ffffff',
  },
  heading: {
    margin: '0 0 8px',
    fontSize: 28,
    fontWeight: 700,
    textAlign: 'center',
  },
  subheading: {
    margin: '0 0 32px',
    fontSize: 14,
    color: '#aab7c4',
    textAlign: 'center',
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  amountGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 10,
  },
  presetBtn: {
    padding: '12px 0',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: 8,
    background: 'transparent',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  presetBtnActive: {
    background: '#e91e8c',
    borderColor: '#e91e8c',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: '#aab7c4',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    padding: '12px 14px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.25)',
    background: 'rgba(255,255,255,0.08)',
    color: '#ffffff',
    fontSize: 16,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  cardBox: {
    padding: '14px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.25)',
    background: 'rgba(255,255,255,0.08)',
  },
  button: {
    padding: '14px',
    borderRadius: 8,
    border: 'none',
    background: '#e91e8c',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
  errorText: {
    color: '#fa755a',
    margin: 0,
    fontSize: 14,
  },
  errorBox: {
    background: 'rgba(244,67,54,0.15)',
    border: '1px solid rgba(244,67,54,0.4)',
    borderRadius: 8,
    padding: '12px 14px',
    color: '#fa755a',
    fontSize: 14,
  },
  resultBox: {
    textAlign: 'center',
    padding: '20px 0',
  },
  secureNote: {
    marginTop: 20,
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
  },
}
