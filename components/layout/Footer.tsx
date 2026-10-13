import Link from "next/link";
import { company } from "@/content/company";
import { footerNav } from "@/data/navigation";
import { Verify, isWithheld } from "@/components/ui/Verify";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-identity">
            <h2>
              Praverse<span style={{ color: "var(--teal)" }}>.</span>
            </h2>
            <p>
              {company.legalName} · Registered in India
              <br />
              <Verify id="registered-address" />
              <br />
              <Verify id="cin" />
            </p>
            <p style={{ marginTop: 18 }}>
              <a href={`mailto:${company.email}`}>{company.email}</a>
              <br />
              <a href={`tel:${company.tel}`}>{company.phone}</a>
            </p>
          </div>

          <nav aria-label="Work">
            <h3>Work</h3>
            <ul>
              {footerNav.work.map((i) => (
                <li key={i.href}>
                  <Link href={i.href}>{i.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3>Company</h3>
            <ul>
              {footerNav.company.map((i) => (
                <li key={i.href}>
                  <Link href={i.href}>{i.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3>Legal</h3>
            <ul>
              {footerNav.legal.map((i) => (
                <li key={i.href}>
                  <Link href={i.href}>{i.label}</Link>
                </li>
              ))}
              {isWithheld("linkedin-company") ? null : (
                <li>
                  <a href={company.linkedIn} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className="footer-legal">
          <span>
            © {year} {company.legalName}
          </span>
          <span>{company.hq}</span>
        </div>
      </div>
    </footer>
  );
}
