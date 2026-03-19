// ─── Learning Styles ───
export const LEARNING_STYLES = [
  {
    id: 'metaphor',
    label: 'Analogies & Metaphors',
    desc: 'Explain new ideas using things I already understand',
    iconId: 'style-metaphor',
    prompt: `## Learning Style: Analogies & Metaphors
- ALWAYS anchor every new concept to a familiar real-world analogy before giving the technical explanation.
- Use vivid, concrete comparisons.
- When introducing a concept, follow the pattern: analogy first → then the real thing → then how the analogy breaks down.`,
  },
  {
    id: 'stories',
    label: 'Stories & Examples',
    desc: 'Show me real cases and walk me through them',
    iconId: 'style-stories',
    prompt: `## Learning Style: Stories & Examples
- Lead with a concrete, real-world story or case study before explaining the concept.
- Use narrative structure: situation → problem → how the concept applies → outcome.
- When explaining how something works, walk through a specific example step-by-step.`,
  },
  {
    id: 'stepbystep',
    label: 'Step-by-Step',
    desc: 'Break it down into clear, logical steps',
    iconId: 'style-stepbystep',
    prompt: `## Learning Style: Step-by-Step
- Break every concept into numbered, sequential steps.
- Start from first principles and build up — never skip intermediate reasoning.
- After the breakdown, give a one-sentence summary that ties it all together.`,
  },
  {
    id: 'socratic',
    label: 'Guided Discovery',
    desc: 'Ask me questions that help me figure it out myself',
    iconId: 'style-socratic',
    prompt: `## Learning Style: Guided Discovery (Socratic)
- Instead of explaining directly, ask a thought-provoking question that leads the user toward the answer.
- When the user answers, build on their reasoning — affirm what's right, gently redirect what's off.
- Only provide direct explanations when the user is stuck or asks explicitly.`,
  },
  {
    id: 'visual',
    label: 'Visual & Mnemonics',
    desc: 'Give me mental models and memory tricks',
    iconId: 'style-visual',
    prompt: `## Learning Style: Visual Mental Models & Mnemonics
- Create vivid mental images for every concept.
- Use spatial language: "layers," "flows," "branches," "maps."
- Offer mnemonic devices, acronyms, or memory hooks when introducing terms.
- Summarize key ideas as memorable one-liners.`,
  },
  {
    id: 'eli5',
    label: 'Plain & Simple',
    desc: 'Explain it like I have zero background',
    iconId: 'style-eli5',
    prompt: `## Learning Style: Plain & Simple (ELI5)
- Use the simplest possible language. No jargon, no acronyms, no assumed knowledge.
- If you must use a technical term, immediately define it in parentheses in everyday words.
- Keep sentences short. One idea per sentence.
- Validate that it's okay to not know things.`,
  },
]

export function getLearningStyleById(id) {
  return LEARNING_STYLES.find(s => s.id === id)
}

// ─── Base Educator Framework ───
const BASE_INSTRUCTIONS = `
## Your Role
You are a world-class educator. Your single goal is to help this learner genuinely understand the topic — not to impress them with your knowledge, but to create real "aha!" moments. You teach with the clarity of Richard Feynman, the warmth of Mr. Rogers, and the engagement of the best TED speakers.

## Core Teaching Principles
1. Meet the learner where they are. Never assume knowledge. If unsure of their level, ask.
2. One concept at a time. Fully land one idea before introducing the next. Depth over breadth.
3. Concrete before abstract. Always ground explanations in something tangible before going theoretical.
4. Check understanding, don't just lecture. After explaining, ask a question that reveals whether the idea actually landed.
5. Build on what they said. Reference the user's own words and ideas. Make them feel heard.
6. Make it stick. End key explanations with a memorable takeaway — a one-liner, a mental model, or a surprising fact.

## Response Format — THIS IS CRITICAL
- BREVITY IS YOUR #1 RULE. Aim for 2-4 sentences per response. Never exceed 100 words. If your response would need scrolling on a phone screen, it is too long. Cut it in half.
- Write like you talk. Short sentences. Conversational. No textbook energy.
- One idea per response. Say one thing well, then ask a question. Do NOT try to be comprehensive. Resist the urge to add "and also..." or "here's another way to think about it..."
- Use **bold** for the single most important term or idea in a response. Use it once or twice, not on every sentence.
- When a diagram or comparison genuinely helps, use a simple one — two or three lines max:
  Input → [Processing] → Output
  Don't use visual aids in every response. Only when they add real clarity.
- Never use emojis.
- NEVER end with a summary, sign-off, or wrap-up. Always end with a question, a provocative thought, or a nudge that pulls them forward. Every response is an open door.

## Connecting Topics Naturally
When the user has grasped a concept, organically bridge to related ideas:
- "Now that you understand X, there's a really interesting connection to Y…"
- "This naturally leads to a question people always ask: …"
Don't force transitions. Let curiosity drive the flow.

## Quick Checks (Knowledge Checkpoints)
Every 6-8 exchanges, offer a Quick Check. Frame it conversationally, not like a test:
- "Let me see if this clicked…"
- "Quick gut-check before we go further…"
Format exactly like this on its own line:
[QUIZ]{"question":"Your question here","options":["Option A","Option B","Option C"],"correctIndex":1,"xpValue":10}[/QUIZ]
Make questions test understanding, not memorization. Use scenario-based questions when possible.

## Concept Tracking
When you meaningfully cover a core concept from your concept list, include:
[CONCEPT]concept-id-here[/CONCEPT]
Only tag a concept when you've actually explained it substantively, not just mentioned it.

## Suggested Follow-ups
Every 3-4 exchanges, offer natural next directions:
[SUGGESTIONS]{"suggestions":["Question 1?","Question 2?","Question 3?"]}[/SUGGESTIONS]
Make suggestions feel like genuine curiosity paths, not a menu.

## Boundaries
- Stay within your topic area. If asked about something outside scope, acknowledge the question and redirect warmly.
- Never just give answers — guide understanding. But don't be annoyingly Socratic when someone clearly just needs a straight answer.
- If the user seems confused, slow down and re-explain differently rather than pushing forward.
- If the user seems bored, skip ahead and increase depth.
`

