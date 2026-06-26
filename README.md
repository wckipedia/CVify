# CVify

A free resume builder with a live preview, multiple design templates, and PDF export. No account required — editing runs in your browser and saves to `localStorage`, while PDF export can use an optional local Python renderer for higher-fidelity downloads.

## Features

- **Live editor + preview** — Edit on the left, see changes instantly on the right
- **14 resume templates** — From ATS-friendly single-column layouts to multi-column designs (Designer, Sunrise, Sidebar Pro, Timeline, Bento, Editorial, Chronicle, Split Rail, Hybrid Focus, and more)
- **Full resume sections** — Personal info, summary, skills (with drag-and-drop reorder), experience, education, projects, and certifications
- **Layout controls** — Font size, section spacing, and accent color (on supported templates)
- **PDF download** — Python + Playwright rendering for higher-fidelity PDFs, with browser export fallback
- **JSON import/export** — Back up or restore your resume data as a portable file
- **Autosave** — Resume data persists in the browser automatically
- **Homepage** — Landing page with product overview at `/`

## Templates

| Template     | Style                                                           |
| ------------ | --------------------------------------------------------------- |
| ATS Clean    | Serif, centered — safe for applicant tracking systems           |
| Modern       | Sans-serif with accent color                                    |
| Executive    | Bold uppercase header with accent border                        |
| Elegant      | Garamond, centered decorative rules                             |
| Tech         | Monospace accents, bordered header                              |
| Designer     | Two-column magazine layout with photo placeholder               |
| Sunrise      | Orange gradient header, skill bars                              |
| Sidebar Pro  | Dark sidebar with pill section headers                          |
| Timeline     | Vertical experience timeline with skill pills                   |
| Bento        | Mosaic grid of content tiles                                    |
| Editorial    | Magazine masthead with three-column body                        |
| Chronicle    | Clean chronological serif layout for ATS-friendly applications  |
| Split Rail   | Modern sidebar layout with contact and skills in a colored rail |
| Hybrid Focus | Skills-first hybrid format with chronological work history      |

Templates that support accent color show an **Accent** picker in the navbar.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Zustand](https://zustand.docs.pmnd.rs/) — state & persistence
- [React Router](https://reactrouter.com/) — `/`, `/builder`, and `/print`
- [Radix UI](https://www.radix-ui.com/) + [shadcn-style components](src/components/ui/) — buttons, inputs, selects, checkboxes
- [@dnd-kit](https://dnd-kit.com/) — skill category drag-and-drop
- [Playwright for Python](https://playwright.dev/python/) — high-fidelity PDF rendering
- [modern-screenshot](https://github.com/qq15725/modern-screenshot) + [jsPDF](https://github.com/parallax/jsPDF) — browser PDF fallback

## Getting started

**Requirements:** Node.js 20+, Python 3.10+

```bash
npm install
python3 -m pip install -r requirements.txt
python3 -m playwright install chromium
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Click **Start building** or go to `/builder`.

### PDF export server

For the best PDF output, run the local Python renderer in a second terminal:

```bash
npm run pdf-server
```

The web app posts the current resume data to `/api/export-pdf`, which Vite proxies to the Python server at `http://127.0.0.1:8765`. The server opens the `/print` route in headless Chromium and returns a letter-size PDF. If the Python server is not running, the app falls back to the older browser-side `modern-screenshot` + jsPDF export.

### Other scripts

```bash
npm run build    # Production build → dist/
npm run pdf-server # Start local Python PDF renderer
npm run preview  # Preview production build locally
npm run lint     # ESLint
npm run format   # Prettier (src/**/*.{ts,tsx,css})
```

## Usage

1. Fill in your details in the editor panel.
2. Pick a **Template**, **Size**, and **Spacing** from the navbar.
3. Toggle section visibility (Summary, Projects, Certifications) where available.
4. **Download PDF** when ready, or **Export JSON** for a backup.
5. Use **Import JSON** to restore data, or **Reset** to start over.

Skill categories can be reordered by dragging the handle on the left of each card.

## Data & privacy

- All resume content stays in your browser (`localStorage` key: `cvify-resume-data`).
- When `npm run pdf-server` is running, PDF export sends the current resume JSON to your local Python server only.
- Without the Python server, PDF generation falls back to client-side browser capture.
- Static deployment still works for editing and browser-fallback export. High-fidelity Python export requires a server environment that can run Playwright.

## Project structure

```
src/
├── pages/              HomePage, BuilderPage, PrintPage
├── components/
│   ├── Editor/         Form sections (personal info, experience, …)
│   ├── Preview/        Live preview panel
│   ├── templates/      Template components, renderer, registry
│   ├── home/           Landing page sections
│   └── ui/             shadcn-style UI primitives
├── store/              Zustand resume store
├── types/              Resume data model
└── utils/              Defaults, validation, PDF export, import/export
```

```
scripts/
└── pdf_server.py       Local Playwright PDF export server
```

## Adding a template

1. Create `src/components/templates/YourTemplate.tsx`.
2. Add the template ID to `TemplateId` in `src/types/resume.ts`.
3. Register it in `src/components/templates/registry.ts`.
4. Use shared section helpers from `layoutShared.tsx` and `shared.tsx` so all fields render consistently.

## License

Private project — see repository owner for usage terms.
