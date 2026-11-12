# Kazi Shakib Portfolio

My personal website covering my finance teaching, software projects, school history, articles, and chess.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** + **Tailwind CSS v4**
- **React Router v7** + **Lucide Icons**

## Development

```bash
npm install
npm run dev
```

## Update my portfolio from the admin panel

> **One-time setup:** Set `repo` (and `branch`, if not `main`) in `public/admin/config.yml` to your GitHub `owner/repo` before signing in.

1. **Create a GitHub fine-grained token:**
   - Open GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
   - Set **Expiration** to **90 days**.
   - Under **Repository access**, select **Only select repositories** and choose this portfolio repository.
   - Under **Permissions** → **Repository permissions**, set **Contents** to **Read and write** (leave everything else unset).
   - Click **Generate token** and copy the token (keep it private — never paste it into any repo file).
2. **Open the panel:** Visit `/admin` on your live site (for example `https://kazishakib.com/admin`) or locally with `npm run dev`.
3. **Sign in:** Click **Sign In Using Access Token**, paste your token into **Personal Access Token**, and click **Sign In**.
4. **Edit content or upload media:** Open a section under **Portfolio Content** (for example `1. Home — Hero`, `2. Home — Current Status`, or `5. Projects`), edit fields or click **Add**, **Remove**, or drag items to reorder. Upload WebP/JPG images under 300 KB directly in image fields (they save into `public/uploads/`).
5. **Save and publish:** Click **Save** at the top right. Sveltia CMS commits directly to your branch on GitHub (`publish_mode: simple`).
6. **Wait about a minute and check Vercel:** Vercel automatically builds and deploys the new commit. Reload your site after ~1 minute or open your Vercel project dashboard to confirm the deployment status is **Ready**.

### If something goes wrong

- **Build failed on Vercel:** Open the failed deployment in Vercel and read the build log error — content checks print the exact file and field name (for example `projects.json -> projects[0].logoUrl`). Re-open `/admin`, fix that field, and click **Save** again.
- **Want to undo a change quickly:** Open the repository on GitHub → **Commits**, open the commit created by Sveltia CMS, and click **Revert** (or fix the entry in `/admin` and click **Save**). Your live site stays on the last working deployment until a passing build finishes.

## Editing content locally (optional)

1. Edit JSON files in `src/content/` (`site.json`, `hero.json`, `currentStatus.json`, `about.json`, `academics.json`, `projects.json`, `publications.json`, `experience.json`, `awards.json`, `legal.json`) and place any new images in `public/uploads/` (referenced as `"/uploads/<file>"`).
2. Run validation and production build (`VITE_SITE_URL` must be set and not contain `"TODO"`):

```bash
npm run prebuild
VITE_SITE_URL=https://kazishakib.com npm run build
```

3. Commit and push to GitHub.

## Manual Build & Deploy

Copy `.env.example` to `.env` and set `VITE_SITE_URL` to your production domain (e.g. `https://kazishakib.com`). `npm run build` fails if `VITE_SITE_URL` is unset or contains `"TODO"`.

```bash
VITE_SITE_URL=https://kazishakib.com npm run build
npm run preview
```

To deploy manually with the Vercel CLI:

```bash
npx vercel --prod
```