// ─── Subject Personalities ───
const SUBJECT_PERSONALITIES = {
  math: {
    tutorName: 'Euler',
    personality: `You're patient, methodical, and genuinely love showing why things work — not just how. You make math feel like puzzle-solving, not homework. You celebrate elegant solutions and always connect formulas to real situations.`,
  },
  science: {
    tutorName: 'Darwin',
    personality: `You're curious, hands-on, and love experiments. You explain science through real-world observations and "what if" questions. You make even complex processes feel intuitive by connecting them to things people see every day.`,
  },
  english: {
    tutorName: 'Harper',
    personality: `You're warm, articulate, and passionate about clear communication. You help people find their voice, whether in writing or speaking. You use examples from everyday life, not just classic literature.`,
  },
  history: {
    tutorName: 'Clio',
    personality: `You're a storyteller who brings the past to life. You connect historical events to modern issues, reveal surprising details, and help people see patterns across time. You never make history feel like a list of dates.`,
  },
  cs: {
    tutorName: 'Ada',
    personality: `You're clever, playful, and love breaking complex systems into simple mental models. You explain computing through analogies anyone can follow. You make technical concepts feel approachable, never intimidating.`,
  },
  economics: {
    tutorName: 'Nash',
    personality: `You're practical and insightful. You connect economic concepts to everyday decisions — buying coffee, choosing a career, understanding the news. You make people feel smarter about the world around them.`,
  },
}

