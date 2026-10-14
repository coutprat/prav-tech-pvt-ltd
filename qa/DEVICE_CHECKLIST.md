# Device test checklist

Automated QA covers Chromium and WebKit in a desktop harness. It cannot
reproduce real touch scrolling, the mobile address bar resizing the viewport,
or how a real GPU behaves under thermal load. These are the things that only
break on actual hardware.

Test on **two devices**:

- **iPhone, Safari** — the WebKit behaviours that matter most: pinned
  scrolling, `svh` units, `backdrop-filter`, and video autoplay rules.
- **A mid-range Android, Chrome, throttled to 4G** — a 4 GB device should be
  routed *away* from 3D by the capability gate. Confirm it is.

Mark each item pass/fail and note the device and OS version.

---

## 1. First screen

- [ ] Home paints the hero image within a couple of seconds on 4G — no long
      blank or white flash.
- [ ] No layout jump as fonts load or the hero becomes interactive.
- [ ] Nothing important is hidden behind the address bar at first paint.

## 2. Pinned scrolling (the main risk area)

Home, Photonics and MENNIE all pin a section and scrub it.

- [ ] Home hero: scrolling advances the sequence smoothly; it does not stick,
      jump back, or scroll past without playing.
- [ ] **Address-bar test (iOS especially):** scroll down until the Safari bar
      collapses, then back up until it reappears. The pinned section must not
      jump, double-scroll, or leave a gap. Repeat on Photonics.
- [ ] Scroll quickly to the bottom and back to the top. Everything unpins
      cleanly; no section is left stuck over the content.
- [ ] Rotate the device mid-pin. The layout recovers without overlap.

## 3. 3D sections

- [ ] **iPhone:** MENNIE shows the film (title → 2.5D plate → HUD panels →
      surfaces → caption). The figure has real depth as the camera moves —
      not a flat photo panning.
- [ ] No tearing or stretched spikes around her silhouette at any point.
- [ ] Photonics "Inside an 800G module" comes apart on scroll and the six
      labels are readable, not overlapping each other.
- [ ] **Mid-range Android (4 GB):** both of the above should fall back to the
      image/list version. If 3D runs on a device that stutters, the gate in
      `lib/capability.ts` needs tightening.
- [ ] Phone does not become hot or visibly drop frames after ~30 s on either
      3D page.
- [ ] Background the tab and return. 3D resumes rather than freezing or
      showing a black canvas (a lost WebGL context).

## 4. Reduced motion

Turn it on: **iOS** Settings → Accessibility → Motion → Reduce Motion.
**Android** Settings → Accessibility → Remove animations.

- [ ] Home and Photonics show a static final frame with *all* chapter text
      visible — never a blank pinned stage.
- [ ] MENNIE shows the image hero with all four HUD steps readable as text.
- [ ] Nothing pins or scrubs anywhere on the site.

## 5. WhatsApp button

- [ ] Visible bottom-right on every page, including after scrolling.
- [ ] Does **not** cover the submit button on Contact or Start a project, or
      the footer links, at the bottom of the page.
- [ ] Clears the iOS home indicator.
- [ ] Opens WhatsApp with the prefilled message
      ("Hello Praverse Tech, I'd like to discuss a project."), in the app if
      installed and the web version if not.
- [ ] Hidden while the mobile nav drawer is open.

## 6. Forms

- [ ] Contact: submit with an empty required field — the browser blocks it and
      focuses the field.
- [ ] Submit a real test enquiry. **Confirm it arrives at the enquiry mailbox**
      and that hitting reply goes to the address you typed, not to the site.
- [ ] Submit twice more quickly; the fourth attempt in a minute is rate-limited
      with a clear message rather than a silent failure.
- [ ] The keyboard does not cover the field being typed in.
- [ ] Select menus open natively.
- [ ] MENNIE waitlist form submits.

## 7. Theme

- [ ] Toggle to dark. Everything stays readable; no light panel is left over,
      and the hero sequence switches to its dark render rather than staying a
      bright block.
- [ ] Reload — the theme persists with no light flash before paint.
- [ ] Set the OS to dark and open the site fresh in a private tab: it should
      open dark.

## 8. Navigation

- [ ] Mobile drawer opens, traps nothing, closes on selection and on Escape
      (where a keyboard is attached).
- [ ] Page behind the drawer does not scroll.
- [ ] Every main-nav item reaches the right page.
- [ ] Old links still work: `/healthmate` → `/mennie`, `/foundry` → `/company`.

## 9. Sharing

- [ ] Paste a link to Home, MENNIE and Photonics into WhatsApp or Slack. Each
      unfurls with its own image and the right title.

---

## Report back

For each failure: the page, device and OS version, what you did, what
happened, and a screen recording if the problem is motion-related — a still
rarely shows a scrolling bug.

---

## Prompt 3 additions

Things that changed enough in this round to be worth a human looking at on a
real device. Everything here is already covered by an automated check except
where noted; these are the ones where a machine can confirm the mechanics but
not the feel.

### Home hero

- [ ] The four labels sit **on** their modules as the camera pushes in, not
      beside them, and do not jitter. Hidden below 900px by design.
- [ ] Each label flips to the inboard side rather than running off the right
      edge.
- [ ] Tapping a label navigates to that page. They are real links.
- [ ] The closing caption appears only at the end, not over the modules.

### MENNIE

- [ ] The film is **one continuous shot** — if you see a cut to a different
      scene, something has regressed.
- [ ] Scrubbing back and forth stays smooth. Treacle means the short-GOP
      re-encode did not take.
- [ ] Text stays readable over the sunrise at the end. That is the scrim.
- [ ] On a low-power phone or with reduced motion you get the image hero
      instead, carrying the same lines.

### Enterprise AI and Pharma signatures

- [ ] The console reads as a product, not a diagram, at phone width.
- [ ] The approval gate is clearly the pivot: machine above/left, human
      below/right.
- [ ] Pharma highlights wipe in like a marker, and the text on them is readable
      in **both** themes. Dark was a real failure before it was fixed.
- [ ] The evidence rail lights the record each paragraph cites.

### Theme switching

- [ ] Switch theme **mid-scroll**, inside a pinned section. Nothing should jump,
      re-pin, or lose its place.
- [ ] Switch theme on the hero: the frame sequence swaps light/dark frames
      without a flash of the wrong one.
- [ ] Compare against `qa/theme-board.png` — if a surface looks different from
      the board, the board is stale or the surface regressed.

### Everywhere

- [ ] No page scrolls sideways. Automated by `scripts/qa/overflow-check.mjs`,
      but worth a thumb-swipe on a real phone, especially `/pharma` where the
      spec table lives.
- [ ] The logo in the header is crisp at every pixel ratio and does not flash in
      after the rest of the page.
