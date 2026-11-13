# Portfolio (React + Node.js)

React (Vite) on the front, a small Express server on the back.

```
client/
  index.html                 page shell, fonts
  public/images/me.jpg       your photo (portrait, about 1000 x 1250 px)
  public/images/projects/    project screenshots (1600 x 1000 px)
  public/resume.pdf          your résumé
  src/App.jsx                loads the content and puts the sections together
  src/components/            Header, Hero, Work, BrowserWindow, Mocks, Skills,
                             Experience, Writing, Contact, Footer
  src/styles.css             all styles (colours and fonts at the top)
server/
  index.js                   Express server: content API, contact form, serves the built site
  data/portfolio.json        ALL the text on the site: profile, projects, skills, experience...
  data/messages.json         contact form messages (created on the first message)
_static-version/             the older plain HTML version, kept for reference
```

## Run it

```bash
npm install        # once
npm run dev        # development: open http://localhost:5173
```

`npm run dev` starts both the Node server (port 5050) and the React dev server (port 5173), which
reloads as you edit.

For production:

```bash
npm run build      # builds the React app into dist/
npm start          # serves everything from http://localhost:5050
```

## Admin panel

Open **/admin** (for example http://localhost:5173/admin in development) and log in.

- Log in with `ADMIN_USERNAME` (default `admin`) and `ADMIN_PASSWORD` from the `.env` file. Change them to anything you like and restart the server.
- Manage your profile, photo, résumé, links, projects (with screenshot uploads, order and the featured
  project), skills, experience, writing, the Now list, and read messages from the contact form.
- Nothing goes live until you press **Save changes**. Each save keeps the previous version in
  `server/data/portfolio.backup.json`.
- Uploaded files are stored in `uploads/` (JPG, PNG, WebP or PDF, up to 8 MB). The server checks the real
  file type, not just the name.
- Login lasts 12 hours. After 10 wrong passwords in 15 minutes, logins pause for that visitor.

If `ADMIN_PASSWORD` is empty, the admin panel is turned off.

## Change the content by hand

You can also edit `server/data/portfolio.json` directly and refresh the page.

- **Your photo:** save it as `client/public/images/me.jpg`. Until it exists, the hero shows your featured project.
- **A project:** add a block to `"projects"`. Put its screenshot in `client/public/images/projects/`
  and point `"image"` at it, like `"/images/projects/my-app.jpg"`. Delete the `"mock"` line for real projects.
- **One project large at the top:** `"featured": true`.
- **Your résumé:** save it as `client/public/resume.pdf`.

## Contact form

Messages are checked on the server and saved to `server/data/messages.json`. A hidden field catches
most bots, and each visitor can send at most 5 messages per 10 minutes.

## Hosting

The site needs Node because of the contact form. Render, Railway or a small VPS all work:

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Set `ADMIN_USERNAME`, `ADMIN_PASSWORD` and `ADMIN_SECRET` in the host's environment settings (the `.env` file is not uploaded).
- The port comes from the `PORT` environment variable if the host sets one.
- Use HTTPS (most hosts do this for you) so the admin password is never sent in plain text.

The admin saves content, uploads and messages as files on the server. On hosts with a temporary disk
(Render's free plan, for example) those are wiped on each deploy, so pick a host with a persistent disk
(Railway volume, Render disk, or a VPS), or back up `server/data/` and `uploads/` before redeploying.
