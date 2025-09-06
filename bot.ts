import { Mwn } from 'mwn';

export const bot = await Mwn.init({
    apiUrl: 'https://wiki.kingdomofloathing.com/api.php',

    // Can be skipped if the bot doesn't need to sign in
    username: process.env.USERNAME!,
    password: process.env.PASSWORD!,
    userAgent: 'kolwikibot/1.0 (contact: gausie)',
    // Set default parameters to be sent to be included in every API request
    defaultParams: {
        assert: 'user' // ensure we're logged in
    }
});
