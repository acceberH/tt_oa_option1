# tt_oa_option1
This is the online assessment for TikTok AI Product Designer NG

## Follow Along prototype

Live demo: https://tiktok-follow-along-cooking.acceber02.chatgpt.site

The current implementation uses the supplied `TikTok Follow Along 2` Figma Make reference as its visual baseline. The review surface is a fixed 414 × 896 iPhone frame on desktop and fills the viewport on mobile:

- Viewer flow: video → Cook with me → recipe overview → servings adjustment → steps 1–5 → completion.
- Cooking flow: Ingredients is a dismissible bottom sheet; step 4 includes a real 8-minute countdown with start, pause, resume, reset and restart.
- Result flow: choose a sample photo/video → preview → caption and settings → simulated linked post.
- Creator flow: optional Add recipe → simulated AI generation → review/edit → missing-temperature input → attach recipe → publish. Posts without a recipe show the regular video without Cook with me.
- The floating step window uses looping, step-matched still images with pause and replay controls; actual video footage is not included in this prototype.
- TikTok assets, typography, status bar, navigation, sheet surfaces, and posting settings are reused from the supplied reference folder.
- AI generation and publishing remain simulated; the creator editor still requires the missing oven temperature before attaching the guide.