// ─── Subject/Discipline/Topic Taxonomy ───
export const SUBJECTS = [
  {
    id: 'math',
    name: 'Mathematics',
    iconId: 'subject-math',
    color: '#7C3AED',
    disciplines: [
      {
        id: 'arithmetic',
        name: 'Arithmetic & Numbers',
        topics: [
          { id: 'math-arithmetic-fractions', name: 'Fractions & Decimals', subtitle: 'Parts of a whole', difficulty: 'beginner', conceptMap: ['fractions', 'decimals', 'converting', 'operations', 'mixed-numbers'], starterMessages: ['What even is a fraction?', 'How do I add fractions?', 'When do I use decimals vs fractions?'] },
          { id: 'math-arithmetic-percentages', name: 'Percentages', subtitle: 'Parts per hundred', difficulty: 'beginner', conceptMap: ['percent-meaning', 'percent-of', 'percent-change', 'discounts-tax', 'conversion'], starterMessages: ['How do percentages work?', 'How do I calculate a discount?', 'What is percent change?'] },
          { id: 'math-arithmetic-order-ops', name: 'Order of Operations', subtitle: 'PEMDAS and why it matters', difficulty: 'beginner', conceptMap: ['pemdas', 'parentheses', 'exponents', 'left-to-right', 'common-mistakes'], starterMessages: ['What is PEMDAS?', 'Why does order matter in math?', 'Can you give me a tricky example?'] },
          { id: 'math-arithmetic-ratios', name: 'Ratios & Proportions', subtitle: 'Comparing quantities', difficulty: 'beginner', conceptMap: ['ratios', 'proportions', 'cross-multiply', 'scaling', 'unit-rates'], starterMessages: ['What is a ratio?', 'How are ratios and fractions different?', 'How do I solve proportions?'] },
        ],
      },
      {
        id: 'algebra',
        name: 'Algebra',
        topics: [
          { id: 'math-algebra-linear', name: 'Linear Equations', subtitle: 'Solve for x and graph lines', difficulty: 'beginner', conceptMap: ['variables', 'solving', 'slope', 'y-intercept', 'graphing', 'slope-intercept'], starterMessages: ['What does "solve for x" mean?', 'How do I graph a line?', 'What is slope?'] },
          { id: 'math-algebra-quadratics', name: 'Quadratic Equations', subtitle: 'Parabolas and the quadratic formula', difficulty: 'intermediate', conceptMap: ['quadratic-form', 'factoring', 'quadratic-formula', 'discriminant', 'parabola', 'vertex'], starterMessages: ['What is a quadratic equation?', 'How do I factor?', 'When do I use the quadratic formula?'] },
          { id: 'math-algebra-inequalities', name: 'Inequalities', subtitle: 'Greater than, less than, and ranges', difficulty: 'beginner', conceptMap: ['inequality-symbols', 'solving-inequalities', 'number-line', 'compound', 'absolute-value'], starterMessages: ['How are inequalities different from equations?', 'How do I graph an inequality?', 'What happens when I multiply by a negative?'] },
          { id: 'math-algebra-functions', name: 'Functions & Graphs', subtitle: 'Inputs, outputs, and patterns', difficulty: 'intermediate', conceptMap: ['function-definition', 'domain-range', 'function-notation', 'linear-vs-nonlinear', 'transformations'], starterMessages: ['What is a function?', 'What do domain and range mean?', 'How do I read a graph?'] },
        ],
      },
      {
        id: 'geometry',
        name: 'Geometry',
        topics: [
          { id: 'math-geometry-triangles', name: 'Angles & Triangles', subtitle: 'Shapes, degrees, and proofs', difficulty: 'beginner', conceptMap: ['angle-types', 'triangle-types', 'angle-sum', 'pythagorean', 'congruence', 'similarity'], starterMessages: ['What are the types of angles?', 'How does the Pythagorean theorem work?', 'What makes triangles congruent?'] },
          { id: 'math-geometry-area', name: 'Area & Perimeter', subtitle: 'Measuring flat shapes', difficulty: 'beginner', conceptMap: ['perimeter', 'area-rectangle', 'area-triangle', 'area-circle', 'composite-shapes'], starterMessages: ['What is the difference between area and perimeter?', 'How do I find the area of a circle?', 'How do I handle weird shapes?'] },
          { id: 'math-geometry-circles', name: 'Circles', subtitle: 'Pi, radius, and circumference', difficulty: 'beginner', conceptMap: ['radius-diameter', 'circumference', 'pi', 'area-of-circle', 'arc-length', 'sectors'], starterMessages: ['What is pi and where does it come from?', 'How do I find circumference?', 'What is a sector of a circle?'] },
        ],
      },
      {
        id: 'statistics',
        name: 'Statistics & Probability',
        topics: [
          { id: 'math-stats-central', name: 'Mean, Median, Mode', subtitle: 'Summarizing data', difficulty: 'beginner', conceptMap: ['mean', 'median', 'mode', 'range', 'outliers', 'when-to-use'], starterMessages: ['What is the difference between mean and median?', 'When does the mode matter?', 'How do outliers affect the average?'] },
          { id: 'math-stats-probability', name: 'Probability Basics', subtitle: 'Chance and likelihood', difficulty: 'beginner', conceptMap: ['probability-definition', 'sample-space', 'events', 'independent', 'conditional', 'expected-value'], starterMessages: ['What does probability actually mean?', 'How do I calculate the odds?', 'What are independent events?'] },
          { id: 'math-stats-dataviz', name: 'Data Visualization', subtitle: 'Charts, graphs, and what they show', difficulty: 'beginner', conceptMap: ['bar-charts', 'histograms', 'scatter-plots', 'pie-charts', 'misleading-graphs', 'choosing-charts'], starterMessages: ['When should I use a bar chart vs a pie chart?', 'How can graphs be misleading?', 'What is a histogram?'] },
        ],
      },
    ],
  },
  {
    id: 'science',
    name: 'Science',
    iconId: 'subject-science',
    color: '#14B8A6',
    disciplines: [
      {
        id: 'physics',
        name: 'Physics',
        topics: [
          { id: 'science-physics-forces', name: 'Forces & Motion', subtitle: "Newton's laws in action", difficulty: 'beginner', conceptMap: ['force', 'newtons-laws', 'friction', 'gravity', 'acceleration', 'momentum'], starterMessages: ['What is a force?', "What are Newton's three laws?", 'Why do things stop moving?'] },
          { id: 'science-physics-energy', name: 'Energy & Work', subtitle: 'How things move and change', difficulty: 'beginner', conceptMap: ['kinetic-energy', 'potential-energy', 'conservation', 'work', 'power', 'heat-transfer'], starterMessages: ['What is energy?', 'What is the difference between kinetic and potential energy?', 'Can energy be destroyed?'] },
          { id: 'science-physics-waves', name: 'Waves & Sound', subtitle: 'Vibrations that travel', difficulty: 'intermediate', conceptMap: ['wave-properties', 'frequency', 'wavelength', 'sound-waves', 'light-waves', 'resonance'], starterMessages: ['What is a wave?', 'How does sound travel?', 'What determines pitch?'] },
          { id: 'science-physics-electricity', name: 'Electricity Basics', subtitle: 'Current, voltage, and circuits', difficulty: 'beginner', conceptMap: ['charge', 'current', 'voltage', 'resistance', 'ohms-law', 'circuits'], starterMessages: ['What is electricity?', "How do circuits work?", "What is Ohm's law?"] },
        ],
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        topics: [
          { id: 'science-chem-atoms', name: 'Atoms & Elements', subtitle: 'Building blocks of everything', difficulty: 'beginner', conceptMap: ['atoms', 'protons-neutrons-electrons', 'elements', 'atomic-number', 'isotopes', 'ions'], starterMessages: ['What is an atom?', 'What is the difference between an element and an atom?', 'What are protons, neutrons, and electrons?'] },
          { id: 'science-chem-reactions', name: 'Chemical Reactions', subtitle: 'When substances transform', difficulty: 'beginner', conceptMap: ['reactants-products', 'balancing', 'types-of-reactions', 'exothermic-endothermic', 'catalysts'], starterMessages: ['What is a chemical reaction?', 'How do I balance an equation?', 'What makes a reaction speed up?'] },
          { id: 'science-chem-periodic', name: 'The Periodic Table', subtitle: 'Organizing all the elements', difficulty: 'beginner', conceptMap: ['periods-groups', 'metals-nonmetals', 'valence-electrons', 'trends', 'noble-gases', 'halogens'], starterMessages: ['How is the periodic table organized?', 'What are groups and periods?', 'Why do some elements behave similarly?'] },
        ],
      },
      {
        id: 'biology',
        name: 'Biology',
        topics: [
          { id: 'science-bio-cells', name: 'Cells & DNA', subtitle: 'The basics of life', difficulty: 'beginner', conceptMap: ['cell-structure', 'organelles', 'dna', 'genes', 'cell-division', 'protein-synthesis'], starterMessages: ['What is a cell?', 'What does DNA actually do?', 'How do cells divide?'] },
          { id: 'science-bio-evolution', name: 'Evolution', subtitle: 'How life changes over time', difficulty: 'intermediate', conceptMap: ['natural-selection', 'adaptation', 'speciation', 'fossil-record', 'common-ancestry', 'genetic-variation'], starterMessages: ['What is natural selection?', 'How does evolution actually work?', 'What is the evidence for evolution?'] },
          { id: 'science-bio-body', name: 'Human Body Systems', subtitle: 'How your body works', difficulty: 'beginner', conceptMap: ['circulatory', 'respiratory', 'digestive', 'nervous', 'immune', 'musculoskeletal'], starterMessages: ['How does the heart work?', 'What happens when I breathe?', 'How does my immune system fight disease?'] },
          { id: 'science-bio-ecosystems', name: 'Ecosystems', subtitle: 'How living things connect', difficulty: 'beginner', conceptMap: ['food-chains', 'food-webs', 'producers-consumers', 'decomposers', 'biomes', 'biodiversity'], starterMessages: ['What is an ecosystem?', 'How do food chains work?', 'What happens when a species disappears?'] },
        ],
      },
      {
        id: 'earth',
        name: 'Earth Science',
        topics: [
          { id: 'science-earth-weather', name: 'Weather & Climate', subtitle: 'Why skies do what they do', difficulty: 'beginner', conceptMap: ['weather-vs-climate', 'atmosphere', 'pressure-systems', 'clouds', 'climate-change', 'seasons'], starterMessages: ['What is the difference between weather and climate?', 'How do storms form?', 'What causes seasons?'] },
          { id: 'science-earth-plate', name: 'Plate Tectonics', subtitle: 'Moving continents', difficulty: 'intermediate', conceptMap: ['tectonic-plates', 'plate-boundaries', 'earthquakes', 'volcanoes', 'continental-drift', 'seafloor-spreading'], starterMessages: ['What are tectonic plates?', 'Why do earthquakes happen?', 'How do volcanoes form?'] },
          { id: 'science-earth-space', name: 'Space & Solar System', subtitle: 'Our cosmic neighborhood', difficulty: 'beginner', conceptMap: ['solar-system', 'planets', 'gravity-in-space', 'stars', 'moon-phases', 'seasons'], starterMessages: ['How big is the solar system?', 'Why do we have seasons?', 'What is a star made of?'] },
        ],
      },
    ],
  },
  {
    id: 'english',
    name: 'English',
    iconId: 'subject-english',
    color: '#3B82F6',
    disciplines: [
      {
        id: 'writing',
        name: 'Writing',
        topics: [
          { id: 'english-writing-essays', name: 'Essay Structure', subtitle: 'Thesis, arguments, and flow', difficulty: 'beginner', conceptMap: ['thesis-statement', 'intro', 'body-paragraphs', 'conclusion', 'transitions', 'evidence'], starterMessages: ['How do I write a thesis statement?', 'What makes a strong essay?', 'How do I start an introduction?'] },
          { id: 'english-writing-grammar', name: 'Grammar Essentials', subtitle: 'Rules that make writing clear', difficulty: 'beginner', conceptMap: ['subject-verb', 'tenses', 'punctuation', 'fragments', 'run-ons', 'common-errors'], starterMessages: ['What are the most common grammar mistakes?', 'When do I use a semicolon?', 'How do verb tenses work?'] },
          { id: 'english-writing-persuasive', name: 'Persuasive Writing', subtitle: 'Making your case', difficulty: 'intermediate', conceptMap: ['argument-structure', 'ethos-pathos-logos', 'counterarguments', 'tone', 'call-to-action'], starterMessages: ['How do I write persuasively?', 'What are ethos, pathos, and logos?', 'How do I handle counterarguments?'] },
          { id: 'english-writing-creative', name: 'Creative Writing', subtitle: 'Stories, voice, and style', difficulty: 'intermediate', conceptMap: ['show-dont-tell', 'dialogue', 'point-of-view', 'character-development', 'setting', 'voice'], starterMessages: ['How do I write good dialogue?', 'What does "show don\'t tell" mean?', 'How do I develop a character?'] },
        ],
      },
      {
        id: 'reading',
        name: 'Reading & Literature',
        topics: [
          { id: 'english-reading-comprehension', name: 'Reading Comprehension', subtitle: 'Understanding what you read', difficulty: 'beginner', conceptMap: ['main-idea', 'supporting-details', 'inference', 'context-clues', 'summarizing', 'critical-reading'], starterMessages: ['How do I find the main idea?', 'What is an inference?', 'How do I read more critically?'] },
          { id: 'english-reading-analysis', name: 'Literary Analysis', subtitle: 'Reading between the lines', difficulty: 'intermediate', conceptMap: ['theme', 'symbolism', 'literary-devices', 'tone-mood', 'narrator', 'figurative-language'], starterMessages: ['What is a theme vs a topic?', 'How do I identify symbolism?', 'What are common literary devices?'] },
          { id: 'english-reading-vocab', name: 'Vocabulary Building', subtitle: 'Words that make you sharper', difficulty: 'beginner', conceptMap: ['roots-prefixes', 'context-clues', 'connotation', 'word-families', 'academic-vocab', 'usage'], starterMessages: ['How do I learn new words faster?', 'What are root words?', 'What is the difference between connotation and denotation?'] },
        ],
      },
      {
        id: 'communication',
        name: 'Communication',
        topics: [
          { id: 'english-comm-speaking', name: 'Public Speaking', subtitle: 'Confidence and clarity', difficulty: 'intermediate', conceptMap: ['structure', 'delivery', 'body-language', 'audience-awareness', 'nerves', 'storytelling'], starterMessages: ['How do I get over public speaking anxiety?', 'How do I structure a speech?', 'What makes a speaker engaging?'] },
          { id: 'english-comm-debate', name: 'Argument & Debate', subtitle: 'Think and argue clearly', difficulty: 'intermediate', conceptMap: ['claim-evidence-reasoning', 'fallacies', 'rebuttal', 'critical-thinking', 'steel-man'], starterMessages: ['What is a logical fallacy?', 'How do I argue better?', 'What is steelmanning?'] },
        ],
      },
    ],
  },
  {
    id: 'history',
    name: 'History',
    iconId: 'subject-history',
    color: '#F59E0B',
    disciplines: [
      {
        id: 'world-history',
        name: 'World History',
        topics: [
          { id: 'history-world-ancient', name: 'Ancient Civilizations', subtitle: 'Mesopotamia, Egypt, Greece, Rome', difficulty: 'beginner', conceptMap: ['mesopotamia', 'egypt', 'greece', 'rome', 'agriculture', 'writing-systems', 'empires'], starterMessages: ['What was the first civilization?', 'How were the pyramids built?', 'Why did Rome fall?'] },
          { id: 'history-world-renaissance', name: 'The Renaissance', subtitle: 'Rebirth of art and ideas', difficulty: 'intermediate', conceptMap: ['humanism', 'art-revolution', 'printing-press', 'reformation', 'scientific-revolution', 'key-figures'], starterMessages: ['What was the Renaissance?', 'Why did it start in Italy?', 'How did the printing press change everything?'] },
          { id: 'history-world-wars', name: 'World Wars', subtitle: 'The conflicts that shaped the modern world', difficulty: 'intermediate', conceptMap: ['ww1-causes', 'trench-warfare', 'treaty-versailles', 'ww2-causes', 'holocaust', 'atomic-bomb', 'aftermath'], starterMessages: ['What caused World War I?', 'How did World War II start?', 'What were the lasting effects?'] },
          { id: 'history-world-coldwar', name: 'The Cold War', subtitle: 'Superpowers and standoffs', difficulty: 'intermediate', conceptMap: ['iron-curtain', 'nato-warsaw', 'nuclear-arms', 'proxy-wars', 'space-race', 'berlin-wall', 'collapse-ussr'], starterMessages: ['What was the Cold War about?', 'Why did the US and USSR become rivals?', 'How did the Cold War end?'] },
        ],
      },
      {
        id: 'us-history',
        name: 'US History',
        topics: [
          { id: 'history-us-revolution', name: 'American Revolution', subtitle: 'Independence and founding', difficulty: 'beginner', conceptMap: ['colonial-era', 'taxation', 'declaration', 'key-battles', 'constitution', 'founding-fathers'], starterMessages: ['Why did the colonies rebel?', 'What was the Declaration of Independence about?', 'How was the Constitution created?'] },
          { id: 'history-us-civilwar', name: 'Civil War', subtitle: 'A nation divided', difficulty: 'intermediate', conceptMap: ['slavery', 'secession', 'key-battles', 'emancipation', 'reconstruction', 'lasting-impact'], starterMessages: ['What caused the Civil War?', 'What was the Emancipation Proclamation?', 'What happened during Reconstruction?'] },
          { id: 'history-us-civilrights', name: 'Civil Rights Movement', subtitle: 'The fight for equality', difficulty: 'intermediate', conceptMap: ['segregation', 'brown-v-board', 'mlk', 'rosa-parks', 'civil-rights-act', 'voting-rights', 'legacy'], starterMessages: ['What was the Civil Rights Movement?', 'Who were the key leaders?', 'What did the Civil Rights Act do?'] },
        ],
      },
      {
        id: 'historical-thinking',
        name: 'Historical Thinking',
        topics: [
          { id: 'history-thinking-sources', name: 'Primary Sources', subtitle: 'Reading real evidence', difficulty: 'intermediate', conceptMap: ['primary-vs-secondary', 'sourcing', 'corroboration', 'contextualization', 'close-reading'], starterMessages: ['What is a primary source?', 'How do I analyze a historical document?', 'How do I know if a source is reliable?'] },
          { id: 'history-thinking-bias', name: 'Bias in History', subtitle: 'Who writes the story matters', difficulty: 'intermediate', conceptMap: ['perspective', 'bias-types', 'propaganda', 'revisionism', 'multiple-narratives', 'critical-analysis'], starterMessages: ['How does bias affect history?', 'What is historical revisionism?', 'How do I spot propaganda?'] },
        ],
      },
    ],
  },
  {
    id: 'cs',
    name: 'Computer Science',
    iconId: 'subject-cs',
    color: '#F43F5E',
    disciplines: [
      {
        id: 'programming',
        name: 'Programming Basics',
        topics: [
          { id: 'cs-prog-variables', name: 'Variables & Data Types', subtitle: 'Storing and naming things', difficulty: 'beginner', conceptMap: ['variables', 'data-types', 'strings', 'numbers', 'booleans', 'assignment'], starterMessages: ['What is a variable?', 'What are data types?', 'How do I store information in code?'] },
          { id: 'cs-prog-loops', name: 'Loops & Conditionals', subtitle: 'Making decisions and repeating', difficulty: 'beginner', conceptMap: ['if-else', 'comparison', 'logical-operators', 'for-loops', 'while-loops', 'nested'], starterMessages: ['What is an if statement?', 'How do loops work?', 'When do I use a for vs while loop?'] },
          { id: 'cs-prog-functions', name: 'Functions', subtitle: 'Reusable blocks of code', difficulty: 'beginner', conceptMap: ['function-definition', 'parameters', 'return-values', 'scope', 'calling', 'reusability'], starterMessages: ['What is a function?', 'What are parameters?', 'Why should I use functions?'] },
          { id: 'cs-prog-debugging', name: 'Debugging', subtitle: 'Finding and fixing errors', difficulty: 'beginner', conceptMap: ['syntax-errors', 'logic-errors', 'runtime-errors', 'print-debugging', 'reading-errors', 'systematic-approach'], starterMessages: ['What is debugging?', 'How do I read an error message?', 'What is the difference between a syntax and logic error?'] },
        ],
      },
      {
        id: 'web',
        name: 'Web Development',
        topics: [
          { id: 'cs-web-html-css', name: 'HTML & CSS', subtitle: 'Building and styling web pages', difficulty: 'beginner', conceptMap: ['html-elements', 'tags', 'css-selectors', 'box-model', 'layout', 'responsive'], starterMessages: ['What is HTML?', 'How does CSS work?', 'How do I make a simple web page?'] },
          { id: 'cs-web-javascript', name: 'JavaScript Basics', subtitle: 'Making pages interactive', difficulty: 'intermediate', conceptMap: ['dom', 'events', 'functions-js', 'arrays', 'objects', 'async'], starterMessages: ['What is JavaScript?', 'How do I make a button do something?', 'What is the DOM?'] },
          { id: 'cs-web-how-web', name: 'How the Web Works', subtitle: 'URLs, servers, and requests', difficulty: 'beginner', conceptMap: ['client-server', 'http', 'urls', 'dns', 'apis', 'browsers'], starterMessages: ['What happens when I type a URL?', 'What is a server?', 'What is an API?'] },
        ],
      },
      {
        id: 'cs-concepts',
        name: 'CS Concepts',
        topics: [
          { id: 'cs-concepts-algorithms', name: 'Algorithms', subtitle: 'Step-by-step problem solving', difficulty: 'intermediate', conceptMap: ['algorithm-definition', 'sorting', 'searching', 'big-o', 'efficiency', 'pseudocode'], starterMessages: ['What is an algorithm?', 'What is Big O notation?', 'How does sorting work?'] },
          { id: 'cs-concepts-data-structures', name: 'Data Structures', subtitle: 'Organizing information', difficulty: 'intermediate', conceptMap: ['arrays', 'linked-lists', 'stacks', 'queues', 'trees', 'hash-tables'], starterMessages: ['What is a data structure?', 'What is the difference between an array and a linked list?', 'When do I use a hash table?'] },
          { id: 'cs-concepts-binary', name: 'Binary & Logic', subtitle: 'How computers think in 0s and 1s', difficulty: 'beginner', conceptMap: ['binary', 'bits-bytes', 'boolean-logic', 'logic-gates', 'encoding', 'hexadecimal'], starterMessages: ['What is binary?', 'How do computers use 0s and 1s?', 'What are logic gates?'] },
        ],
      },
    ],
  },
  {
    id: 'economics',
    name: 'Economics',
    iconId: 'subject-economics',
    color: '#8B5CF6',
    disciplines: [
      {
        id: 'micro',
        name: 'Microeconomics',
        topics: [
          { id: 'econ-micro-supply-demand', name: 'Supply & Demand', subtitle: 'Why prices change', difficulty: 'beginner', conceptMap: ['demand-curve', 'supply-curve', 'equilibrium', 'shortage-surplus', 'elasticity', 'price-signals'], starterMessages: ['What is supply and demand?', 'Why do prices go up and down?', 'What is equilibrium?'] },
          { id: 'econ-micro-markets', name: 'Market Structures', subtitle: 'Competition and monopolies', difficulty: 'intermediate', conceptMap: ['perfect-competition', 'monopoly', 'oligopoly', 'monopolistic-competition', 'barriers-entry', 'market-power'], starterMessages: ['What is a monopoly?', 'How does competition affect prices?', 'What is an oligopoly?'] },
          { id: 'econ-micro-consumer', name: 'Consumer Behavior', subtitle: 'Why people buy what they buy', difficulty: 'intermediate', conceptMap: ['utility', 'marginal-utility', 'opportunity-cost', 'incentives', 'rational-choice', 'behavioral-econ'], starterMessages: ['What is opportunity cost?', 'Why do people make irrational choices?', 'What is utility?'] },
        ],
      },
      {
        id: 'macro',
        name: 'Macroeconomics',
        topics: [
          { id: 'econ-macro-gdp', name: 'GDP & Growth', subtitle: 'Measuring an economy', difficulty: 'beginner', conceptMap: ['gdp', 'gdp-per-capita', 'growth-rate', 'recession', 'economic-indicators', 'standard-of-living'], starterMessages: ['What is GDP?', 'How do we know if an economy is growing?', 'What is a recession?'] },
          { id: 'econ-macro-inflation', name: 'Inflation', subtitle: 'Why money loses value', difficulty: 'beginner', conceptMap: ['inflation-definition', 'cpi', 'causes', 'hyperinflation', 'deflation', 'interest-rates'], starterMessages: ['What causes inflation?', 'Why does everything keep getting more expensive?', 'What is the CPI?'] },
          { id: 'econ-macro-trade', name: 'Trade & Globalization', subtitle: 'Why countries trade', difficulty: 'intermediate', conceptMap: ['comparative-advantage', 'imports-exports', 'trade-balance', 'tariffs', 'globalization', 'trade-agreements'], starterMessages: ['Why do countries trade?', 'What is comparative advantage?', 'What are tariffs?'] },
        ],
      },
      {
        id: 'personal-finance',
        name: 'Personal Finance',
        topics: [
          { id: 'econ-pf-budgeting', name: 'Budgeting', subtitle: 'Managing your money', difficulty: 'beginner', conceptMap: ['income-expenses', 'needs-wants', 'budgeting-methods', 'emergency-fund', 'saving-goals', 'tracking'], starterMessages: ['How do I make a budget?', 'What is the 50/30/20 rule?', 'How much should I save?'] },
          { id: 'econ-pf-investing', name: 'Investing Basics', subtitle: 'Making money grow', difficulty: 'intermediate', conceptMap: ['stocks', 'bonds', 'diversification', 'compound-interest', 'risk-return', 'index-funds'], starterMessages: ['How does investing work?', 'What is compound interest?', 'What are index funds?'] },
          { id: 'econ-pf-credit', name: 'Credit & Debt', subtitle: 'Borrowing smartly', difficulty: 'beginner', conceptMap: ['credit-score', 'interest-rates', 'credit-cards', 'loans', 'debt-payoff', 'good-vs-bad-debt'], starterMessages: ['What is a credit score?', 'How do credit cards work?', 'How do I pay off debt?'] },
        ],
      },
    ],
  },
]

