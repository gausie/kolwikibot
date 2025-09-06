import { bot } from "../bot";

let i = 0;
const MAX_PAGES = 5000; // safety stop

while (i < MAX_PAGES) {
  const start = Math.max(i * 100, 1);
  const end = i * 100 + 99;
  const title = `Effects by number (${start}-${end})`;

  // Read page text (returns null/undefined if missing)
  const page = await bot.read(title);
  const text = page.revisions?.[0].content;

  if (!text) {
    break;
  }

  // Match the first table block: <TABLE ...>
  let tableMatch = text.match(/<TABLE ALIGN=CENTER><TR><TD WIDTH=270>([\s\S]*?)<\/TD><\/TR><\/TABLE>/);
  if (!tableMatch) {
    tableMatch = text.match(/{\|([\s\S]*?)\|}/);
    if (!tableMatch) {
      console.log(`No table found on ${title}; skipping`);
      i++;
      continue;
    }
  }

  const tableContent = tableMatch[1];

  // Find entries like: "11800. [[...]]<br />"
  const entryRegex = /(\d+\.\s*(?:\[\[.*?\]\])?)(?:<br\s*\/?|)?/ig;
  const entries: string[] = [];
  for (const m of tableContent.matchAll(entryRegex)) {
    entries.push(m[1]);
  }

  // Build replacement block
  const lines = entries.map(e => `* ${e}`).join('\n');
  const bynumberBlock = `<div class="bynumber">\n${lines}\n</div>`;

  // Replace the entire matched table with the new block
  const startIdx = tableMatch.index!;
  const endIdx = startIdx + tableMatch[0].length;
  const newText = text.slice(0, startIdx) + bynumberBlock + text.slice(endIdx);

  if (newText === text) {
    console.log(`No changes needed for ${title}`);
    i++;
    continue;
  }

  // Save changes
  await bot.save(title, newText, 'Converted effect table to responsive bynumber format', {
    minor: true,
    bot: true,
  });

  console.log(`Saved: ${title}`);
  i++;
}

console.log('Done.');
