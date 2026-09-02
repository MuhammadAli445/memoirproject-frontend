export type BookMemoryType = 'quote' | 'photo' | 'video' | 'audio' | 'text'

export interface BookMemory {
  id: string
  chapterId: string
  title: string
  type: BookMemoryType
  date?: string
  contributor: string
  body: string[]
  attribution: string
  caption?: string
  durationLabel?: string
  filmedBy?: string
  transcript?: string[]
  audioDurationSeconds?: number
  bgClassName: string
}

export interface BookChapter {
  id: string
  number: number
  title: string
  dateRange: string
  tagline: string
  coverQuote: string
  coverAttribution: string
  bgClassName: string
  memories: BookMemory[]
}

export const bookMeta = {
  title: 'The Story of Grandma Ayesha',
  subtitle: 'A Memoir Collected by Family',
  published: 'Published August 2026',
}

export const bookStats = {
  contributors: 14,
  memories: 31,
  decadesSpanned: 6,
  generations: 4,
}

export const aboutText = {
  paragraphs: [
    'This memoir, "The Story of Grandma Ayesha," is a labor of love, a beautifully woven tapestry of memories collected from across four generations of her family and friends. It began as a simple idea: to preserve the stories that have shaped us, to honor the woman who has been our matriarch and guiding light.',
    "Over the course of several months, we reached out to everyone who had the privilege of knowing her, asking them to share their most cherished moments, lessons learned, and the laughter that echoed through her home. The response was overwhelming, filled with anecdotes from her childhood in the village to her bustling life as a mother and grandmother in the city. Each contribution, big or small, has added a unique thread to this narrative, painting a vibrant and complete portrait of her.",
    "Each contribution, big or small, has added a unique thread to this narrative, painting a vibrant and complete portrait of Ayesha's extraordinary life. We have carefully curated and arranged these stories chronologically, interspersed with photographs and handwritten notes, to offer an immersive and authentic experience for every reader.",
  ],
  closing:
    'We hope this collection serves not only as a tribute to Grandma Ayesha but also as a testament to the enduring power of family, connection, and the stories that bind us together in love.',
}

