# Deploying Voltage Magazine

## Recommended Strategy: Prebuilt Deployment
Since we are using Expo Web, it is more reliable to build locally and just upload the static files to Vercel.

### 1. Build for Web
Run this command in the `voltage` directory (User terminal):
```bash
npx expo export --platform web
```
*This creates a `dist` folder with your static website.*

### 2. Deploy to Vercel
Push the prebuilt files. If asked, set the output directory to `dist`.
```bash
npx vercel deploy --prebuilt --prod
```

---

## Troubleshooting "tar" warnings
If you see `npm warn deprecated tar...`, this is a warning from the package manager about an old dependency. **It is safe to ignore.** It does not stop the deployment.

If `npx` fails to run, you can try installing the Vercel CLI globally first:
```bash
npm install -g vercel
vercel deploy --prebuilt --prod
```
