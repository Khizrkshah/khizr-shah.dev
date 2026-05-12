# AUDIT-claude.md — khizr-shah.dev Code Audit

**Date:** 2026-05-12  
**Auditor:** Claude Sonnet 4.6  
**Standards Reference:** Project CONVENTIONS.md  

---

## Project Overview

**Grade: B**

A personal portfolio SPA built with React 18 and Vite. The site features a Three.js 3D interactive sphere with audio visualization, a GitHub project gallery, an animated sidebar, and a contact form backed by an external Cloudflare Worker.

| Property | Value |
|---|---|
| Framework | React 18.2 + Vite 4.4 |
| 3D / Graphics | Three.js 0.168 (raw, not @react-three/fiber) |
| Animation | Framer Motion 10 + @tweenjs/tween.js 25 |
| Styling | SCSS (Sass 1.68) |
| Language | Plain JavaScript (JSX) — no TypeScript |
| Backend | None — Cloudflare Worker at external domain |
| Components | 13 JSX files, ~1,100 lines |
| SCSS files | 7 files, ~590 lines |
| Test files | **0** |

**Strengths:** Clean folder structure (`components/<feature>/`), appropriate use of Framer Motion, no prop drilling, mobile guard on Three.js renderer.  
**Weaknesses:** No TypeScript, no tests, no JSDoc, no error boundaries, significant Three.js memory leaks.

---

## 1. Code Quality

**Grade: D**

### 1.1 No JSDoc / Docstrings — FAIL
Every file fails this standard. No exported function has a JSDoc block. Examples:

- `ThreejsComponent.jsx` — no doc for the component or any helper
- `Starfield.jsx` — `getStarfield()` undocumented
- `ContactMe.jsx` — `sendEmail()`, `handleChange()` undocumented
- `Projects.jsx` — `handleMouseDown()`, `handleMouseMove()`, `handleMouseUp()` undocumented

**Standard:** "Add JSDoc/docstring to every function explaining purpose, params, and return value."

---

### 1.2 No TypeScript — FAIL
The entire codebase is plain JSX. `@types/react` and `@types/react-dom` are installed as devDependencies but are unused (no `.ts`/`.tsx` files). Runtime type errors are undetected at build time.

**Standard:** "Use TypeScript where possible."

---

### 1.3 Mixed Variable Declaration Style — FAIL
`ThreejsComponent.jsx` uses `var`, `const`, and `let` inconsistently:

- Line 10: `var animate` — should be `const`
- Line 12: `var canvas` — should be `const`
- Line 15: `var scene` — should be `const`
- Lines 69, 70, 72, 92, 105, 120, 235: `const` used correctly
- `var` continues to appear through the function setup block

**Standard:** Modern JS projects use `const` by default, `let` when reassignment is needed. `var` should not appear.

---

### 1.4 Function Name Typo — FAIL
`Links.jsx:29` declares `function handleCLick(setOpen, name)` — the capital `L` in `CLick` is a typo. The same misspelling is referenced at line 57: `onClick={() => handleCLick(setOpen, item)}`.

---

### 1.5 Loose Equality Operator — FAIL
`ThreejsComponent.jsx:278`:
```js
if (intersections[0].object.type == "Mesh") {
```
Should use `===`. Using `==` triggers type coercion and is a consistent standards violation.

---

### 1.6 Single Responsibility Violation — FAIL
`ThreejsComponent.jsx` is ~390 lines and packs all of the following into one `useEffect`:

- WebGL renderer setup
- Camera and scene construction
- Custom GLSL shader definition
- Post-processing (EffectComposer + UnrealBloomPass)
- OrbitControls setup
- Audio system (AudioListener, AudioLoader, AudioAnalyser)
- Raycaster and mouse-click detection
- Tween animations
- Starfield generation
- Resize event handler
- Focus/blur event handlers
- Animation loop

**Standard:** "Follow single responsibility principle" and "Keep functions under 50 lines."

---

### 1.7 Dead Code — FAIL

**Unused Framer Motion variants — `Sidebar.jsx:1–25`:**
```js
const variants = {
  open: { clipPath: "...", transition: { ... } },
  closed: { clipPath: "...", transition: { ... } },
};
```
These variants reference `x` / `y` wobble sub-animations that exist but are never passed to any `motion.*` element in the component's JSX.

**Unused `dat.gui` dependency — `package.json`:**
`dat.gui` is listed as a production dependency but is not imported in any source file. It adds bundle weight for nothing.