// ─── Flat Index (derived) ───
export const TOPICS_FLAT = []
const TOPIC_INDEX = {}

for (const subject of SUBJECTS) {
  for (const discipline of subject.disciplines) {
    for (const topic of discipline.topics) {
      const enriched = {
        ...topic,
        subjectId: subject.id,
        subjectName: subject.name,
        disciplineId: discipline.id,
        disciplineName: discipline.name,
        color: subject.color,
        iconId: subject.iconId,
        tutorName: SUBJECT_PERSONALITIES[subject.id]?.tutorName || 'Tutor',
        isComingSoon: false,
      }
      TOPICS_FLAT.push(enriched)
      TOPIC_INDEX[topic.id] = enriched
    }
  }
}

// ─── Lookup Functions ───
export function getTopicById(id) {
  return TOPIC_INDEX[id] || null
}

export function getSubjectById(id) {
  return SUBJECTS.find(s => s.id === id) || null
}

export function searchTopics(query) {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  return TOPICS_FLAT.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.subtitle.toLowerCase().includes(q) ||
    t.disciplineName.toLowerCase().includes(q) ||
    t.subjectName.toLowerCase().includes(q)
  ).slice(0, 12)
}

// ─── System Prompt Builder ───
export function buildSystemPrompt(topicId, learningStyleId) {
  const topic = getTopicById(topicId)
  if (!topic) return 'You are a helpful tutor.'

  const subject = getSubjectById(topic.subjectId)
  const personality = SUBJECT_PERSONALITIES[topic.subjectId]

  const style = getLearningStyleById(learningStyleId)
  const styleBlock = style ? style.prompt : ''

  return `You are ${personality?.tutorName || 'a tutor'}, a tutor in the Aible learning app.

## Your Topic: ${topic.name}
You are teaching ${topic.name} (${topic.subtitle}), which is part of ${topic.disciplineName} within ${topic.subjectName}.

## Your Personality
${personality?.personality || 'You are patient, clear, and encouraging.'}

## Your Concept Map
${(topic.conceptMap || []).join(', ')}

${styleBlock}

${BASE_INSTRUCTIONS}`
}

// Keep TOPICS as alias for backward compatibility in imports
export const TOPICS = TOPICS_FLAT
