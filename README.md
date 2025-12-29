# Jobbr AI

An AI-powered interview simulation platform that provides interview-grade feedback to help engineering students prepare for technical interviews.

## Features

- **Three Interview Rounds:**
  - Written Test (Timed): Aptitude, DSA, and CS fundamentals
  - Technical Interview: AI-led mock interview with adaptive questions
  - HR/Behavioral Interview: STAR-based behavioral evaluation

- **Comprehensive Feedback:**
  - Section-wise scoring
  - Detailed explanations of mistakes
  - Weakness heatmap
  - Resume vs Job Description gap analysis
  - Personalized 7-14 day improvement roadmap

- **No Login Required:** Instant access with temporary session storage

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **AI:** Google AI Studio (Gemini 1.5 Flash)
- **Storage:** Browser localStorage (temporary)
- **Deployment:** Vercel

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

   Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

## Usage

1. Upload your resume (PDF or DOC)
2. Enter job description or role
3. Select experience level
4. Complete the three interview rounds in any order
5. View detailed feedback after each round
6. Access the final comprehensive dashboard

## Privacy

- Resume and session data are stored temporarily in browser localStorage
- Data is automatically cleared after feedback is generated
- No data is sent to external servers except for AI processing

## Deployment

Deploy to Vercel:

```bash
vercel
```

Make sure to add your `GEMINI_API_KEY` to Vercel environment variables.

## License

MIT
