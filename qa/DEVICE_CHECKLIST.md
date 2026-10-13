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
