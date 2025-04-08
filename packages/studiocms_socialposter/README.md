# @StudioCMS/socialposter Plugin

Allow cross-posting to your social media accounts from your StudioCMS dashboard with ease!

## Requirements

Depending on which services you are trying to post on you may require one of more of the following variables in your `.env`

```bash
# Twitter/X
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret

# Bluesky
BLUESKY_SERVICE=https://bsky.social
BLUESKY_USERNAME=your_username
BLUESKY_PASSWORD=your_password

# Threads/Instagram
THREADS_USER_ID=your_user_id
THREADS_ACCESS_TOKEN=your_access_token
```

### Usage

Add this plugin in your StudioCMS config (`studiocms.config.mjs`) and enable the desired options.

```ts
import { defineStudioCMSConfig } from 'studiocms/config';
import socialPoster from '@studiocms/socialposter';

export default defineStudioCMSConfig({
  // other options here
  plugins: [
    socialPoster({
      bluesky: false,
      threads: false,
      twitter: false,
    })
  ],
});
```

## License

[MIT Licensed](./LICENSE).