**Unused `formRef` — `ContactMe.jsx:6`:**
`const formRef = useRef()` is created and attached to `<motion.form ref={formRef}>` but `formRef` is never read anywhere in the component. The form uses controlled state (`formData`), so the ref is superfluous.

---

### 1.8 `document.getElementById` Instead of React Ref — FAIL
`ThreejsComponent.jsx:150`:
```js
const canvas = document.getElementById("canvasRef");
```
The component already renders `<canvas id="canvasRef" />`. The correct pattern is to create a ref (`const canvasRef = useRef()`) and attach it (`<canvas ref={canvasRef} />`), then read `canvasRef.current`. Direct DOM queries bypass React's virtual DOM and break under Strict Mode double-invocation.

---

### 1.9 Invalid CSS Property — FAIL
`App.scss:30`:
```scss
a:hover { size: 40px; }
```
`size` is not a valid CSS property. This rule does nothing. The likely intent was `font-size`.

---

### 1.10 Positives
- No unused imports detected across any component file.
- Import ordering is consistent (external → internal → styles).
- Component file naming matches the exported component name.

---

## 2. Security

**Grade: D**

### 2.1 Hardcoded API Endpoints in Client Bundle — FAIL
Two API URLs are embedded directly in source files and will appear in the compiled JS bundle:

- `ContactMe.jsx:28`: `"https://portfolio-site.khizrkshah-a83.workers.dev/send-email"`
- `Projects.jsx:21`: `"https://portfolio-site.khizrkshah-a83.workers.dev/github-repos"`

Any visitor can inspect DevTools → Network or the compiled bundle to retrieve these endpoints, enabling abuse (spam submissions, scraping, rate-limit exhaustion).

**Standard:** "No hardcoded secrets or API keys." These should be in `.env` as `VITE_API_BASE_URL` and read via `import.meta.env.VITE_API_BASE_URL`.

---

### 2.2 No Input Validation Beyond HTML5 — FAIL
`ContactMe.jsx:117–139` — the only form in the project has:
- `required` attribute on name and email inputs (HTML5 only)
- `type="email"` on email input (browser-enforced only)
- **No** `maxLength` on any field — name and message accept unlimited characters
- **No** regex or pattern validation
- **No** client-side sanitization before the fetch body is assembled at line 33: `body: JSON.stringify(formData)`

A user can submit a name field containing 10,000 characters or crafted payloads.

**Standard:** "Validate and sanitize all user input."

---

### 2.3 Raw API Error Text Rendered in UI — XSS Risk
`ContactMe.jsx:49`:
```js
setErrorMessage(`Failed to send email: ${errorText}`);
```
`errorText` is the raw text body of the HTTP error response from the backend. If the Worker ever returns HTML or a string containing `<script>` tags, this string is passed to React state and rendered in JSX — where React does escape it. However, this pattern is fragile and violates defensive coding: the error text should be sanitized or replaced with a generic message.

**Standard:** "Escape all rendered user content to prevent XSS."

---

### 2.4 No Content Security Policy — FAIL
`index.html` contains no `Content-Security-Policy` meta tag. There are no CSP headers configured in `vite.config.js`. Without a CSP, any injected script (via a browser extension, compromised CDN, or XSS) runs freely.

Minimum recommended addition to `index.html <head>`:
```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self';
           script-src 'self';
           style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
           font-src https://fonts.gstatic.com;
           img-src 'self' data: https:;
           connect-src https://portfolio-site.khizrkshah-a83.workers.dev;
           object-src 'none';" />
```

**Standard:** "Set proper CORS headers" / implied security hardening.

---

### 2.5 No CSRF Protection — FAIL
`ContactMe.jsx` submits a JSON POST with no CSRF token, no `SameSite` cookie check, and no custom header that would force a CORS preflight gate. Protection must exist on the Cloudflare Worker, but this cannot be verified from the frontend code alone.

**Standard:** "Implement CSRF protection on forms."

---

### 2.6 Undefined Variable Causes Runtime Error — FAIL (Bug)
`ThreejsComponent.jsx:361`:
```js
listener.context.resume().then(() => {
  if (isAudioResumed) {   // <-- isAudioResumed is never defined anywhere
    uniforms.u_time.value = 0.0;
    ...
  }
})
```
`isAudioResumed` is not declared in the component scope or elsewhere. Accessing it throws a `ReferenceError` in strict mode, silently evaluates as `undefined` (falsy) otherwise, making the block unreachable. The intent was likely to track whether the user had already started playback.

