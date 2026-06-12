import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="logo">
              <Image src="/logo.svg" className="logo-mark" alt="Praverse" width={30} height={30} />
              Praverse
            </div>
            <p>
              Engineering human-centered intelligence. Enterprise-grade AI/ML systems across healthcare,
              pharma, robotics, infrastructure, and advanced future-tech domains.
            </p>
            <div className="foot-contact">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={`tel:${site.tel}`}>{site.phone}</a>
              <span>{site.location}</span>
            </div>
          </div>
          <div>
            <h5>Explore</h5>
            <ul>
              <li><Link href="/domains">Innovation Domains</Link></li>
              <li><Link href="/healthmate">HealthMate</Link></li>
              <li><Link href="/pharma">Pharma &amp; Regulatory AI</Link></li>
              <li><Link href="/research">Research &amp; Labs</Link></li>
              <li><Link href="/insights">Insights</Link></li>
              <li><Link href="/innovate">Innovate</Link></li>
            </ul>
          </div>
          <div>
            <h5>Capabilities</h5>
            <ul>
              <li><Link href="/#capabilities">AI/ML Systems</Link></li>
              <li><Link href="/#agents">AI Agents</Link></li>
              <li><Link href="/#capabilities">Vision &amp; Imaging</Link></li>
              <li><Link href="/#frontier">Frontier Lab</Link></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><a href={site.linkedIn} target="_blank" rel="noopener">LinkedIn</a></li>
              <li><Link href="/about#legal">Terms &amp; Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Praverse Tech Pvt Ltd. All rights reserved.</span>
          <span className="mono">INTELLIGENCE · ENGINEERED</span>
        </div>
      </div>
    </footer>
  );
}
