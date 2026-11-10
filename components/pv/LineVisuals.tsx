import { Live } from "@/components/pv/Live";

/**
 * The six line-page centrepieces. Each one explains its line in the prism's
 * language — white light in, the line's colour out — and each is honest about
 * being illustrative: no real record, client or figure appears in any of them.
 *
 * SVG plus CSS keyframes (app/v3-pages.css, .lv-*). Animations only run while
 * the visual is on screen (see Live), and rest in a readable final state under
 * reduced motion. All decorative: the page copy says the same thing in words.
 */

const VB = "0 0 560 520";

function Frame({ label, children, c }: { label: string; children: React.ReactNode; c: string }) {
  return (
    <Live className="lv-frame pv-glass">
      <svg viewBox={VB} role="img" aria-label={label} style={{ ["--c" as string]: c }}>
        <defs>
          <linearGradient id="lv-white" x1="0" x2="1">
            <stop offset="0" stopColor="#fbf6ea" stopOpacity="0" />
            <stop offset="1" stopColor="#fbf6ea" />
          </linearGradient>
          <linearGradient id="lv-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#34302a" stopOpacity="0.9" />
            <stop offset="1" stopColor="#141311" stopOpacity="0.75" />
          </linearGradient>
          <radialGradient id="lv-pool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fbf6ea" stopOpacity="0.12" />
            <stop offset="1" stopColor="#fbf6ea" stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} className="lv-grid" x1="0" x2="560" y1={40 + i * 64} y2={40 + i * 64} />
        ))}
        {children}
      </svg>
    </Live>
  );
}

function Prism({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const w = 70 * s;
  const h = 130 * s;
  return (
    <g>
      <circle cx={x} cy={y} r={110 * s} fill="url(#lv-pool)" />
      <polygon
        points={`${x - w / 2},${y + h / 2} ${x},${y - h / 2} ${x + w / 2},${y + h / 2}`}
        fill="url(#lv-glass)"
        stroke="rgba(246,236,210,0.5)"
      />
      <line x1={x} y1={y - h / 2} x2={x + w / 2} y2={y + h / 2} stroke="#fbf6ea" strokeOpacity="0.8" />
    </g>
  );
}

const Mono = ({ x, y, children, a = "start", o = 1 }: { x: number; y: number; children: React.ReactNode; a?: "start" | "middle" | "end"; o?: number }) => (
  <text className="lv-mono" x={x} y={y} textAnchor={a} opacity={o}>
    {children}
  </text>
);

/* ------------------------------------------------------------------ pharma */
/** An observation goes in; a cited response comes out; QA signs. */
export function PharmaVisual() {
  const outs = [
    { y: 120, k: "Root cause", r: "BR-2291" },
    { y: 230, k: "Correction", r: "SOP-QC-014" },
    { y: 340, k: "Preventive", r: "DEV-0471" },
  ];
  return (
    <Frame label="An inspection observation passing through the system into a three-part response, each part citing a record, waiting for QA to sign" c="var(--acc-pha)">
      <rect className="lv-card" x="24" y="150" width="168" height="196" rx="14" />
      <Mono x={42} y={180}>Obs. 1</Mono>
      <Mono x={24} y={372} o={0.5}>
        Illustrative
      </Mono>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} className="lv-bar" x="42" y={198 + i * 19} width={i === 6 ? 70 : 132} height="5" rx="2.5" />
      ))}
      <rect className="lv-mark" x="98" y="217" width="76" height="5" rx="2.5" />
      <rect className="lv-mark" x="42" y="274" width="60" height="5" rx="2.5" />

      <line x1="192" y1="248" x2="262" y2="252" stroke="url(#lv-white)" strokeWidth="2" />
      <Prism x={284} y={252} s={0.9} />
      {outs.map((o, i) => (
        <g key={o.k}>
          <line className="lv-ray" x1="300" y1="254" x2="352" y2={o.y + 35} />
          <line className="lv-flow" style={{ animationDelay: `${i * 0.5}s` }} x1="300" y1="254" x2="352" y2={o.y + 35} />
          <rect className="lv-card" x="352" y={o.y} width="184" height="70" rx="12" />
          <Mono x={370} y={o.y + 26} o={0.7}>
            {o.k}
          </Mono>
          <rect className="lv-bar" x="370" y={o.y + 38} width="60" height="5" rx="2.5" />
          <rect className="lv-chip" x="438" y={o.y + 31} width="86" height="19" rx="9.5" />
          <text className="lv-chip-t" x="481" y={o.y + 44} textAnchor="middle">
            {o.r}
          </text>
        </g>
      ))}
      <rect className="lv-gate" x="352" y="438" width="184" height="44" rx="22" />
      <circle className="lv-dot lv-blink" cx="376" cy="460" r="5" />
      <Mono x={392} y={464}>QA signs first</Mono>
    </Frame>
  );
}

