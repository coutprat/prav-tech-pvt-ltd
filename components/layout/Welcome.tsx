import { Mark } from "@/components/ui/Mark";

/**
 * The opening curtain.
 *
 * Rules it has to keep, in order of how badly each one bites:
 *
 *  1. It never delays reading. The page is fully rendered and scrollable
 *     underneath the whole time, and the curtain lifts on a timer — not when
 *     anything has loaded. On a slow phone it is gone at the same moment it is
 *     gone on a fast laptop.
 *  2. It lifts without JavaScript. The fade is a CSS animation with
 *     `forwards`, so a visitor whose script never runs is not sealed behind a
 *     white sheet. JavaScript only handles remembering and skipping.
 *  3. It renders in the HTML, not after hydration, or the first thing anyone
 *     would see is the page it is supposed to be introducing.
 *  4. Reduced motion never sees it, and neither does a second visit.
 *
 * Decisions 1 and 2 are why this is markup plus a stylesheet rather than a
 * React component with a timer in an effect: an effect runs after paint and
 * after hydration, which is far too late to be in charge of something that is
 * already on screen.
 *
 * It is aria-hidden, so assistive technology reads the page underneath
 * immediately rather than waiting out an animation it cannot see.
 */
export function Welcome() {
  return (
    <div className="welcome" aria-hidden="true">
      <div className="welcome-inner">
        <Mark size={96} />
        <p className="welcome-line">Intelligence, engineered for industry.</p>
      </div>
    </div>
  );
}

const KEY = "praverse-welcomed";
const MS = 1200;

/**
 * Decides before first paint whether the curtain is shown at all, so there is
 * never a frame of it on a repeat visit.
 *
 * Marks <html data-welcomed> when it should be skipped — a second visit, or a
 * visitor who has asked for reduced motion — and the stylesheet takes it from
 * there. Writing the flag immediately, rather than when the curtain finishes,
 * means a visitor who leaves mid-animation still does not see it twice.
 *
 * The skip listeners are `once` and passive; any of them simply brings the
 * same end state forward.
 */
export const welcomeScript = `(function(){try{var r=document.documentElement;
var seen=localStorage.getItem("${KEY}");
var still=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(seen||still){r.setAttribute("data-welcomed","");return;}
localStorage.setItem("${KEY}","1");
var done=function(){r.setAttribute("data-welcomed","");};
setTimeout(done,${MS});
["pointerdown","keydown","wheel","touchstart"].forEach(function(e){
window.addEventListener(e,done,{once:true,passive:true});});
}catch(e){document.documentElement.setAttribute("data-welcomed","");}})();`;
