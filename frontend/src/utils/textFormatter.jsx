/**
 * Utility to parse and format Markdown-style bold (**text**), italics (*text*),
 * bullet points (- / *), and clean headings into rich React JSX elements.
 */

export function formatCosmicText(text) {
  if (!text || typeof text !== 'string') return text;

  // Split on bold markers: **content**
  const boldTokens = text.split(/(\*\*.*?\*\*)/g);

  return boldTokens.map((bToken, bIdx) => {
    // Check if this token is a **bold** segment
    if (bToken.startsWith('**') && bToken.endsWith('**') && bToken.length >= 4) {
      const boldContent = bToken.slice(2, -2);
      return (
        <strong key={`b-${bIdx}`} className="cosmic-bold">
          {boldContent}
        </strong>
      );
    }

    // Within non-bold segments, check for *italic* segments
    const italicTokens = bToken.split(/(\*[^*\n]+?\*)/g);
    if (italicTokens.length > 1) {
      return italicTokens.map((iToken, iIdx) => {
        if (iToken.startsWith('*') && iToken.endsWith('*') && iToken.length >= 3) {
          return (
            <em key={`i-${bIdx}-${iIdx}`} className="cosmic-italic">
              {iToken.slice(1, -1)}
            </em>
          );
        }
        return iToken;
      });
    }

    return bToken;
  });
}

/**
 * Renders an array of paragraphs from raw multiline text,
 * handling bullet lists, markdown headers, and inline bold/italic.
 */
export function renderFormattedParagraphs(rawText, pClassName = 'open-reading-paragraph') {
  if (!rawText) return null;

  const rawParagraphs = rawText.split(/\n\s*\n/);

  return rawParagraphs.map((para, pIdx) => {
    let cleanPara = para.trim();
    if (!cleanPara) return null;

    // Check if it's a markdown heading like ### Heading or ## Heading
    if (/^#{1,4}\s+/.test(cleanPara)) {
      const headingText = cleanPara.replace(/^#{1,4}\s+/, '');
      return (
        <h4 key={pIdx} className="cosmic-subheading">
          {formatCosmicText(headingText)}
        </h4>
      );
    }

    // Check if it's a bullet list block (multiple lines starting with - or * or •)
    const lines = cleanPara.split('\n');
    const isBulletList = lines.length > 1 && lines.every((line) => /^\s*[-*•]\s+/.test(line));

    if (isBulletList) {
      return (
        <ul key={pIdx} className="cosmic-bullet-list">
          {lines.map((line, lIdx) => {
            const itemText = line.replace(/^\s*[-*•]\s+/, '');
            return (
              <li key={lIdx} className="cosmic-bullet-item">
                <span className="cosmic-bullet-glyph">✦</span>
                <span>{formatCosmicText(itemText)}</span>
              </li>
            );
          })}
        </ul>
      );
    }

    // Handle single bullet line
    if (/^\s*[-*•]\s+/.test(cleanPara)) {
      const itemText = cleanPara.replace(/^\s*[-*•]\s+/, '');
      return (
        <div key={pIdx} className="cosmic-bullet-item single-bullet">
          <span className="cosmic-bullet-glyph">✦</span>
          <span>{formatCosmicText(itemText)}</span>
        </div>
      );
    }

    // Standard paragraph with inline bold & italic parsing
    return (
      <p key={pIdx} className={pClassName}>
        {formatCosmicText(cleanPara)}
      </p>
    );
  });
}
