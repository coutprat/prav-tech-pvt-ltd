import Link from "next/link";
import { Mark } from "@/components/ui/Mark";
import { FooterWordmark } from "@/components/ui/FooterWordmark";
import { company } from "@/content/company";
import { site, locations } from "@/content/site";
import { footerNav } from "@/data/navigation";
import { Verify, isWithheld } from "@/components/ui/Verify";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer pf">
      <div className="wrap">
        <div className="pf-top">
          <p className="pf-statement">
            Intelligence, <em>engineered</em> for industry.
          </p>
          <div className="pf-reach">
            <a className="pf-mail" href={`mailto:${site.enquiryEmail}`}>
              {site.enquiryEmail}
              <span aria-hidden="true">↗</span>
            </a>
            <p className="pf-small">{company.promise}</p>
          </div>
        </div>

        <div className="pf-grid">
          <div className="pf-id">
            <Link href="/" className="pf-logo" aria-label="Praverse Tech, home">
              <Mark size={40} tile />
              <span>Praverse</span>
            </Link>
            <p className="pf-small">
              {company.legalName} · Registered in India
              <br />
              <Verify id="registered-address" />
              <br />
              <Verify id="cin" />
            </p>
            <p className="pf-small">{locations.line}</p>
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
              <li>
                <a href={`mailto:${site.careersEmail}`}>{site.careersEmail}</a>
              </li>
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

        <div className="wm-wrap">
          <FooterWordmark />
        </div>

        <div className="footer-legal pf-legal">
          <span>
            © {year} {company.legalName}
          </span>
          <span>{company.hq}</span>
        </div>
      </div>
    </footer>
  );
}