/* --------------------------------------------------------------- enterprise */
/** Sources feed an agent that reads, checks and drafts; a named person approves. */
export function AgentVisual() {
  const ins = ["SOP", "Records", "Email"];
  const tools = [
    { a: -90, t: "Read" },
    { a: 30, t: "Check" },
    { a: 150, t: "Draft" },
  ];
  const cx = 214;
  const cy = 260;
  return (
    <Frame label="Three sources feeding an agent that reads, checks and drafts, with a named reviewer approving before any action" c="var(--acc-ent)">
      {ins.map((t, i) => {
        const y = 150 + i * 110;
        return (
          <g key={t}>
            <line className="lv-ray" x1="96" y1={y} x2={cx - 54} y2={cy} />
            <line className="lv-flow" style={{ animationDelay: `${i * 0.6}s` }} x1="96" y1={y} x2={cx - 54} y2={cy} />
            <rect className="lv-card" x="22" y={y - 20} width="74" height="40" rx="10" />
            <Mono x={59} y={y + 4} a="middle">
              {t}
            </Mono>
          </g>
        );
      })}
      <circle className="lv-orbit" cx={cx} cy={cy} r="104" />
      <polygon
        className="lv-core"
        points={Array.from({ length: 6 }, (_, i) => {
          const a = Math.PI / 6 + (i * Math.PI) / 3;
          return `${cx + Math.cos(a) * 56},${cy + Math.sin(a) * 56}`;
        }).join(" ")}
      />
      <text className="lv-core-t" x={cx} y={cy + 6} textAnchor="middle">
        Agent
      </text>
      {tools.map((t, i) => {
        const r = (t.a * Math.PI) / 180;
        const x = cx + Math.cos(r) * 104;
        const y = cy + Math.sin(r) * 104;
        return (
          <g key={t.t} className="lv-tool" style={{ animationDelay: `${i * 0.8}s` }}>
            <rect className="lv-chip" x={x - 30} y={y - 12} width="60" height="24" rx="12" />
            <text className="lv-chip-t" x={x} y={y + 4} textAnchor="middle">
              {t.t}
            </text>
          </g>
        );
      })}
      <line className="lv-ray" x1={cx + 56} y1={cy} x2="388" y2={cy} />
      <line className="lv-flow" x1={cx + 56} y1={cy} x2="388" y2={cy} />
      <rect className="lv-gate-v" x="388" y="190" width="16" height="140" rx="8" />
      <Mono x={396} y={176} a="middle">
        Named reviewer
      </Mono>
      <text className="lv-state lv-s1" x="396" y="356" textAnchor="middle">
        Awaiting review
      </text>
      <text className="lv-state lv-s2" x="396" y="356" textAnchor="middle">
        Approved
      </text>
      <line className="lv-ray lv-after" x1="404" y1={cy} x2="470" y2={cy} />
      <rect className="lv-card lv-after" x="470" y={cy - 26} width="68" height="52" rx="12" />
      <Mono x={504} y={cy + 4} a="middle">
        Action
      </Mono>
    </Frame>
  );
}

