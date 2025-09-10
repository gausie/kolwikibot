// {{Data:{{PAGENAME}}|format=INFOBOX_Location}} -> {{Location}}
import { bot } from '../bot.js';

const pages = await bot.getPagesInCategory("Locations");

for (const title of pages) {
  const page = await bot.read(title);
  const text = page.revisions?.[0].content;

  if (!text) {
    console.log(`No text for ${title}; skipping`);
    continue;
  }
  
  const newText = text.replace(/\{\{Data:{{PAGENAME}}\|format=INFOBOX_Location\}\}/, "{{Location}}");
  if (newText === text) {
    console.log(`No changes needed for ${title}`);
    continue;
  }

  await bot.save(title, newText, 'Replaced Data infobox with Location template', {
    minor: true,
    bot: true,
  });
  console.log(`Saved: ${title}`);
}

console.log('Done.');
