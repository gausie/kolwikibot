import { bot } from "../bot"

type PageInfo = { pageid: number, ns: number, title: string };

export async function getTemplateUsers(template: string) {
  const results: PageInfo[] = [];
  let cont = {};
  do {
    const res = await bot.request({
      action: 'query',
      list: 'embeddedin',
      eititle: `Template:${template}`,
      eilimit: 'max',
      eifilterredir: 'nonredirects',
      format: 'json',
      ...cont,
    });
    const items: PageInfo[] = res?.query?.embeddedin || [];
    results.push(...items);
    cont = res?.continue || null;
  } while (cont);

  return results;
}