/* ------------------------------------------------------------------ mennie */
/** A patient's voice becomes a structured picture for the clinician. */
export function MennieVisual() {
  const bars = [10, 22, 36, 18, 44, 28, 14, 38, 52, 30, 20, 40, 16, 32, 46, 22, 12, 26];
  const rows = ["Reason for visit", "Symptoms", "Since", "Route to", "For the clinician"];
  return (
    <Frame label="A patient's spoken words passing through the system into a structured intake summary for the clinician" c="var(--acc-men)">
      {bars.map((h, i) => (
        <rect
          key={i}
          className="lv-wave"
          style={{ animationDelay: `${(i % 6) * 0.12}s` }}
          x={28 + i * 9}
          y={260 - h}
          width="4"
          height={h * 2}
          rx="2"
        />
      ))}
      <Mono x={28} y={344} o={0.7}>
        Patient · spoken, any language
      </Mono>
      <line x1="196" y1="260" x2="250" y2="262" stroke="url(#lv-white)" strokeWidth="2" />
      <Prism x={272} y={262} s={0.85} />
      <line className="lv-ray" x1="288" y1="264" x2="334" y2="264" />
      <line className="lv-flow" x1="288" y1="264" x2="334" y2="264" />
      <rect className="lv-card" x="334" y="96" width="202" height="332" rx="16" />
      <Mono x={354} y={128}>Intake summary</Mono>
      <line className="lv-sep" x1="354" y1="142" x2="516" y2="142" />
      {rows.map((r, i) => (
        <g key={r}>
          <Mono x={354} y={172 + i * 50} o={0.6}>
            {r}
          </Mono>
          <rect
            className="lv-fill"
            style={{ animationDelay: `${i * 0.45}s` }}
            x="354"
            y={182 + i * 50}
            width={[132, 156, 64, 110, 146][i]}
            height="6"
            rx="3"
          />
        </g>
      ))}
      <Mono x={354} y={448} o={0.5}>
        Illustrative
      </Mono>
    </Frame>
  );
}

/* --------------------------------------------------------------- photonics */
/** Eight lanes of light through one module: 8 × 200G. */
export function PhotonicsVisual() {
  const lanes = Array.from({ length: 8 }, (_, i) => 168 + i * 26);
  return (
    <Frame label="Eight lanes of light passing through one pluggable module, eight times two hundred gigabits making one point six terabits" c="var(--acc-pho)">
      <rect className="lv-module" x="176" y="132" width="208" height="232" rx="18" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} className="lv-fin" x1={196 + i * 21} y1="142" x2={196 + i * 21} y2="158" />
      ))}
      <Mono x={280} y={392} a="middle" o={0.7}>
        One pluggable module · illustrative
      </Mono>
      {lanes.map((y, i) => (
        <g key={y}>
          <line className="lv-lane" x1="20" y1={y} x2="540" y2={y} />
          <line className="lv-flow lv-flow-long" style={{ animationDelay: `${(i * 0.23) % 1.2}s` }} x1="20" y1={y} x2="540" y2={y} />
        </g>
      ))}
      <Mono x={20} y={140}>8 lanes in</Mono>
      <Mono x={540} y={140} a="end">
        × 200G
      </Mono>
      <text className="lv-big" x="540" y="452" textAnchor="end">
        1.6T
      </text>
      <Mono x={20} y={452} o={0.7}>
        800G today · 1.6T next
      </Mono>
    </Frame>
  );
}

