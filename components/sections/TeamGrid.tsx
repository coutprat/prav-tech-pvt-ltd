import Image from "next/image";
import { team } from "@/content/site";

/**
 * The core team, beyond the leadership already on this page.
 *
 * Renders nothing while content/site.ts `team` is empty, which is where it
 * stands: nobody's name or photo goes up without their consent, and asking for
 * that consent is the owner's job, not a build step. Add an entry and the
 * section appears - no code change, no layout to rebuild.
 *
 * Photos are optional. Without one a member gets an initials tile, so a person
 * who would rather not be photographed is not conspicuously the odd one out.
 */
export function TeamGrid() {
  if (team.length === 0) return null;

  return (
    <section className="section">
      <div className="wrap">
        <p className="section-label">The team</p>
        <h2 className="h2">The people who do the work.</h2>
        <ul className="team-grid">
          {team.map((m) => (
            <li className="team-member" key={m.name}>
              <div className="team-portrait">
                {m.photo ? (
                  <Image
                    src={`/team/${m.photo}.webp`}
                    alt={`Portrait of ${m.name}`}
                    width={480}
                    height={600}
                    sizes="(min-width: 900px) 25vw, 50vw"
                  />
                ) : (
                  <span className="team-initials" aria-hidden="true">
                    {m.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                )}
              </div>
              <h3 className="team-name">
                {m.linkedIn ? (
                  <a href={m.linkedIn} rel="noopener noreferrer" target="_blank">
                    {m.name}
                  </a>
                ) : (
                  m.name
                )}
              </h3>
              <p className="team-role">{m.role}</p>
              <p className="team-city">{m.city}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
