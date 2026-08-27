import type { Contributor, Memory, Subject } from '../types'

export const subject: Subject = {
  name: 'Yusuf Ahmed',
  birthYear: 1948,
  deathYear: 2024,
}

const now = Date.now()
const hoursAgo = (h: number) => new Date(now - h * 60 * 60 * 1000).toISOString()
const daysAgo = (d: number) => new Date(now - d * 24 * 60 * 60 * 1000).toISOString()

export const sampleMemories: Memory[] = [
  {
    id: 'seed-photo-1',
    type: 'photo',
    title: 'The bakery near Tariq Road',
    body:
      "I remember the smell of it before I even saw the sign. We used to walk past it every Friday after school. He'd always stop, pat his pockets as if checking for spare change, even though we both knew he had exactly enough for two plain buns.",
    createdAt: hoursAgo(3),
    isDraft: false,
    location: 'Karachi, Pakistan',
    photoDataUrl: null,
    photoCaption: "He'd bring home the burnt ones because he said they were his.",
    audioUrl: null,
    audioDurationSeconds: 90,
  },
  {
    id: 'seed-voice-1',
    type: 'voice',
    title: 'Summer at the Lakehouse',
    body: 'A recording made at the lakehouse, describing the view at sunset and the sound of the water.',
    createdAt: daysAgo(2),
    isDraft: false,
    location: '',
    audioUrl: null,
    audioDurationSeconds: 194,
  },
  {
    id: 'seed-text-1',
    type: 'text',
    title: 'A walk in the rain',
    body:
      'The rain started to fall gently at first, a soft rhythm on the leaves of the old oak tree in the front yard. It was a sound that always brought back a flood of memories from childhood summers spent on the porch.',
    createdAt: daysAgo(5),
    updatedAt: hoursAgo(20),
    isDraft: true,
    location: '',
  },
]

export const sampleContributors: Contributor[] = [
  { id: 'c1', name: 'Amina Ahmed', relationship: 'Daughter', status: 'contributed' },
  { id: 'c2', name: 'Bilal Ahmed', relationship: 'Son', status: 'contributed' },
  { id: 'c3', name: 'Rukhsana Malik', relationship: 'Sister', status: 'invited' },
  { id: 'c4', name: 'Old Friend — Karim', relationship: 'Childhood friend', status: 'invited' },
]
