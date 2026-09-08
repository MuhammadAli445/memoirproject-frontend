export type MemoryType = 'text' | 'photo' | 'voice'

export interface Memory {
  id: string
  type: MemoryType
  title: string
  body: string
  createdAt: string
  updatedAt?: string
  isDraft: boolean
  location?: string
  photoDataUrl?: string | null
  photoCaption?: string
  audioUrl?: string | null
  audioDurationSeconds?: number
}

export interface Fragment {
  id: string
  body: string
  year?: string
  createdAt: string
}

export interface Subject {
  name: string
  birthYear?: number
  deathYear?: number
}

export interface Contributor {
  id: string
  name: string
  relationship: string
  status: 'invited' | 'contributed'
}

export interface OrderSummary {
  projectTitle: string
  relationshipFocus: string
  estimatedLength: string
  interviewTime: string
  subtotal: number
  tax: number
  totalDue: number
}

export interface PaymentForm {
  nameOnCard: string
  cardNumber: string
  expirationDate: string
  cvc: string
  billingZip: string
}
