# CVify

A free, client-side resume builder with a live preview, multiple design templates, and PDF export. No account, no backend — everything runs in your browser and saves to `localStorage`.

## Features

- **Live editor + preview** — Edit on the left, see changes instantly on the right
- **11 resume templates** — From ATS-friendly single-column layouts to multi-column designs (Designer, Sunrise, Sidebar Pro, Timeline, Bento, Editorial, and more)
- **Full resume sections** — Personal info, summary, skills (with drag-and-drop reorder), experience, education, projects, and certifications
- **Layout controls** — Font size, section spacing, and accent color (on supported templates)
- **PDF download** — Direct export via `modern-screenshot` + jsPDF (no print dialog)
- **JSON import/export** — Back up or restore your resume data as a portable file
- **Autosave** — Resume data persists in the browser automatically
- **Homepage** — Landing page with product overview at `/`

## Templates

| Template | Style |
| --- | --- |
| ATS Clean | Serif, centered — safe for applicant tracking systems |
| Modern | Sans-serif with accent color |
| Executive | Bold uppercase header with accent border |
| Elegant | Garamond, centered decorative rules |
| Tech | Monospace accents, bordered header |
| Designer | Two-column magazine layout with photo placeholder |
| Sunrise | Orange gradient header, skill bars |
| Sidebar Pro | Dark sidebar with pill section headers |
| Timeline | Vertical experience timeline with skill pills |
| Bento | Mosaic grid of content tiles |
| Editorial | Magazine masthead with three-column body |

Templates that support accent color show an **Accent** picker in the navbar.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Zustand](https://zustand.docs.pmnd.rs/) — state & persistence
- [React Router](https://reactrouter.com/) — `/` and `/builder`
- [Radix UI](https://www.radix-ui.com/) + [shadcn-style components](src/components/ui/) — buttons, inputs, selects, checkboxes
- [@dnd-kit](https://dnd-kit.com/) — skill category drag-and-drop
- [modern-screenshot](https://github.com/qq15725/modern-screenshot) + [jsPDF](https://github.com/parallax/jsPDF) — PDF export

## Getting started

**Requirements:** Node.js 20+

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Click **Start building** or go to `/builder`.

### Other scripts

```bash
npm run build    # Production build → dist/
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
- Nothing is sent to a server. Deploy as a static site anywhere (Netlify, Vercel, GitHub Pages, etc.).
- PDF generation captures the preview DOM client-side.

## Project structure

```
src/
├── pages/              HomePage, BuilderPage
├── components/
│   ├── Editor/         Form sections (personal info, experience, …)
│   ├── Preview/        Live preview panel
│   ├── templates/      Template components + registry
│   ├── home/           Landing page sections
│   └── ui/             shadcn-style UI primitives
├── store/              Zustand resume store
├── types/              Resume data model
└── utils/              Defaults, validation, PDF export, import/export
```

## Adding a template

1. Create `src/components/templates/YourTemplate.tsx`.
2. Add the template ID to `TemplateId` in `src/types/resume.ts`.
3. Register it in `src/components/templates/registry.ts`.
4. Use shared section helpers from `layoutShared.tsx` and `shared.tsx` so all fields render consistently.

## License

Private project — see repository owner for usage terms.
