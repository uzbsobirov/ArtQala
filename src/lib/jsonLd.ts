// JSON.stringify does not escape "<", so a value containing "</script>"
// (e.g. a user-submitted review's text) can break out of the <script
// type="application/ld+json"> tag it's embedded in and inject arbitrary
// HTML/script. Escaping "<" as its unicode sequence neutralizes that while
// staying valid JSON (the parser reads < back as "<").
export function safeJsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
