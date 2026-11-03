# Cook with me

A mobile-first TikTok concept that turns a cooking video into a recipe you can actually follow at your own pace.

**[Open the prototype on Vercel →](https://brisk-banyan-bga0ame-qrhuang.vercel.app/)**

## The experience

| Viewer | Creator |
| --- | --- |
| Open **Cook with me** from a video | Select the cooking clip before posting |
| Review ingredients and adjust servings | Optionally generate a recipe draft |
| Follow five steps with a visual reference, replay controls, and a real timer | Edit ingredients and steps; supply the oven temperature the video leaves out |
| Finish cooking and optionally share a result linked to the original recipe | Publish with or without the recipe attached |

The same recipe data carries from the creator flow into the viewer flow. A post only shows **Cook with me** when its creator attaches a recipe.

## Prototype scope

- AI analysis, camera capture, and publishing are simulated.
- The supplied cooking assets are still images. Each step uses a matched image with interactive clip controls and an eight-second progress loop; the cooking countdown itself runs in real time.
- Designed for a phone viewport and presented in a 414 × 896 iPhone-sized frame on desktop.

## Built with

React 19 · TypeScript · Vite · Tailwind CSS 4

Run `pnpm build` to verify the production build.