/* --------------------------------------------------------------- sovereign */
/** Compute, model and data inside one boundary. The light never leaves it. */
export function SovereignVisual() {
  return (
    <Frame label="Racks, a model and the data inside one sealed boundary, with light circulating inside and an outside connection blocked at the edge" c="var(--acc-pho)">
      <rect className="lv-bound" x="40" y="70" width="440" height="380" rx="28" />
      <Mono x={64} y={104}>Your premises · your jurisdiction</Mono>
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <rect className="lv-card" x={84 + r * 70} y="150" width="54" height="196" rx="8" />
          {Array.from({ length: 8 }, (_, u) => (
            <rect
              key={u}
              className="lv-unit"
              style={{ animationDelay: `${(r * 8 + u) * 0.09}s` }}
              x={92 + r * 70}
              y={162 + u * 22}
              width="38"
              height="12"
              rx="3"
            />
          ))}
        </g>
      ))}
      <Mono x={154} y={372} a="middle" o={0.6}>
        Compute
      </Mono>
      <circle className="lv-core" cx="380" cy="200" r="38" />
      <text className="lv-core-t" x="380" y="206" textAnchor="middle">
        Model
      </text>
      <rect className="lv-card" x="334" y="290" width="92" height="56" rx="12" />
      <Mono x={380} y={323} a="middle">
        Data
      </Mono>
      <path className="lv-ray" d="M298 248 C 330 248 340 200 342 200 M418 200 C 450 200 460 318 426 318 M334 318 C 310 318 300 280 298 248" />
      <path className="lv-flow lv-flow-loop" d="M298 248 C 330 248 340 200 342 200 M418 200 C 450 200 460 318 426 318 M334 318 C 310 318 300 280 298 248" />
      <line className="lv-out" x1="540" y1="30" x2="486" y2="84" />
      <g className="lv-x">
        <line x1="476" y1="74" x2="494" y2="92" />
        <line x1="494" y1="74" x2="476" y2="92" />
      </g>
      <Mono x={540} y={24} a="end" o={0.6}>
        Outside call · blocked
      </Mono>
      <Mono x={64} y={432} o={0.6}>
        Nothing leaves the boundary
      </Mono>
    </Frame>
  );
}

/* -------------------------------------------------------------- government */
/** One office pilots; a named officer signs off; the rollout lights office by office. */
export function GovVisual() {
  const grid = Array.from({ length: 30 }, (_, i) => ({ x: 330 + (i % 6) * 34, y: 150 + Math.floor(i / 6) * 50 }));
  return (
    <Frame label="A single pilot office, a sign-off gate, then a phased rollout lighting offices one by one" c="var(--gold)">
      <circle className="lv-core" cx="92" cy="260" r="34" />
      <Mono x={92} y={316} a="middle" o={0.7}>
        Pilot
      </Mono>
      <Mono x={92} y={334} a="middle" o={0.5}>
        one office
      </Mono>
      <line className="lv-ray" x1="126" y1="260" x2="222" y2="260" />
      <line className="lv-flow" x1="126" y1="260" x2="222" y2="260" />
      <rect className="lv-gate-v" x="222" y="196" width="16" height="128" rx="8" />
      <Mono x={230} y={180} a="middle">
        Officer signs off
      </Mono>
      <line className="lv-ray" x1="238" y1="260" x2="310" y2="260" />
      {grid.map((g, i) => (
        <circle key={i} className="lv-office" style={{ animationDelay: `${0.8 + i * 0.07}s` }} cx={g.x} cy={g.y} r="7" />
      ))}
      <Mono x={330} y={126} o={0.7}>
        Phased rollout
      </Mono>
      <Mono x={330} y={398} o={0.5}>
        Office by office
      </Mono>
    </Frame>
  );
}

/* -------------------------------------------------------------------- mark */
/** For pages without a line of their own: the brand prism, quiet. */
export function PrismMark() {
  const cs = ["var(--acc-pho)", "var(--acc-pha)", "var(--acc-men)", "var(--acc-ent)"];
  return (
    <Frame label="White light entering a prism and leaving as the four lines" c="var(--gold)">
      <line x1="10" y1="370" x2="240" y2="262" stroke="url(#lv-white)" strokeWidth="2.4" />
      {cs.map((c, i) => (
        <g key={i}>
          <line x1="300" y1="262" x2="560" y2={150 + i * 76} stroke={c} strokeOpacity="0.85" strokeWidth="1.6" />
          <line className="lv-flow lv-flow-long" style={{ stroke: c, animationDelay: `${i * 0.4}s` }} x1="300" y1="262" x2="560" y2={150 + i * 76} />
        </g>
      ))}
      <Prism x={270} y={262} s={1.3} />
    </Frame>
  );
}