---

### 2.7 No `npm audit` or Lockfile Pinning
All production dependencies use the `^` prefix in `package.json`, meaning a `npm install` can silently pull in a minor or patch bump of any package. There is no `package-lock.json` included in git (`.gitignore` may exclude it) and no CI step running `npm audit`. Three.js and Tween.js in particular have had CVEs in older versions.

---

## 3. Three.js Performance

**Grade: F**

This is the most critical section. The entire Three.js scene is initialized inside a `useEffect` with an empty dependency array (`ThreejsComponent.jsx:13`), which is correct. However, the effect has **no cleanup `return` function** (`ThreejsComponent.jsx:382`). Every resource created persists after component unmount and accumulates on re-mount (which React 18 Strict Mode triggers intentionally in development).

### 3.1 `requestAnimationFrame` Never Cancelled
`ThreejsComponent.jsx:347–354`:
```js
var animate = function () {
  requestAnimationFrame(animate);
  ...
};
animate();
```
The frame ID is never stored and `cancelAnimationFrame` is never called. After unmount the loop continues consuming CPU/GPU indefinitely.

**Standard:** "Use requestAnimationFrame correctly."

---

### 3.2 Window Event Listeners Never Removed
Four listeners are attached but never removed:

| Line | Event | Handler |
|------|-------|---------|
| 46 | `window` `resize` | `onWindowResize` |
| 320 | `canvas` `click` | `onMouseClick` |
| 357 | `window` `focus` | anonymous |
| 372 | `window` `blur` | anonymous |

On component re-mount a second set of identical listeners is added, causing handlers to fire multiple times.

---

### 3.3 Geometries Never Disposed
`ThreejsComponent.jsx`:
- Line 69: `new THREE.SphereGeometry(...)` — never `geometry.dispose()`
- Line 243: `new THREE.IcosahedronGeometry(...)` — never disposed

`Starfield.jsx`:
- Line 30: `new THREE.BufferGeometry()` — never disposed

**Standard:** "Dispose geometries, materials, and textures when unmounted."

---

### 3.4 Materials Never Disposed
`ThreejsComponent.jsx`:
- Line 70–72: `new THREE.MeshStandardMaterial(...)` — never `material.dispose()`
- Line 235–240: `new THREE.ShaderMaterial(...)` — never disposed

`Starfield.jsx`:
- Line 54–58: `new THREE.PointsMaterial(...)` — never disposed

---

### 3.5 Texture Never Disposed
`Starfield.jsx:57`:
```js
const texture = new THREE.TextureLoader().load("/disc.png");
```
The loaded texture is never stored for later disposal and is never called with `.dispose()`. Additionally, a brand-new `TextureLoader` instance is constructed every time `getStarfield()` is called — texture should be loaded once and cached.

---

### 3.6 OrbitControls Never Disposed
`ThreejsComponent.jsx:92`:
```js
const controls = new OrbitControls(camera, renderer.domElement);
```
`controls.dispose()` is never called, leaving event listeners attached to the renderer DOM element.

---

### 3.7 EffectComposer and BloomPass Never Disposed
`ThreejsComponent.jsx:120–130`:
```js
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(...);
const bloomComposer = new EffectComposer(renderer);
```
Neither `bloomComposer.dispose()` nor any pass cleanup is called on unmount.

---

### 3.8 Audio Context Never Closed
`ThreejsComponent.jsx:253–257`:
```js
const listener = new THREE.AudioListener();
camera.add(listener);
const sound = new THREE.Audio(listener);
```
`listener.context.close()` and `sound.disconnect()` are never called. The Web Audio API context remains open after unmount.

---

### 3.9 WebGL Renderer Never Disposed
`ThreejsComponent.jsx` creates the renderer but never calls `renderer.dispose()` or removes the canvas from the DOM.

---

### 3.10 Three.js Not Lazy-Loaded
`App.jsx` imports `ThreejsComponent` at the top level. Three.js is ~600KB gzipped and is bundled into the main chunk, blocking the initial page render. It should be wrapped in `React.lazy()` with a `<Suspense>` fallback.

**Standard:** "Lazy load heavy components."

---

## 4. React Patterns

**Grade: C**

### 4.1 No `useMemo` or `useCallback` — FAIL
No memoization is used anywhere in the project. Notable missed opportunities:

