const signals = [
  { x: "31%", y: "38%", delay: "0s" },
  { x: "67%", y: "29%", delay: "1.4s" },
  { x: "72%", y: "63%", delay: "2.2s" },
  { x: "43%", y: "72%", delay: ".8s" },
];

export function Radar() {
  return (
    <div className="radar-block">
      <div className="radar" role="img" aria-label="신호를 탐색하며 천천히 회전하는 레이더">
        <div className="radar-ring ring-1" />
        <div className="radar-ring ring-2" />
        <div className="radar-cross horizontal" />
        <div className="radar-cross vertical" />
        <div className="radar-sweep" />
        {signals.map((signal, index) => (
          <span key={index} className="signal" style={{ left: signal.x, top: signal.y, animationDelay: signal.delay }} />
        ))}
        <span className="radar-center" />
      </div>
      <div className="radar-readout" aria-hidden="true">
        <span>RANGE 40 NM</span><span>SWEEP 06 RPM</span>
      </div>
    </div>
  );
}
