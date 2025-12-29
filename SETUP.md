# Setup Instructions

## Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## Step 2: Create Environment File

Create a file named `.env.local` in the root directory with:

```
GEMINI_API_KEY=your_api_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with the API key you copied.

## Step 3: Restart the Dev Server

After creating `.env.local`, restart your development server:

1. Stop the current server (Ctrl+C)
2. Run `npm run dev` again

## Troubleshooting

If you see "Failed to load test" error:
- Make sure `.env.local` exists in the root directory
- Make sure the API key is correct (no extra spaces)
- Restart the dev server after creating/updating `.env.local`
- Check the browser console for detailed error messages



