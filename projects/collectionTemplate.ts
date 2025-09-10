import { bot } from "../bot";
import { getTemplateUsers } from "../lib/getTemplateUsers";

const pages = await getTemplateUsers("Item");

for (const pageInfo of pages) {
  const page = await bot.read(pageInfo.title);
  const text = page.revisions?.[0].content;

  if (!text) {
    console.log(`No text for ${pageInfo.title}; skipping`);
    continue;
  }

  const newText = text.replace(/==Collection==\s+<collection>(\d+)<\/collection>/s, "{{Collection|$1}}");

  if (newText === text) {
    console.log(`No changes needed for ${pageInfo.title}`);
    continue;
  }

  await bot.save(pageInfo.title, newText, 'Converted collection tag to template', {
    minor: true,
    bot: true,
  });
  console.log(`Saved: ${pageInfo.title}`);
}

console.log('Done.');
