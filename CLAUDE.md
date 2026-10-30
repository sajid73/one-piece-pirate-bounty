# CLAUDE.md — Pirate Bounty

## Project Overview
Build **Pirate Bounty**, a premium 3D interactive website where users upload a photograph, enter their name, customize a vintage anime-pirate bounty poster, and download it.

Visual inspiration: One Piece-style vintage bounty posters. Create an original design inspired by aged parchment, distressed ink, pirate aesthetics, and bold typography. Do not reproduce copyrighted logos, official artwork, or character designs.

Tagline: Your face. Your legend. Your bounty.

## Core Requirements

- Premium, cinematic UI/UX.
- Interactive 3D landing page.
- Fully functional poster customization studio.
- Real-time poster preview.
- High-resolution PNG export.
- Responsive desktop and mobile experience.
- Extensive typography, paper, color, and texture customization.

## Architecture: STRICT CLIENT-SIDE ONLY

This is a frontend-only application.

**Absolutely prohibited:**
- Backend services.
- Databases.
- Authentication.
- API routes or route handlers.
- Server actions.
- External image uploads.
- Cloud storage.
- External image-processing APIs.
- Paid APIs or API keys.
- Unnecessary network requests.

All application functionality must run locally in the user's browser.

Use:
- React state for editor functionality.
- Browser Canvas API / Konva for poster rendering.
- Browser APIs for image processing.
- localStorage for saving configurations.
- Blob and Canvas APIs for exporting images.
- IndexedDB only if local persistence of larger assets becomes necessary.

Uploaded photographs must remain on the user's device. Never transmit them externally.

Next.js may be used for development and build tooling, but application functionality must remain client-side. Prefer static export compatibility.

## Technology Stack

Use compatible versions of:

- Next.js (existing installation)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Three.js
- @react-three/fiber
- @react-three/drei
- Framer Motion
- GSAP (only when needed)
- Konva / react-konva
- Lucide React

Do not install unnecessary dependencies. Inspect existing packages first.

## Design Direction

Aesthetic:
- Luxury vintage pirate aesthetic.
- Dark espresso and charcoal backgrounds.
- Antique parchment and aged ivory.
- Muted gold and copper accents.
- Distressed typography and realistic paper textures.
- Cinematic lighting and shadows.
- Refined spacing and visual hierarchy.

Avoid:
- Generic SaaS layouts.
- Generic AI gradients.
- Excessive glassmorphism.
- Unnecessary glowing effects.
- Cluttered interfaces.
- Decorative interactions without purpose.

## Application Structure

Separate the application into:

1. Landing page.
2. 3D presentation components.
3. Poster editor.
4. Poster rendering engine.
5. Image processing utilities.
6. Typography and paper presets.
7. Export functionality.
8. Local configuration persistence.

Keep 3D presentation separate from 2D poster composition.

The 3D scene must never be responsible for generating the downloadable poster.

## Poster Editor Requirements

Users must be able to:

- Upload, replace, crop, zoom, rotate, and position photographs.
- Enter character name, alias, bounty, and custom text.
- Select fonts, sizes, weights, spacing, and colors.
- Select paper types, colors, and textures.
- Adjust texture intensity.
- Customize borders, ornaments, and layout.
- Toggle optional decorative elements.
- Undo and redo changes.
- Reset and randomize designs.
- Save and restore designs locally.

All controls must work and update the preview immediately.

## Rendering and Export

Use one shared poster configuration as the source of truth.

Preview and export must use the same composition logic.

Support:
- PNG export.
- High-resolution rendering.
- 2x and 4x scaling.
- A4 portrait.
- Standard poster dimensions.

Ensure fonts and images are fully loaded before exporting.

Never export a screenshot of the 3D scene.

## Performance

- Lazy-load heavy 3D components.
- Optimize textures and image sizes.
- Avoid unnecessary re-renders.
- Clean up object URLs and event listeners.
- Respect prefers-reduced-motion.
- Provide a fallback when WebGL is unavailable.
- Keep the poster editor functional without WebGL.

## Development Rules

1. Inspect existing code before modifying it.
2. Reuse existing dependencies and configurations.
3. Use reusable, typed components.
4. Avoid giant components.
5. Keep rendering logic separate from UI.
6. Never leave fake buttons or placeholder interactions.
7. Do not break existing functionality.
8. Run TypeScript and lint checks after implementation.
9. Fix errors before marking tasks complete.
10. Update plan.md as implementation progresses.

## Claude Plugin Usage

Use available plugins where relevant:

- UI UX Pro Max: design system and visual quality.
- Engineering: architecture and code quality.
- Agent Skills: discover relevant frontend and 3D skills.
- Desktop Commander: project file operations.
- Ponytail: inspect capabilities and use only if relevant.

Do not repeatedly invoke tools or plugins when they add no value.

## Definition of Done

The project is complete only when:
- Landing page is implemented.
- 3D interactions work.
- Photo upload and editing work.
- All customization controls work.
- Preview updates correctly.
- Local save and restore work.
- Undo and redo work.
- PNG export works at high resolution.
- Mobile layout works.
- No backend or database exists.
- No critical TypeScript, build, or runtime errors remain.