export const chapters: BookChapter[] = [
  {
    id: 'chapter-1',
    number: 1,
    title: 'The Early Years',
    dateRange: '1970 — 1990',
    tagline: 'The Foundation',
    coverQuote: 'Her hands always smelled like flour and cinnamon.',
    coverAttribution: "Ayesha's Granddaughter",
    bgClassName: 'from-[#f5c98a] via-[#eeae6c] to-[#e08a52]',
    memories: [
      {
        id: 'the-first-time-i-met-her',
        chapterId: 'chapter-1',
        title: 'The First Time I Met Her',
        type: 'quote',
        date: '1978',
        contributor: 'Amina',
        bgClassName: 'from-[#d9a86c] via-[#c98a58] to-[#8a5a3c]',
        body: [
          'The air was thick with the scent of jasmine and damp earth as I stepped off the train in Lahore. It was a sensory overload, but amidst the chaos, her warm smile was a beacon of familiarity.',
          'She wore a faded floral dupatta, her eyes crinkling at the corners as she embraced me, whispering, "Finally, you are here, my child." The old city walls seemed to echo her words, welcoming me into a world I was yet to fully understand.',
          'That afternoon, sitting on the veranda with a cup of chai, the stories began to flow, each one a thread weaving our family history together.',
        ],
        attribution: 'A memory shared by her granddaughter, Amina.',
      },
      {
        id: 'her-kitchen-1978',
        chapterId: 'chapter-1',
        title: 'Her Kitchen, 1978',
        type: 'photo',
        date: '1978',
        contributor: 'Sara',
        bgClassName: 'from-[#efe6da] to-[#d8c8b0]',
        caption: "Grandma Ayesha's happy place, filled with the aroma of spices and love, 1978.",
        body: [
          'The kitchen was her kingdom. Every morning, before the sun fully rose, she\'d be there, the gentle clinking of pots and the rhythmic chopping of vegetables filling the air. It was a space that held more than just ingredients; it held laughter, whispered secrets, and the silent promise that everything would be alright as long as she was at the stove.',
          'The aroma of her signature stews was a constant comfort, a scent that even now, decades later, brings back the feeling of her warm embrace.',
        ],
        attribution: '— Sara · August 15, 2026',
      },
      {
        id: 'first-steps-in-the-new-house',
        chapterId: 'chapter-1',
        title: 'First Steps in the New House',
        type: 'text',
        date: '1982',
        contributor: 'Omar',
        bgClassName: 'from-[#f3ece3] to-[#e6d8c5]',
        body: [
          "We moved into the house on Zafar Road in the spring of 1982. Mother walked every room before we unpacked a single box, touching the walls as if introducing herself to the place.",
          "By evening she had already decided where the prayer mat would go, where the children would do their homework, and where, years later, every grandchild would learn to make her tea exactly the way she liked it.",
          "It never felt like a new house for long. Within a week, it smelled like her cooking, sounded like her laughter, and felt like home.",
        ],
        attribution: '— Omar, her son',
      },
    ],
  },
  {
    id: 'chapter-2',
    number: 2,
    title: 'The Middle Years',
    dateRange: '1990 — 2010',
    tagline: 'Roots & Branches',
    coverQuote: 'She never once raised her voice, and somehow, we still listened.',
    coverAttribution: "Ayesha's Son, Ahmed",
    bgClassName: 'from-[#e7c9a5] via-[#d9a878] to-[#a8623e]',
    memories: [
      {
        id: 'her-laugh',
        chapterId: 'chapter-2',
        title: 'Her Laugh',
        type: 'audio',
        date: '1996',
        contributor: 'Family gathering',
        bgClassName: 'from-[#f0ddc4] to-[#e3bd94]',
        audioDurationSeconds: 84,
        body: [
          'We were all gathered in the kitchen, the smell of her famous biryani filling the air. My cousin told a joke, something silly about a chicken crossing the road, and then it started.',
          "It began as a small chuckle, a little bubble of mirth, but it quickly escalated. Grandma Ayesha's laughter was infectious, a deep, resonant sound that seemed to come from her very soul. It was unfiltered, pure joy, the kind that made her eyes crinkle and tears stream down her cheeks.",
          'The entire room fell silent for a moment, absorbed in her happiness, and then, inevitably, we all joined in, a chorus of laughter echoing through the house.',
          'That sound, that unrestrained expression of delight, is one of my most cherished memories of her.',
        ],
        transcript: [
          '(Laughter begins, softly at first, then growing in volume and intensity)',
          "Oh, my goodness! (Pauses for breath, still laughing) That is...",
          "(Laughter continues, deep and resonant) Stop, stop! You're making my sides hurt!",
          '(Laughter fades slightly, then returns with renewed vigor) Oh, children, you bring me such joy!',
          '(Deep breath, final soft chuckle) Thank you.',
        ],
        attribution: 'Recorded at a family gathering, 1996',
      },
      {
        id: 'sunday-phone-calls',
        chapterId: 'chapter-2',
        title: 'Sunday Phone Calls',
        type: 'text',
        date: '2003',
        contributor: 'Layla',
        bgClassName: 'from-[#f3ece3] to-[#e6d8c5]',
        body: [
          "Every Sunday at noon, without fail, the phone would ring. It didn't matter what country I was studying in or how many time zones stood between us — she kept a little notebook with everyone's schedules written in her careful hand.",
          '"Tell me everything," she\'d say, and mean it. Twenty minutes could stretch into an hour, and I never once felt like I was keeping her from something else.',
          'Looking back, I think those calls were her way of holding the whole family together, one Sunday at a time.',
        ],
        attribution: '— Layla, her granddaughter',
      },
    ],
  },
  {
    id: 'chapter-3',
    number: 3,
    title: 'Later Life',
    dateRange: '2010 — 2026',
    tagline: 'The Olive Grove',
    coverQuote: 'Sit with me a while. The tea can wait.',
    coverAttribution: "Ayesha's Granddaughter",
    bgClassName: 'from-[#e8926a] via-[#c9633a] to-[#8a3f22]',
    memories: [
      {
        id: 'the-scent-of-cardamom',
        chapterId: 'chapter-3',
        title: 'The Scent of Cardamom',
        type: 'quote',
        date: '2015',
        contributor: 'Dina',
        bgClassName: 'from-[#dcb488] via-[#c58f5c] to-[#7a4a2c]',
        body: [
          "By her last years, she'd slowed down, but the tea ritual never changed. Cardamom pods crushed between her palms, the kettle whistling on cue, always three cups waiting even when only one of us had come to visit.",
          '"Someone else might stop by," she\'d say with a small smile, and more often than not, someone did.',
          'To this day, the smell of cardamom pulls me straight back to her veranda, the afternoon light, and her voice asking about my week as if nothing in the world mattered more.',
        ],
        attribution: '— Dina, her granddaughter',
      },
      {
        id: 'dads-wedding-speech-1985',
        chapterId: 'chapter-3',
        title: "Dad's Wedding Speech, 1985",
        type: 'video',
        date: '1985',
        contributor: 'Sara',
        bgClassName: 'from-[#c9754a] via-[#a8532e] to-[#5c2c17]',
        durationLabel: '3:42',
        filmedBy: 'Uncle Ahmed',
        body: [
          "The emotional context of the speech, detailing Dad's heartfelt words and the joyful atmosphere of the wedding day, captured on a home camcorder. This moment remains a cherished memory for the entire family, showcasing his love and humor.",
        ],
        attribution: '— Sara · August 15, 2026',
      },
      {
        id: 'the-golden-locket',
        chapterId: 'chapter-3',
        title: 'The Golden Locket',
        type: 'text',
        date: '2018',
        contributor: 'Mariam',
        bgClassName: 'from-[#f3ece3] to-[#e6d8c5]',
        body: [
          'She wore the same gold locket every day of my life. It wasn\'t until her ninetieth birthday that she finally opened it and showed me the tiny photograph inside — her own mother, taken decades before any of us were born.',
          '"So she is always close to my heart," she explained, closing the clasp gently. "And now, so are you."',
          'She pressed it into my palm that evening. I have not taken it off since.',
        ],
        attribution: '— Mariam, her granddaughter',
      },
    ],
  },
]

export interface FamilyTreeNode {
  name: string
  children?: FamilyTreeNode[]
}

export const familyTree: FamilyTreeNode = {
  name: 'Grandma Ayesha',
  children: [
    {
      name: 'Ahmed',
      children: [{ name: 'Sara' }, { name: 'Yousef' }],
    },
    {
      name: 'Fatima',
      children: [{ name: 'Mariam' }, { name: 'Karim' }],
    },
    {
      name: 'Omar',
      children: [{ name: 'Layla' }, { name: 'Dina' }],
    },
  ],
}

export function findMemory(memoryId: string): BookMemory | undefined {
  for (const chapter of chapters) {
    const memory = chapter.memories.find((m) => m.id === memoryId)
    if (memory) return memory
  }
  return undefined
}

export function findChapter(chapterId: string): BookChapter | undefined {
  return chapters.find((c) => c.id === chapterId)
}
