function RiceLeaf({ d, fill, className, delay = "0s" }) {
  return (
    <path
      className={className}
      d={d}
      fill={fill}
      style={{ animationDelay: delay }}
    />
  );
}

function Panicle({ cx, cy, gold, className, delay = "0s" }) {
  const grain = gold ? "#e0b14a" : "#c5d9a4";
  const husk = gold ? "#c4892a" : "#8fbf6a";
  const rachis = gold ? "#b8860b" : "#3d7a4a";
  const grains = [];
  for (let i = 0; i < 11; i += 1) {
    const t = i / 10;
    const x = cx + Math.sin(t * 2.4) * (6 + t * 4);
    const y = cy + t * 38;
    grains.push(
      <ellipse
        key={i}
        cx={x}
        cy={y}
        rx={gold ? 3.1 : 2.4}
        ry={gold ? 5.4 : 4.2}
        fill={i % 2 ? husk : grain}
        transform={`rotate(${12 + i * 4} ${x} ${y})`}
      />
    );
  }
  return (
    <g className={className} style={{ animationDelay: delay }}>
      <path d={`M${cx} ${cy - 4} C${cx + 4} ${cy + 10} ${cx + 6} ${cy + 24} ${cx + 2} ${cy + 40}`} fill="none" stroke={rachis} strokeWidth="1.6" strokeLinecap="round" />
      {grains}
    </g>
  );
}

