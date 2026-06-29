import { useState } from 'react'
import './App.css'

// Taux de change fixes par rapport à l'EUR comme base
const CURRENCIES = [
  { code: 'EUR', name: 'EUR - Euro',                   rate: 1.0    },
  { code: 'USD', name: 'USD - Dollar américain',        rate: 1.08   },
  { code: 'GBP', name: 'GBP - Livre sterling',          rate: 0.86   },
  { code: 'JPY', name: 'JPY - Yen japonais',            rate: 161.5  },
  { code: 'CHF', name: 'CHF - Franc suisse',            rate: 0.98   },
  { code: 'CAD', name: 'CAD - Dollar canadien',         rate: 1.47   },
  { code: 'AUD', name: 'AUD - Dollar australien',       rate: 1.64   },
  { code: 'CNY', name: 'CNY - Yuan chinois',            rate: 7.82   },
  { code: 'MAD', name: 'MAD - Dirham marocain',         rate: 10.85  },
]

const getRateByCode = (code) => CURRENCIES.find((c) => c.code === code)?.rate ?? 1

function App() {
  const [amount, setAmount]     = useState('')
  const [fromCurrency, setFrom] = useState('EUR')
  const [toCurrency, setTo]     = useState('USD')
  const [result, setResult]     = useState(null)
  const [error, setError]       = useState('')
  const [animated, setAnimated] = useState(false)

  const handleSwap = () => {
    setFrom(toCurrency)
    setTo(fromCurrency)
    setResult(null)
    setError('')
  }

  const handleConvert = () => {
    if (amount === '' || amount === null) {
      setError('Veuillez saisir un montant.')
      setResult(null)
      return
    }

    const parsed = parseFloat(amount)

    if (isNaN(parsed)) {
      setError('Le montant doit être un nombre valide.')
      setResult(null)
      return
    }

    if (parsed < 0) {
      setError('Le montant ne peut pas être négatif.')
      setResult(null)
      return
    }

    setError('')

    const fromRate = getRateByCode(fromCurrency)
    const toRate   = getRateByCode(toCurrency)

    // Conversion via EUR comme pivot : amount → EUR → devise cible
    const converted = parsed * (toRate / fromRate)

    setAnimated(false)
    setTimeout(() => {
      setResult(converted)
      setAnimated(true)
    }, 50)
  }

  const handleAmountChange = (e) => {
    setAmount(e.target.value)
    setError('')
    setResult(null)
  }

  const fromLabel = CURRENCIES.find((c) => c.code === fromCurrency)?.name ?? fromCurrency
  const toLabel   = CURRENCIES.find((c) => c.code === toCurrency)?.name ?? toCurrency

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Convertisseur de Devises</h1>
        <p className="subtitle">Taux de change fixes</p>

        {/* Champ montant */}
        <div className="field">
          <label htmlFor="amount" className="label">Montant</label>
          <input
            id="amount"
            type="number"
            className={`input ${error ? 'input--error' : ''}`}
            placeholder="Ex : 100"
            value={amount}
            onChange={handleAmountChange}
            min="0"
            aria-label="Montant à convertir"
          />
          {error && <span className="error-msg" role="alert">{error}</span>}
        </div>

        {/* Sélecteurs de devises + bouton swap */}
        <div className="selectors">
          <div className="field">
            <label htmlFor="from" className="label">De</label>
            <select
              id="from"
              className="select"
              value={fromCurrency}
              onChange={(e) => { setFrom(e.target.value); setResult(null) }}
              aria-label="Devise de départ"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          <button
            className="swap-btn"
            onClick={handleSwap}
            aria-label="Inverser les devises"
            title="Inverser les devises"
          >
            ⇄
          </button>

          <div className="field">
            <label htmlFor="to" className="label">Vers</label>
            <select
              id="to"
              className="select"
              value={toCurrency}
              onChange={(e) => { setTo(e.target.value); setResult(null) }}
              aria-label="Devise d'arrivée"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bouton de conversion */}
        <button className="convert-btn" onClick={handleConvert}>
          Convertir
        </button>

        {/* Zone de résultat */}
        {result !== null && (
          <div className={`result ${animated ? 'result--visible' : ''}`} aria-live="polite">
            <p className="result__line">
              <span className="result__amount">{parseFloat(amount).toLocaleString('fr-FR')}</span>
              <span className="result__label"> {fromLabel}</span>
            </p>
            <p className="result__equals">=</p>
            <p className="result__line">
              <span className="result__converted">
                {result.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </span>
              <span className="result__label"> {toLabel}</span>
            </p>
          </div>
        )}

        {/* Taux utilisé — classe obligatoire .vercss */}
        {result !== null && (
          <p>
            Taux : 1 {fromCurrency} = {(getRateByCode(toCurrency) / getRateByCode(fromCurrency)).toFixed(6)} {toCurrency}
          </p>
        )}
      </div>
    </div>
  )
}

export default App