- `ContactMe.jsx` — `handleChange` recreated on every render; safe to `useCallback`
- `Projects.jsx` — `handleMouseDown`, `handleMouseMove`, `handleMouseUp` all recreated every render; safe to `useCallback`
- `Projects.jsx` — filtered/sorted project list could be `useMemo`

**Standard:** "Use useMemo/useCallback for expensive computations."

---

### 4.2 No Lazy Loading — FAIL
`ThreejsComponent` is the heaviest component on the page (Three.js + shaders + audio) and is placed in section 1. It is imported statically in `App.jsx`. Wrapping it in `React.lazy` would allow the browser to defer parsing ~600KB of Three.js until after the initial render.

**Standard:** "Lazy load heavy components."

---

### 4.3 No Error Boundaries — FAIL
A WebGL context failure, a failed audio load, or a shader compile error inside `ThreejsComponent.jsx` will propagate uncaught and unmount the entire React tree. No `<ErrorBoundary>` component exists anywhere in the project.

**Standard:** "Handle all error cases with meaningful messages."

---

### 4.4 `animate` Prop Used as `initial` — FAIL
`ProjectCard.jsx:10`:
```jsx
animate={{ opacity: 0 }}
```
This sets the `animate` target to `opacity: 0`, meaning the card fades *out* on every mount. The intended behaviour is `initial={{ opacity: 0 }}` with `animate={{ opacity: 1 }}` (or `whileInView`). As written, every card flickers.

---

### 4.5 Positives
- State is always local to the component that owns it — no unnecessary lifting or prop drilling.
- Framer Motion's `whileInView` + `viewport={{ once: false }}` used consistently for scroll animations.
- `useRef` used correctly in `Projects.jsx` to track drag state without triggering re-renders.
- React Strict Mode is enabled in `main.jsx` — good practice.

---

## 5. Accessibility

**Grade: D**

### 5.1 No `<label>` Elements on Form Inputs — FAIL
`ContactMe.jsx:117–139` — all three form fields use `placeholder` as the only label:
```jsx
<motion.input type="text" name="name" placeholder="Your Name" />
<motion.input type="email" name="email" placeholder="Your Email" />
<motion.textarea name="message" placeholder="Your Message" />
```
Placeholders disappear when the user starts typing and are not read reliably by all screen readers. Each input needs a `<label htmlFor="...">` paired with a matching `id`.

**Standard:** "Semantic HTML elements" / "ARIA labels where needed."

---

### 5.2 ToggleButton Missing ARIA Attributes — FAIL
`ToggleButton.jsx` — the hamburger menu `<button>` has no:
- `aria-label` (screen readers announce "button" with no context)
- `aria-expanded` (state not communicated)
- `aria-controls` (no reference to the menu it controls)

---

### 5.3 No `<nav>` Wrapper — FAIL
`Links.jsx` renders navigation links inside a `<motion.div className="links">`. The correct element is `<nav>` or at minimum `role="navigation"` with an `aria-label`.

---

### 5.4 No `<main>` Element — FAIL
`App.jsx` uses four `<section>` elements as top-level siblings with no wrapping `<main>`. Screen reader users rely on the `<main>` landmark to skip past repeated navigation.

---

### 5.5 Icon-Only Social Links Without Labels — FAIL
`Introduction.jsx:68–77` — GitHub, LinkedIn, and other social links render only react-icon SVG elements with no text or `aria-label`:
```jsx
<a href="..."><FaGithub /></a>
```
A screen reader announces "link" with no destination. Should be `<a href="..." aria-label="GitHub profile">`.

---

### 5.6 Non-Descriptive Alt Text — FAIL
`ProjectCard.jsx:25`:
```jsx
<img src={project.image} alt="thumbnail" />
```
`"thumbnail"` conveys no information. Should be `alt={`${project.name} screenshot`}` or similar.

---

### 5.7 Color Contrast Failure — FAIL
Hover accent color `rgb(219, 0, 164)` (`#db00a4`) on black `#000000` achieves a contrast ratio of approximately **5.0:1**.

- WCAG AA requires **4.5:1** for normal text — this barely passes
- WCAG AA requires **3:1** for large text (18pt+) — passes
- WCAG AAA requires **7:1** — fails

However, several styles apply this color to normal-weight body-size text:
- `Introduction.scss:25` — hover on links
- `Introduction.scss:35` — hover on text
- `Projects.scss:89` — hover on project titles

At small font sizes this is a real contrast failure. The base accent `rgb(179, 2, 134)` is even darker at ~4.5:1.

