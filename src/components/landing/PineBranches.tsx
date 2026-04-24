const C = 'hsl(158 50% 22%)';

const Rosette = ({ cx, cy, r = 6 }: { cx: number; cy: number; r?: number }) => (
  <>
    {Array.from({ length: 14 }, (_, i) => {
      const a = (i * (360 / 14)) * (Math.PI / 180);
      return (
        <line
          key={i}
          x1={cx} y1={cy}
          x2={cx + Math.cos(a) * r}
          y2={cy + Math.sin(a) * r}
          strokeWidth={0.45}
        />
      );
    })}
  </>
);

const Branch = () => (
  <svg
    width={460} height={540}
    viewBox="0 0 460 540"
    fill="none"
    stroke={C}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Главный ствол */}
    <path
      d="M 14 14 C 38 100 63 210 84 322 C 100 408 116 472 124 528"
      strokeWidth={1.5}
    />

    {/* Ветка 1 */}
    <path d="M 32 82 C 76 70 118 53 150 40" strokeWidth={0.9} />
    <Rosette cx={88} cy={64} r={5} />
    <Rosette cx={150} cy={40} r={7} />

    {/* Ветка 2 */}
    <path d="M 50 140 C 95 128 138 111 176 104" strokeWidth={0.9} />
    <Rosette cx={110} cy={120} r={5} />
    <Rosette cx={176} cy={104} r={7} />

    {/* Ветка 3 */}
    <path d="M 64 198 C 107 186 150 173 186 169" strokeWidth={0.9} />
    <Rosette cx={123} cy={181} r={5} />
    <Rosette cx={186} cy={169} r={7} />

    {/* Ветка 4 */}
    <path d="M 74 255 C 116 244 156 234 192 231" strokeWidth={0.9} />
    <Rosette cx={132} cy={242} r={5} />
    <Rosette cx={192} cy={231} r={7} />

    {/* Ветка 5 */}
    <path d="M 81 313 C 122 303 161 296 196 294" strokeWidth={0.9} />
    <Rosette cx={196} cy={294} r={7} />

    {/* Ветка 6 — поменьше */}
    <path d="M 87 370 C 124 362 158 357 188 356" strokeWidth={0.8} />
    <Rosette cx={188} cy={356} r={6} />
  </svg>
);

export const PineBranches = () => (
  <div
    className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    aria-hidden="true"
  >
    {/* Верхний левый угол */}
    <div className="absolute top-0 left-0 opacity-[0.055]">
      <Branch />
    </div>

    {/* Нижний правый угол (повёрнут 180°) */}
    <div className="absolute bottom-0 right-0 rotate-180 opacity-[0.055]">
      <Branch />
    </div>
  </div>
);
