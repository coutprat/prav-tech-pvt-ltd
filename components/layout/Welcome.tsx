import { Mark } from "@/components/ui/Mark";
import { WelcomeBot } from "@/components/layout/WelcomeBot";

/**
 * The opening curtain, with the 3D greeter.
 *
 * Rules it has to keep, in order of how badly each one bites:
 *
 *  1. It never traps anyone. The page is fully rendered and scrollable
 *     underneath the whole time; any click, key, scroll or touch lifts the
 *     curtain at once, and there is a hard ceiling on how long it can stay.
 *  2. It lifts without JavaScript. A delayed CSS animation with `forwards`
 *     removes it on its own, so a visitor whose script never runs is not
 *     sealed behind it. JavaScript only brings that moment forward.
 *  3. It renders in the HTML, not after hydration, or the first thing anyone
 *     would see is the page it is supposed to be introducing.
 *  4. Reduced motion never sees it, and neither does a second visit.
 *
 * Timing. The greeter is a 3D scene, so it cannot be on screen at the first
 * paint. The curtain therefore waits for the greeter's first frame (up to
 * WAIT), shows it for SHOW, and never exceeds HARD in total. A device that
 * will not get the 3D scene lifts after FALLBACK with the mark alone.
 *
 * It is aria-hidden, so assistive technology reads the page underneath
 * immediately rather than waiting out an animation it cannot see.
 */
export function Welcome() {
  return (
    <div className="welcome" aria-hidden="true">
      <div className="welcome-inner">
        <WelcomeBot />
        <p className="welcome-hello">
          Hello. Tell us the <em>problem</em>.
        </p>
        <p className="welcome-line">
          <Mark size={18} />
          Praverse Tech · Intelligence, engineered for industry
        </p>
      </div>
    </div>
  );
}

/**
 * Bumped from "praverse-welcomed" when the 3D greeter replaced the logo
 * curtain: the old key is set for every earlier visitor, who would otherwise
 * never meet the greeter.
 */
const KEY = "praverse-hello-v2";
/** How long to wait for the greeter's first frame before lifting anyway. */
const WAIT = 4200;
/** How long the greeter stays once it is on screen. */
const SHOW = 3000;
/** The curtain is never up longer than this, whatever happens. */
const HARD = 6500;
/** No 3D on this device: show the mark briefly and lift. */
const FALLBACK = 1300;
/** Matches the fade in globals.css (.welcome, welcome-lift). */
const FADE = 700;

/**
 * Decides before first paint whether the curtain is shown at all, so there is
 * never a frame of it on a repeat visit.
 *
 * Marks <html data-welcomed> when it should be skipped — a second visit, or a
 * visitor who has asked for reduced motion — and the stylesheet takes it from
 * there. Writing the flag immediately, rather than when the curtain finishes,
 * means a visitor who leaves mid-animation still does not see it twice.
 *
 * Lifting is two steps: data-welcome-out starts the fade, data-welcomed
 * removes the curtain once it has finished. window.__pvWelcome lets the
 * greeter report in: show() when its first frame is drawn, skip() when there
 * will be no 3D scene.
 */
export const welcomeScript = `(function(){try{var r=document.documentElement;
var force=/[?&]hello=1/.test(location.search);
var seen=!force&&localStorage.getItem("${KEY}");
var still=!force&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(seen||still){r.setAttribute("data-welcomed","");return;}
localStorage.setItem("${KEY}","1");
var t0=Date.now(),timer=0,gone=false;
var out=function(){if(gone)return;gone=true;clearTimeout(timer);
r.setAttribute("data-welcome-out","");
setTimeout(function(){r.setAttribute("data-welcomed","");},${FADE});};
var arm=function(ms){if(gone)return;clearTimeout(timer);
timer=setTimeout(out,Math.max(300,Math.min(ms,${HARD}-(Date.now()-t0))));};
arm(${WAIT});
window.__pvWelcome={show:function(){arm(${SHOW});},skip:function(){arm(${FALLBACK});}};
["pointerdown","keydown","wheel","touchstart"].forEach(function(e){
window.addEventListener(e,out,{once:true,passive:true});});
}catch(e){document.documentElement.setAttribute("data-welcomed","");}})();`;
