import React from 'react';

/**
 * Safely parses plain text containing external URLs (http://, https://, www.)
 * and renders them as clickable React <a> elements without using dangerouslySetInnerHTML.
 */
export function formatTextWithLinks(text: string | null | undefined): React.ReactNode {
  if (!text) return null;

  // Regex to detect http://, https://, or www. links
  const urlRegex = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = urlRegex.exec(text)) !== null) {
    const rawUrl = match[0];
    const matchIndex = match.index;

    // Push preceding text before the URL
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    // Separate trailing punctuation attached to sentence ends
    let cleanUrl = rawUrl;
    let trailingPunct = '';

    while (cleanUrl.length > 0 && /[.,!?:;)"'\]\}«»،؛؟]+$/.test(cleanUrl)) {
      // If trailing char is ')', only trim if there is no matching opening '('
      if (cleanUrl.endsWith(')')) {
        const openParens = (cleanUrl.match(/\(/g) || []).length;
        const closeParens = (cleanUrl.match(/\)/g) || []).length;
        if (openParens >= closeParens) {
          break;
        }
      }
      // If trailing char is ']', only trim if there is no matching opening '['
      if (cleanUrl.endsWith(']')) {
        const openBracket = (cleanUrl.match(/\[/g) || []).length;
        const closeBracket = (cleanUrl.match(/\]/g) || []).length;
        if (openBracket >= closeBracket) {
          break;
        }
      }
      trailingPunct = cleanUrl.slice(-1) + trailingPunct;
      cleanUrl = cleanUrl.slice(0, -1);
    }

    if (cleanUrl.length > 0) {
      const href = cleanUrl.toLowerCase().startsWith('www.')
        ? `https://${cleanUrl}`
        : cleanUrl;

      parts.push(
        <a
          key={`link-${matchIndex}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="post-link"
          dir="ltr"
        >
          {cleanUrl}
        </a>
      );
    }

    if (trailingPunct) {
      parts.push(trailingPunct);
    }

    lastIndex = matchIndex + rawUrl.length;
  }

  // Push remaining text after the last match
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
