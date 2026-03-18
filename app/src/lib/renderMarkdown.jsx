// Markdown renderer for chat bubbles
// Supports: **bold**, *italic*, `inline code`, ```code blocks```,
// > blockquotes, - bullet lists, 1. numbered lists, --- dividers, headings

export default function RenderMarkdown({ text }) {
  if (!text) return null
  const blocks = parseBlocks(text)
  return <>{blocks.map((block, i) => renderBlock(block, i))}</>
}

function parseBlocks(text) {
  const lines = text.split('\n')
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code block
    if (line.trimStart().startsWith('```')) {
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing ```
      blocks.push({ type: 'code', content: codeLines.join('\n') })
      continue
    }

    // Divider
    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: 'divider' })
      i++
      continue
    }

    // Heading
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/)
    if (headingMatch) {
      blocks.push({ type: 'heading', level: headingMatch[1].length, content: headingMatch[2] })
      i++
      continue
    }

    // Blockquote
    if (line.trimStart().startsWith('> ')) {
      const quoteLines = []
      while (i < lines.length && lines[i].trimStart().startsWith('> ')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      blocks.push({ type: 'quote', content: quoteLines.join('\n') })
      continue
    }

    // Bullet list
    if (/^\s*[-*]\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''))
        i++
      }
      blocks.push({ type: 'bullet', items })
      continue
    }

    // Numbered list
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ''))
        i++
      }
      blocks.push({ type: 'numbered', items })
      continue
    }

    // Empty line
    if (line.trim() === '') {
      i++
      continue
    }

    // Paragraph — collect consecutive non-special lines
    const paraLines = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trimStart().startsWith('```') &&
      !lines[i].trimStart().startsWith('> ') &&
      !lines[i].match(/^#{1,3}\s+/) &&
      !lines[i].match(/^\s*[-*]\s+/) &&
      !lines[i].match(/^\s*\d+[.)]\s+/) &&
      !lines[i].match(/^---+$/)
    ) {
      paraLines.push(lines[i])
      i++
    }
    blocks.push({ type: 'paragraph', content: paraLines.join('\n') })
  }

  return blocks
}

function renderBlock(block, key) {
  switch (block.type) {
    case 'paragraph':
      return <p key={key} className="mt-2 first:mt-0">{renderInline(block.content)}</p>

    case 'heading':
      if (block.level === 1) return <p key={key} className="mt-3 first:mt-0 text-base font-bold">{renderInline(block.content)}</p>
      if (block.level === 2) return <p key={key} className="mt-3 first:mt-0 text-[15px] font-semibold">{renderInline(block.content)}</p>
      return <p key={key} className="mt-2 first:mt-0 text-[14px] font-semibold">{renderInline(block.content)}</p>

    case 'code':
      return (
        <pre key={key} className="mt-2 bg-surface-alt rounded-lg px-3 py-2 overflow-x-auto">
          <code className="text-[13px] font-mono text-ink-secondary">{block.content}</code>
        </pre>
      )

    case 'quote':
      return (
        <blockquote key={key} className="mt-2 border-l-3 border-primary/40 pl-3 text-ink-secondary italic">
          {renderInline(block.content)}
        </blockquote>
      )

    case 'bullet':
      return (
        <ul key={key} className="mt-2 space-y-1 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-primary mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-current" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )

    case 'numbered':
      return (
        <ol key={key} className="mt-2 space-y-1 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-ink-secondary font-medium shrink-0 w-5 text-right">{i + 1}.</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      )

    case 'divider':
      return <hr key={key} className="mt-3 border-line" />

    default:
      return null
  }
}

function renderInline(text) {
  // Split on markdown tokens while preserving them
  const tokens = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\n)/g)

  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={i} className="font-semibold">{token.slice(2, -2)}</strong>
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      return <em key={i}>{token.slice(1, -1)}</em>
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code key={i} className="bg-surface-alt px-1 py-0.5 rounded text-[13px] font-mono">
          {token.slice(1, -1)}
        </code>
      )
    }
    if (token === '\n') {
      return <br key={i} />
    }
    return token
  })
}
