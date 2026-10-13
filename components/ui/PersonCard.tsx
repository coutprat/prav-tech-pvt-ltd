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
 * focus. Both files are 800×1000 on the same warm-gray backdrop.
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
          src={`/team/${slug}-mono.webp`}
          alt={`Portrait of ${name}`}
          width={800}
          height={1000}
          sizes="(min-width: 900px) 33vw, 100vw"
          priority={priority}
        />
        <Image
          className="colour"
          src={`/team/${slug}.webp`}
          alt=""
          aria-hidden="true"
          width={800}
          height={1000}
          sizes="(min-width: 900px) 33vw, 100vw"
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
