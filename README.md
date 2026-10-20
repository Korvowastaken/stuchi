# stuchi

View your Telegram chat exports in a chat-style UI. Sign in with Google, upload a single-chat `result.json` export (Telegram Desktop → Export chat history → JSON), and browse it.

## Setup

1. Create a `.env` file:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
2. `pnpm install`
3. `pnpm dev`

Uploads are stored in the Supabase table `user_uploads` (`id`, `user_id`, `filename`, `json_data`, `created_at`). Enable row-level security on it so users can only access their own rows.