**Standard:** "Sufficient color contrast."

---

### 5.8 No Focus Management on Sidebar — FAIL
When the sidebar opens (`Sidebar.jsx`), focus is not moved to the first menu item. When it closes, focus is not restored to the toggle button. Keyboard users navigating with Tab will find their context lost.

**Standard:** "Keyboard navigation support."

---

### 5.9 Canvas Element Has No ARIA Attributes — FAIL
`ThreejsComponent.jsx:385`:
```jsx
<canvas id="canvasRef" className="touch-action" />
```
The `<canvas>` is purely decorative (the user clicks it to toggle music). It should have `role="img"` and `aria-label="Interactive 3D visualization — click to play music"` or `aria-hidden="true"` if the play action is surfaced elsewhere.

---

## 6. Testing

**Grade: F**

- **Zero test files** in the entire project
- **No testing framework** in `package.json` (no Jest, Vitest, Testing Library, Playwright, Cypress)
- **No test scripts** in `package.json` (`dev`, `build`, `lint`, `preview` — no `test`)
- **No CI test step** in the git history or any workflow file

**Standard:** "Write unit tests for business logic. Test edge cases and error paths. Validate input boundaries."

### What should be tested at minimum:

| Unit | Test Cases |
|------|-----------|
| `handleCLick` (Links.jsx) | scrolls to correct section; handles missing element |
| `sendEmail` (ContactMe.jsx) | success path resets form; network error sets errorMessage; HTTP error sets errorMessage |
| `handleChange` (ContactMe.jsx) | updates correct field in formData |
| `getStarfield` (Starfield.jsx) | returns a THREE.Points instance; point count matches argument |
| Input validation | name maxLength enforced; email format rejected; empty message rejected |

---

## Summary Scorecard

| Section | Grade | Primary Issue |
|---------|-------|---------------|
| Project Overview | B | No TypeScript, no tests |
| Code Quality | D | No JSDoc, `var` usage, typo, 390-line function, dead code |
| Security | D | Hardcoded endpoints, no validation, no CSP, undefined var at :361 |
| Three.js Performance | F | No cleanup at all — memory leaks on every resource |
| React Patterns | C | No memoization, no lazy loading, no error boundaries |
| Accessibility | D | No labels, no ARIA, contrast failure, no focus management |
| Testing | F | Zero tests, no framework |

---

## Priority Fix List

### Critical (Fix First)
1. **ThreejsComponent.jsx** — add `return () => { ... }` cleanup to the `useEffect` cancelling the rAF loop, removing all event listeners, disposing all Three.js objects, and closing the audio context
2. **ThreejsComponent.jsx:361** — define `isAudioResumed` (likely `let isAudioResumed = false` toggled on first play) to fix the silent `ReferenceError`
3. **ThreejsComponent.jsx:150** — replace `document.getElementById("canvasRef")` with a `useRef`

### High Priority
4. **ContactMe.jsx + Projects.jsx** — move API base URL to `VITE_API_BASE_URL` in `.env`
5. **ContactMe.jsx:117–139** — add `maxLength`, pattern validation, and `<label>` elements
6. **index.html** — add CSP `<meta>` tag
7. **ToggleButton.jsx** — add `aria-label`, `aria-expanded`, `aria-controls`
8. **Links.jsx** — wrap in `<nav>` element; fix `handleCLick` typo

### Medium Priority
9. **App.jsx** — lazy-load `ThreejsComponent` with `React.lazy` + `<Suspense>`
10. **ProjectCard.jsx:10** — change `animate={{ opacity: 0 }}` to `initial={{ opacity: 0 }}`
11. **Introduction.jsx:68–77** — add `aria-label` to all icon-only social links
12. **ThreejsComponent.jsx** — replace `var` with `const`/`let` throughout
13. **App.scss:30** — fix `size: 40px` → `font-size: 40px`
14. **Sidebar.jsx** — remove unused wobble variants
15. **package.json** — remove `dat.gui` from dependencies

### Low Priority
16. Add JSDoc to all exported functions
17. Add Vitest + Testing Library; write tests for form logic and scroll handlers
18. Add an `ErrorBoundary` wrapping `ThreejsComponent`
19. Add `alt={`${project.name} screenshot`}` to `ProjectCard.jsx:25`
20. Add `<canvas aria-label="...">` or `aria-hidden="true"` to `ThreejsComponent.jsx:385`
