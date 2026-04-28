import { Fragment, type ReactNode } from "react";

/**
 * Render an abstract string as React nodes:
 *   - Text inside straight ("...") or curly ("...") quotes is bolded.
 *   - Newlines are preserved (combine with `white-space: pre-wrap` in CSS).
 *
 * The surrounding quote characters are kept inside the bolded span so the
 * typography matches what the author typed.
 */
const QUOTED = /["“][^"”]+["”]/g;

export function formatAbstract(text: string | undefined | null): ReactNode {
  if (!text) return null;
  const out: ReactNode[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(QUOTED)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      out.push(
        <Fragment key={`t-${lastIndex}`}>
          {text.slice(lastIndex, start)}
        </Fragment>,
      );
    }
    out.push(<strong key={`q-${start}`}>{match[0]}</strong>);
    lastIndex = start + match[0].length;
  }
  if (lastIndex < text.length) {
    out.push(
      <Fragment key={`t-${lastIndex}`}>{text.slice(lastIndex)}</Fragment>,
    );
  }
  return out;
}
