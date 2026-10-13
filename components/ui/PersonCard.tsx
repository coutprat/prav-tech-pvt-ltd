import Image from "next/image";

export type Person = {
  slug: string;
  name: string;
  role: string;
  proof: readonly string[];
  /** Omitted until the URL is confirmed — see content/verify.ts #linkedin-people */
  linkedIn?: string;
};

/**
 * Portrait is grayscale at rest and resolves to colour on hover or keyboard
 * focus — done with a CSS filter on one image rather than stacking a second
 * colour copy at opacity 0. Two full-size images per person doubled the bytes
 * on this page for a hover state most visitors never trigger.
 *
 * Uses the `-plate` variants: the three source photos have different
 * backdrops, so the transparent cutouts are composited onto one warm-gray
 * plate by scripts/media/portraits.py. Side by side they then read as one
 * set rather than three unrelated photos.
 *
 * Ashwani's source photo is low resolution. A reshoot can drop in over the
 * same filenames with no code change.
 */
export function PersonCard({ person, priority }: { person: Person; priority?: boolean }) {
  const { slug, name, role, proof, linkedIn } = person;

  return (
    <article className="person">
      <div className="person-portrait">
        <Image
          src={`/team/${slug}-plate.webp`}
          alt={`Portrait of ${name}`}
          width={800}
          height={1000}
          sizes="(min-width: 900px) 33vw, 100vw"
          priority={priority}
        />
      </div>

      <h3 className="person-name">{name}</h3>
      <p className="person-role">{role}</p>

      <ul className="person-proof">
        {proof.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      {linkedIn ? (
        <p style={{ marginTop: 16 }}>
          <a className="link" href={linkedIn} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </p>
      ) : null}
    </article>
  );
}
