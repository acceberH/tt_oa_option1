# TikTok Cook with me prototype

Current local preview: http://127.0.0.1:8443/

The active React UI is in `src/App.tsx` and `src/index.css`. It uses the pages and assets from the supplied `Desktop/tt folow` folder. `index.html` is the Vite entrypoint; the older root-level `app.js` and `styles.css` are not loaded.

Run `pnpm build` to verify the project. The prototype is sized to 414 × 896 on desktop and fills a phone viewport. Scrollbars are hidden while touch scrolling remains available.

## Prototype flows

- Viewer: video → recipe → ingredients → five cooking steps → completion.
- Cooking: adjustable servings, step-matched visual previews with synchronized progress, pause, replay and scrubbing, ingredient checks, step navigation, and a real eight-minute timer with pause, resume, reset, and restart.
- Result: choose the example camera or album path → caption/settings → simulated linked post.
- Creator: tap Create → select the example clip → optionally add an AI-drafted recipe → review/edit ingredients and steps, supply the missing oven temperature → attach or omit the recipe → simulate publishing into the video feed. Only posts with a recipe show Cook with me.

AI analysis, camera capture, video footage, and publishing are simulated. The supplied folder contains still images for the five cooking steps rather than playable clip files. The progress bar and controls behave like a looping eight-second clip; replacing the stills with real footage requires step-matched video files. The creator flow follows the Figma workflow screens.