export default function CropPlantAnimation({ stageIndex, pestGlow, reducedMotion }) {
  const on = (from) => (stageIndex >= from ? "is-on" : "");
  const harvest = stageIndex >= 7;
  const grain = stageIndex >= 6;
  const flower = stageIndex >= 5;
  const tiller = stageIndex >= 4;
  const veg = stageIndex >= 3;
  const seedling = stageIndex >= 2;
  const germ = stageIndex >= 1;
  const stemFill = harvest ? "url(#paddy-gold)" : "url(#paddy-stem)";
  const leafA = harvest ? "#c9a44a" : veg ? "#2f7a48" : "#4aa05f";
  const leafB = harvest ? "#d4b45c" : "#246b3e";
  const leafC = harvest ? "#e0c36a" : "#1e5c36";

  const stemH = [0, 48, 92, 168, 198, 228, 236, 236][stageIndex] || 0;

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-forest-100 shadow-card">
      <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
        <span className="grow-leaf-float absolute left-[10%] top-[58%] text-lg">🍃</span>
        <span className="grow-leaf-float absolute right-[14%] top-[64%] text-base" style={{ animationDelay: "4s" }}>🍃</span>
        <span className="grow-leaf-float absolute left-[72%] top-[50%] text-sm" style={{ animationDelay: "7.5s" }}>🍂</span>
      </div>

      <svg viewBox="0 0 480 520" className="mx-auto block h-[min(68vh,580px)] w-full" role="img" aria-label="Paddy crop growing from seed to harvest">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={harvest ? "#f3e2b8" : "#cfe8f4"} />
            <stop offset="55%" stopColor={harvest ? "#f7edd4" : "#e7f4ea"} />
            <stop offset="100%" stopColor="#f4ead6" />
          </linearGradient>
          <radialGradient id="sunburst" cx="82%" cy="12%" r="38%">
            <stop offset="0%" stopColor="#ffe08a" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#ffe08a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7fb392" />
            <stop offset="100%" stopColor="#4e8a66" />
          </linearGradient>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9fd0c4" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#6aa89c" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="soil-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c4a06a" />
            <stop offset="100%" stopColor="#7a5230" />
          </linearGradient>
          <linearGradient id="paddy-stem" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5ea86a" />
            <stop offset="50%" stopColor="#2d6a4f" />
            <stop offset="100%" stopColor="#1b4332" />
          </linearGradient>
          <linearGradient id="paddy-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e8c15a" />
            <stop offset="100%" stopColor="#9a6b12" />
          </linearGradient>
          <filter id="soft">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#1b4332" floodOpacity="0.18" />
          </filter>
        </defs>

        <rect width="480" height="520" fill="url(#sky)" />
        <circle className="grow-sun-glow" cx="390" cy="64" r="108" fill="url(#sunburst)" />
        <circle cx="394" cy="58" r="26" fill="#f5c542" />
        <circle className="grow-sparkle" cx="372" cy="42" r="3" fill="#fff8dc" />
        <circle className="grow-sparkle" cx="418" cy="70" r="2.2" fill="#fff8dc" style={{ animationDelay: "1s" }} />

        <g className="grow-cloud" fill="#fff" opacity="0.72">
          <ellipse cx="86" cy="78" rx="28" ry="14" />
          <ellipse cx="108" cy="78" rx="20" ry="12" />
          <ellipse cx="68" cy="80" rx="16" ry="10" />
        </g>
        <g className="grow-cloud-2" fill="#fff" opacity="0.55">
          <ellipse cx="210" cy="52" rx="22" ry="11" />
          <ellipse cx="228" cy="52" rx="14" ry="9" />
        </g>

        <path d="M-10 310 C80 250 150 270 240 248 C330 226 400 260 500 230 L500 360 L-10 360 Z" fill="url(#hill)" opacity="0.45" />
        <path d="M-10 340 C90 300 180 318 260 300 C350 280 420 310 500 292 L500 380 L-10 380 Z" fill="#5f9570" opacity="0.28" />

        <ellipse className="grow-ripple" cx="240" cy="448" rx="210" ry="36" fill="url(#water)" />
        <ellipse cx="240" cy="456" rx="200" ry="28" fill="url(#soil-top)" />
        <ellipse cx="240" cy="448" rx="168" ry="14" fill="#5c3d28" opacity="0.28" />
        <path d="M70 448 Q150 436 240 442 T410 448" fill="none" stroke="#e8d4ad" strokeWidth="2" opacity="0.35" />

        <g filter="url(#soft)" className={reducedMotion ? "" : "grow-plant-sway"}>
          {/* Seed */}
          <ellipse className={`grow-stage ${on(0)}`} cx="240" cy="430" rx="11" ry="7.5" fill="#6a4022" />
          <ellipse className={`grow-stage ${on(0)}`} cx="237" cy="428" rx="3" ry="2" fill="#8a5a32" opacity="0.7" />
          <path className={`grow-stage grow-seed-split ${stageIndex === 1 ? "is-on" : ""}`} d="M230 430 Q240 418 250 430" fill="none" stroke="#4a2c18" strokeWidth="1.5" />

          {/* Roots */}
          <g className={`grow-stage ${on(1)}`} fill="none" stroke="#8d6744" strokeWidth="1.7" strokeLinecap="round">
            <path className={germ ? "grow-root-draw" : ""} d="M240 436 C236 456 226 472 218 488" />
            <path className={germ ? "grow-root-draw" : ""} d="M240 438 C248 458 258 472 266 486" style={{ animationDelay: "0.15s" }} />
            <path d="M240 440 C240 460 242 474 244 490" />
            <path d="M232 458 C224 468 216 476 210 482" opacity="0.7" />
            <path d="M250 458 C258 468 266 476 272 482" opacity="0.7" />
          </g>

          {/* Coleoptile / main stem */}
          <path
            className={`grow-stage grow-rise ${on(1)}`}
            d={`M240 428 C242 ${428 - stemH * 0.45} 238 ${428 - stemH * 0.78} 240 ${428 - stemH}`}
            fill="none"
            stroke={stemFill}
            strokeWidth={veg ? 6.5 : germ ? 3.2 : 2.2}
            strokeLinecap="round"
          />

          {/* Seedling leaves */}
          <RiceLeaf
            className={`grow-stage grow-unfurl ${on(2)}`}
            delay="0.05s"
            fill={leafA}
            d="M240 368 C210 360 186 348 164 328 C176 336 198 348 240 356 Z"
          />
          <RiceLeaf
            className={`grow-stage grow-unfurl-right ${on(2)}`}
            delay="0.18s"
            fill={leafA}
            d="M240 366 C270 356 296 344 318 322 C306 332 282 346 240 354 Z"
          />

          {/* Vegetative blades */}
          {seedling && veg && (
            <>
              <RiceLeaf className={`grow-stage grow-unfurl ${on(3)}`} delay="0.05s" fill={leafB} d="M238 320 C196 300 150 272 118 236 C138 252 176 286 238 304 Z" />
              <RiceLeaf className={`grow-stage grow-unfurl-right ${on(3)}`} delay="0.2s" fill={leafB} d="M242 312 C286 290 332 260 364 220 C344 240 304 276 242 296 Z" />
              <RiceLeaf className={`grow-stage grow-unfurl ${on(3)}`} delay="0.32s" fill={leafC} d="M239 268 C204 246 168 214 142 176 C160 196 192 234 239 252 Z" />
              <RiceLeaf className={`grow-stage grow-unfurl-right ${on(3)}`} delay="0.44s" fill={leafC} d="M241 258 C278 234 318 202 344 164 C326 186 290 226 241 244 Z" />
              <RiceLeaf className={`grow-stage grow-unfurl ${on(3)}`} delay="0.55s" fill={leafA} d="M240 220 C218 198 196 168 180 138 C194 156 214 186 240 206 Z" />
              <RiceLeaf className={`grow-stage grow-unfurl-right ${on(3)}`} delay="0.65s" fill={leafA} d="M240 212 C264 190 288 160 304 128 C290 148 268 180 240 200 Z" />
            </>
          )}

          {/* Tillers */}
          <g className={`${reducedMotion ? "" : "grow-tiller-l"} grow-stage grow-rise ${on(4)}`}>
            <path d="M240 424 C208 360 188 300 176 232" fill="none" stroke={stemFill} strokeWidth="4.4" strokeLinecap="round" />
            <RiceLeaf className={`grow-stage grow-unfurl ${on(4)}`} fill={leafB} d="M178 280 C146 262 118 236 96 204 C114 222 142 250 178 266 Z" />
            <RiceLeaf className={`grow-stage grow-unfurl ${on(4)}`} delay="0.2s" fill={leafC} d="M176 246 C150 220 128 188 112 154 C128 176 150 210 176 232 Z" />
            {flower && <Panicle cx={172} cy={210} gold={grain} className={`grow-stage grow-droop ${on(5)}`} delay="0.15s" />}
          </g>
          <g className={`${reducedMotion ? "" : "grow-tiller-r"} grow-stage grow-rise ${on(4)}`}>
            <path d="M240 424 C274 358 296 298 310 228" fill="none" stroke={stemFill} strokeWidth="4.4" strokeLinecap="round" />
            <RiceLeaf className={`grow-stage grow-unfurl-right ${on(4)}`} fill={leafB} d="M308 276 C340 256 368 230 390 198 C372 218 344 248 308 264 Z" />
            <RiceLeaf className={`grow-stage grow-unfurl-right ${on(4)}`} delay="0.2s" fill={leafC} d="M310 242 C338 216 360 184 376 150 C360 172 338 206 310 228 Z" />
            {flower && <Panicle cx={314} cy={206} gold={grain} className={`grow-stage grow-droop ${on(5)}`} delay="0.28s" />}
          </g>
          {tiller && (
            <g className={`grow-stage grow-rise ${on(4)}`}>
              <path d="M240 424 C220 370 210 328 204 286" fill="none" stroke={stemFill} strokeWidth="3.2" strokeLinecap="round" />
              <path d="M240 424 C262 368 274 326 282 282" fill="none" stroke={stemFill} strokeWidth="3.2" strokeLinecap="round" />
            </g>
          )}

          {/* Main panicle */}
          {flower && (
            <Panicle cx={240} cy={428 - stemH + 8} gold={grain || harvest} className={`grow-stage grow-droop ${on(5)}`} />
          )}
        </g>

        {pestGlow && stageIndex >= 4 && stageIndex <= 5 && (
          <g>
            <rect x="188" y="250" width="104" height="78" rx="14" fill="none" stroke="#b45309" strokeWidth="2" strokeDasharray="7 5" />
            <text x="240" y="242" textAnchor="middle" fontSize="10" fill="#9a3412" fontWeight="700">
              possible pest zone
            </text>
          </g>
        )}
      </svg>

      <p className="absolute bottom-3 left-4 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-forest-800 backdrop-blur">
        {["Seed in soil", "Germination", "First leaves", "Vegetative canopy", "Tillering", "Flowering panicles", "Grain filling", "Golden harvest"][stageIndex]}
      </p>
    </div>
  );
}
