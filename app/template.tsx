/**
 * Re-mounts on every navigation, so each page fades in rather than
 * snapping into place. Opacity only — see .page-enter in globals.css.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
