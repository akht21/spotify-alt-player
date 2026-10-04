# Spotify / alt player

An alternative Spotify player: familiar features with a different design.

![Preview](/public/images/main_preview.png)

![Preview](/public/images/playlist_preview.png)

## What it is

Spotify Alt Player is a web client for Spotify that implements some of the service's features, reimagined with a different design.

It's a **pet project** — not affiliated with Spotify, not commercial, built for
learning and portfolio purposes.

## Features

- Secure Spotify login (OAuth 2.0 + PKCE)
- Real-time playback and queue controls
- Browse playlists and saved tracks
- Full-screen / Focus playback mode
- Customizable UI themes

## Demo

To try the app, open the link below and make sure Spotify is running on your device — playback happens through your active Spotify client.

**Link:** https://akht21.github.io/spotify-alt-player/

> ⚠️ The app is currently in Spotify **Development Mode**, so only users added to the allowlist can authenticate. If you'd like access, reach out or run it locally with your own Spotify credentials.

## Running Locally

1. **Clone the repo and create a `.env` file** in the project root with your Spotify credentials. See `.env.example` for reference.
2. **Install dependencies and start the dev server:**

   ```bash
   npm install
   npm run dev
   ```
