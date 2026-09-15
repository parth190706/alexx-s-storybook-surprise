import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowRight, Music, Music2, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBirthdayAudio } from "./useBirthdayAudio";

const chapterNames = ["Morning", "Balloons", "Archery", "Midnight", "Wishes", "Ice cream", "Cake", "Candles", "For Alexx"];
const balloonNotes = ["birthday tax.", "nice try 😭", "that one had plans.", "pop goes the dignity.", "very mature, alexx.", "free serotonin!", "okay, menace."];
const wishes = ["Peaceful Year", "A Surprise", "A Quiet Win", "A Little Luck", "A Big Moment", "Unlimited Sweetness"];

type AudioApi = ReturnType<typeof useBirthdayAudio>;
type SceneProps = { onNext: () => void; audio: AudioApi; secret: (message: string) => void };

function ContinueButton({ onClick, children = "TURN THE PAGE" }: { onClick: () => void; children?: string }) {
  return <Button onClick={onClick} className="story-button">{children}<ArrowRight /></Button>;
}

function SceneHeading({ chapter, title, subtitle }: { chapter?: string; title: string; subtitle: string }) {
  return <header className="scene-heading">
    {chapter && <p className="chapter-kicker">{chapter}</p>}
    <h1 tabIndex={-1}>{title}</h1>
    <p>{subtitle}</p>
  </header>;
}

function Opening({ onNext, audio }: SceneProps) {
  const start = async () => { await audio.unlock(); audio.play("sparkle"); onNext(); };
  return <section className="story-scene opening-scene" aria-label="A birthday morning">
    <div className="sun-haze" /><div className="morning-hill hill-one" /><div className="morning-hill hill-two" />
    {Array.from({ length: 16 }, (_, i) => <i key={i} className="dust" style={{ "--i": i } as React.CSSProperties} />)}
    <div className="opening-copy">
      <p className="tiny-date">15 · 09 · 2026</p>
      <h1><span>hey kriti</span><small>aka alexx...</small></h1>
      <p className="promise">I made you a little world.<br />You only have to touch it.</p>
      <Button onClick={start} className="start-button">TAP TO START <Sparkles /></Button>
    </div>
    <p className="opening-footnote">best experienced with sound, mischief & one free hand</p>
  </section>;
}

function Balloons({ onNext, audio }: SceneProps) {
  const [popped, setPopped] = useState<number[]>([]);
  const [note, setNote] = useState("");
  const complete = popped.length >= 7;
  const pop = (i: number) => {
    if (popped.includes(i)) return;
    setPopped((p) => [...p, i]);
    setNote(i === 6 ? "you found the suspicious one ✦" : balloonNotes[i] ?? "pop!");
    audio.play(i === 6 ? "sparkle" : "pop");
  };
  return <section className="story-scene balloon-scene">
    <SceneHeading chapter="CHAPTER ONE" title="The Sky is Full of Trouble" subtitle="Pop the balloons. Apparently they know something." />
    <div className="balloon-field" aria-label="Pop seven balloons">
      {Array.from({ length: 7 }, (_, i) => <button key={i} aria-label={`Pop balloon ${i + 1}`} onClick={() => pop(i)} className={`balloon balloon-${i} ${popped.includes(i) ? "is-popped" : ""}`}><span>{i === 6 ? "✦" : ""}</span></button>)}
      {popped.flatMap((n) => Array.from({ length: 7 }, (_, i) => <i key={`${n}-${i}`} className="pop-spark" style={{ "--x": `${(i - 3) * 13}px`, "--y": `${-20 - (i % 3) * 12}px`, left: `${15 + n * 11}%` } as React.CSSProperties} />))}
    </div>
    <p className="funny-note" aria-live="polite">{note || `${popped.length} / 7 popped`}</p>
    {complete && <div className="reward-card reveal"><span>FIRST LITTLE THING</span><strong>You make ordinary days feel less ordinary.</strong><ContinueButton onClick={onNext} /></div>}
  </section>;
}

function Archery({ onNext, audio, secret }: SceneProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [pull, setPull] = useState({ x: 80, y: 230 });
  const [dragging, setDragging] = useState(false);
  const [flying, setFlying] = useState(false);
  const [hit, setHit] = useState(false);
  const point = (event: ReactPointerEvent) => {
    const box = stageRef.current?.getBoundingClientRect();
    if (!box) return;
    setPull({ x: Math.max(22, Math.min(115, event.clientX - box.left)), y: Math.max(145, Math.min(310, event.clientY - box.top)) });
  };
  const release = () => {
    if (!dragging) return;
    setDragging(false); setFlying(true); audio.play("pluck");
    window.setTimeout(() => { setHit(true); setFlying(false); audio.play("hit"); }, 650);
  };
  return <section className="story-scene archery-scene">
    <SceneHeading chapter="CHAPTER TWO" title="One Perfect Shot" subtitle="Pull the glowing string and let the arrow go." />
    <div ref={stageRef} className="archery-range" onPointerMove={(e) => dragging && point(e)} onPointerUp={release} onPointerCancel={release}>
      <div className="dusk-cloud cloud-a" /><div className="dusk-cloud cloud-b" />
      <button className="target" aria-label="Glowing target" onClick={() => secret("bullseye says: show-off.")}><i /><i /><i /></button>
      <svg className="bow" viewBox="0 0 150 330" aria-hidden="true"><path d="M38 20 Q145 165 38 310" /><line x1="38" y1="20" x2={pull.x} y2={pull.y} /><line x1={pull.x} y1={pull.y} x2="38" y2="310" /><line className={`arrow ${flying ? "arrow-flying" : ""}`} x1={pull.x - 8} y1={pull.y} x2={pull.x + 78} y2={pull.y} /></svg>
      <button className="string-handle" aria-label="Pull bow string" style={{ left: pull.x, top: pull.y }} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); point(e); }} onPointerMove={(e) => dragging && point(e)} onPointerUp={release} />
    </div>
    {hit && <div className="paper-flower reveal" onClick={() => secret("the flower kept a tiny extra wish for you.")}><div className="petals">✿</div><p>YOU HIT THE RIGHT ONE.<br /><span>Somehow you always manage to make ordinary things more fun. Keep that little spark of yours.</span></p><ContinueButton onClick={onNext} /></div>}
  </section>;
}

function Midnight({ onNext, audio, secret }: SceneProps) {
  const faceRef = useRef<HTMLDivElement>(null);
  const [minutes, setMinutes] = useState(0);
  const [done, setDone] = useState(false);
  const update = (event: ReactPointerEvent) => {
    const box = faceRef.current?.getBoundingClientRect(); if (!box) return;
    const angle = Math.atan2(event.clientY - (box.top + box.height / 2), event.clientX - (box.left + box.width / 2)) * 180 / Math.PI + 90;
    const normalized = (angle + 360) % 360; const next = Math.round(normalized / 6) % 60; setMinutes(next);
  };
  const check = () => { if (minutes <= 2 || minutes >= 58) { setMinutes(0); setDone(true); audio.play("chime"); } };
  const night = 1 - Math.min(minutes, 30) / 30;
  return <section className="story-scene midnight-scene" style={{ "--night": night } as React.CSSProperties}>
    <SceneHeading chapter="CHAPTER THREE" title="When the Clock Says Midnight" subtitle="Turn the minute hand until the whole world reaches twelve." />
    <button className="moon" onClick={() => secret("the moon whispers: she looks happier tonight.")} aria-label="Moon secret">☾</button>
    <div className="night-stars">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}</div>
    <div ref={faceRef} className="clock-face" onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && update(e)} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); update(e); }} onPointerUp={check}>
      {Array.from({ length: 12 }, (_, i) => <b key={i} style={{ transform: `rotate(${i * 30}deg)` }}>{i === 0 ? 12 : i}</b>)}
      <span className="clock-hand hour" /><span className="clock-hand minute" style={{ transform: `rotate(${minutes * 6}deg)` }} /><span className="clock-pin" />
    </div>
    <p className="clock-time">11:{String(minutes).padStart(2, "0")}</p>
    {done && <div className="reward-card reveal"><span>THE MIDNIGHT WISH</span><strong>May life be softer with you this year.</strong><ContinueButton onClick={onNext} /></div>}
  </section>;
}

function WishWheel({ onNext, audio, secret }: SceneProps) {
  const [rotation, setRotation] = useState(0); const [spins, setSpins] = useState(0); const [result, setResult] = useState(""); const drag = useRef<{ x: number; t: number } | null>(null);
  const spin = (force = 760) => {
    if (spins >= 3) return;
    const next = spins + 1;
    setSpins(next);
    setRotation((r) => r + force + next * 113);
    setResult(next === 3 ? "THE ONE I ACTUALLY WANTED YOU TO GET" : "the wheel is thinking...");
    audio.play("spin");
    window.setTimeout(() => {
      if (next < 3) setResult(wishes[(next * 2 + 1) % wishes.length] ?? "A Beautiful Year");
      audio.play("sparkle");
    }, 1250);
  };
  return <section className="story-scene wheel-scene">
    <SceneHeading chapter="CHAPTER FOUR" title="The Wish Wheel" subtitle="Three spins. The wheel has opinions." />
    <div className="wheel-wrap"><span className="wheel-pointer">▼</span><div className="wish-wheel" style={{ transform: `rotate(${rotation}deg)` }} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); drag.current = { x: e.clientX, t: performance.now() }; }} onPointerUp={(e) => { const start = drag.current; if (start) spin(Math.max(600, Math.abs(e.clientX - start.x) * 9)); drag.current = null; }}>
      {wishes.map((wish, i) => <span key={wish} style={{ transform: `rotate(${i * 60}deg) translateY(-39%)` }}>{wish}</span>)}<button aria-label="Wheel secret" onClick={() => secret("rigged? only emotionally.")}>✦</button>
    </div></div>
    <div className="spin-dots" aria-label={`${spins} of 3 spins used`}>{[0, 1, 2].map((n) => <i key={n} className={n < spins ? "filled" : ""} />)}</div>
    {spins < 3 && <Button className="story-button" onClick={() => spin()}>SPIN {spins ? "AGAIN" : "THE WHEEL"}</Button>}
    {(result || spins >= 3) && <div className="wish-result reveal"><small>{spins >= 3 ? "final wish" : "the wheel chose"}</small><strong>{spins >= 3 ? "THE ONE I ACTUALLY WANTED YOU TO GET" : result}</strong>{spins >= 3 && <><p>I hope you always find your way back to yourself.</p><ContinueButton onClick={onNext} /></>}</div>}
  </section>;
}

function IceCream({ onNext, audio }: SceneProps) {
  const [caught, setCaught] = useState(0); const [bowlX, setBowlX] = useState(50); const [scoops, setScoops] = useState(() => Array.from({ length: 8 }, (_, i) => ({ id: i, x: 12 + (i * 29) % 78, delay: i * 0.42 })));
  const done = caught >= 6;
  const move = (event: ReactPointerEvent<HTMLDivElement>) => { const box = event.currentTarget.getBoundingClientRect(); setBowlX(Math.max(12, Math.min(88, ((event.clientX - box.left) / box.width) * 100))); };
  const catchScoop = (id: number) => { if (done) return; setScoops((items) => items.filter((s) => s.id !== id)); setCaught((v) => v + 1); audio.play("catch"); };
  return <section className="story-scene icecream-scene">
    <SceneHeading chapter="CHAPTER FIVE" title="Ice Cream Emergency" subtitle="Move the bowl. Save dessert. This is serious." />
    <div className="ice-game" onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); move(e); }} onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && move(e)}>
      {scoops.map((s, index) => <button key={s.id} onAnimationIteration={() => bowlX > s.x - 19 && bowlX < s.x + 19 && catchScoop(s.id)} onClick={() => catchScoop(s.id)} className={`falling-scoop scoop-${index % 3}`} style={{ left: `${s.x}%`, animationDelay: `${s.delay}s` }} aria-label="Catch falling ice cream">●<span /></button>)}
      <div className={`ice-bowl ${done ? "bowl-full" : ""}`} style={{ left: `${bowlX}%` }}><div>{Array.from({ length: caught }, (_, i) => <i key={i} />)}</div></div>
      {done && <div className="sprinkle-rain">{Array.from({ length: 28 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}</div>}
    </div>
    <p className="catch-count">{done ? "EMERGENCY AVERTED" : `${caught} / 6 scoops rescued`}</p>
    {done && <ContinueButton onClick={onNext}>CLAIM THE GIANT SCOOP</ContinueButton>}
  </section>;
}

const cakeLayers = ["sponge", "cream", "sponge", "frosting"];
function CakeBuilder({ onNext, audio, secret }: SceneProps) {
  const [placed, setPlaced] = useState(0); const [decorated, setDecorated] = useState<string[]>([]);
  const dropLayer = () => { if (placed < 4) { setPlaced((v) => v + 1); audio.play("snap"); } };
  const addDecor = (name: string) => { if (!decorated.includes(name) && placed === 4) { setDecorated((d) => [...d, name]); audio.play("sparkle"); } };
  const done = decorated.length === 3;
  return <section className="story-scene cake-scene">
    <SceneHeading chapter="CHAPTER SIX" title="Build Something Sweet" subtitle={placed < 4 ? "Drag each layer onto the cake stand, in order." : "Now add the important bits."} />
    <div className="cake-worktop">
      <div className="ingredient-tray">
        {placed < 4 ? <button draggable onDragEnd={dropLayer} onPointerUp={dropLayer} className={`cake-piece piece-${cakeLayers[placed]}`}>{cakeLayers[placed]}</button> : ["strawberry", "sprinkles", "cherry"].map((d) => <button key={d} onClick={() => addDecor(d)} className={`decor decor-${d} ${decorated.includes(d) ? "used" : ""}`}>{d === "strawberry" ? "🍓" : d === "cherry" ? "🍒" : "✦"}</button>)}
      </div>
      <div className="cake-dropzone" onDragOver={(e) => e.preventDefault()} onDrop={dropLayer}>
        <div className="cake-stack">{cakeLayers.slice(0, placed).map((layer, i) => <div key={`${layer}-${i}`} className={`built-layer built-${layer}`} />)}
          {placed === 4 && <div className="cake-decorations">{decorated.includes("strawberry") && <button onClick={() => secret("the strawberry says: leave me alone, i'm decorative.")}>🍓</button>}{decorated.includes("sprinkles") && <span>✦ · ✦ · ✦</span>}{decorated.includes("cherry") && <button onClick={() => secret("the cherry says: naturally, i'm on top.")}>🍒</button>}</div>}
        </div><div className="cake-stand" />
      </div>
    </div>
    <p className="recipe-line">{placed < 4 ? `layer ${placed + 1} of 4 · ${cakeLayers[placed]}` : `${decorated.length} of 3 decorations`}</p>
    {done && <ContinueButton onClick={onNext}>BRING THE CANDLES</ContinueButton>}
  </section>;
}

function Candles({ onNext, audio }: SceneProps) {
  const [candles, setCandles] = useState<number[]>([]); const [lit, setLit] = useState<number[]>([]); const [blown, setBlown] = useState(false); const swipeStart = useRef(0);
  const add = (i: number) => { if (!candles.includes(i)) { setCandles((c) => [...c, i]); audio.play("snap"); } };
  const light = (i: number) => { if (!lit.includes(i)) { setLit((l) => [...l, i]); audio.play("flame"); } };
  const blow = (event: ReactPointerEvent) => { if (lit.length === 5 && Math.abs(event.clientX - swipeStart.current) > 80) { setBlown(true); audio.play("blow"); window.setTimeout(onNext, 1500); } };
  return <section className={`story-scene candles-scene ${lit.length === 5 ? "room-dim" : ""}`} onPointerDown={(e) => { swipeStart.current = e.clientX; }} onPointerUp={blow}>
    <SceneHeading chapter="CHAPTER SEVEN" title="The Last Little Thing" subtitle={candles.length < 5 ? "Put five candles on the cake." : lit.length < 5 ? "Tap every candle to light it." : "Now swipe across the flames. Make it count."} />
    <div className="candle-tray">{[0, 1, 2, 3, 4].map((i) => !candles.includes(i) && <button key={i} onClick={() => add(i)} aria-label={`Place candle ${i + 1}`} style={{ "--i": i } as React.CSSProperties} />)}</div>
    <div className="final-cake">
      <div className="candle-row">{candles.map((i) => <button key={i} onClick={() => light(i)} className={`placed-candle ${lit.includes(i) && !blown ? "lit" : ""}`} aria-label={`Light candle ${i + 1}`}><i /></button>)}</div>
      <div className="final-frosting" /><div className="final-sponge" /><div className="final-plate" />
    </div>
    {blown && <div className="breeze reveal">〰 〰 〰 <span>✦</span></div>}
  </section>;
}

const letter = ["Being your sister has meant a lot of things.", "Random arguments. Unnecessary teasing.", "Laughing at things nobody else would understand.", "Annoying each other for absolutely no reason.", "But somehow... through all of it...", "I wouldn't trade having you as my sister for anything.", "I might not say it all the time...", "but I genuinely care about you.", "And I really hope this year is kind to you.", "More laughter. More stupid little memories.", "More ice cream.", "And a lot of things that make you genuinely happy.", "Happy Birthday, Kriti aka Alexx ❤️", "now go eat the cake."];

function Finale({ audio, secret }: Omit<SceneProps, "onNext">) {
  const [shown, setShown] = useState(0); const [celebrate, setCelebrate] = useState(false);
  useEffect(() => { if (shown >= letter.length) { const t = window.setTimeout(() => { setCelebrate(true); audio.play("sparkle"); }, 700); return () => window.clearTimeout(t); } const t = window.setTimeout(() => setShown((v) => v + 1), shown === 0 ? 500 : 460); return () => window.clearTimeout(t); }, [shown, audio]);
  return <section className="story-scene finale-scene">
    <button className="final-moon" onClick={() => secret("one last secret: you are very, very loved.")} aria-label="Final moon secret">☾</button>
    <div className="final-motifs"><span>🎈</span><span>➶</span><span>✿</span><span>🍨</span><span>🎂</span></div>
    <header className="final-heading"><p>FOR YOU, ALEXX</p><h1>Happy Birthday, Kriti.</h1></header>
    <div className="letter-paper">{letter.slice(0, shown).map((line, i) => <p key={line} className={i === letter.length - 1 ? "letter-signoff" : ""}>{line}</p>)}</div>
    {celebrate && <div className="final-celebration" aria-label="Birthday confetti">{Array.from({ length: 45 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}</div>}
    {celebrate && <div className="closing-mark reveal"><strong>made with entirely too much care</strong><span>♡</span></div>}
  </section>;
}

export function BirthdayStory() {
  const [scene, setScene] = useState(0); const [secretText, setSecretText] = useState(""); const audio = useBirthdayAudio();
  const next = useCallback(() => setScene((v) => Math.min(8, v + 1)), []);
  const secret = useCallback((message: string) => { setSecretText(message); audio.play("sparkle"); window.setTimeout(() => setSecretText(""), 2600); }, [audio]);
  const scenes = useMemo(() => [<Opening onNext={next} audio={audio} secret={secret} />, <Balloons onNext={next} audio={audio} secret={secret} />, <Archery onNext={next} audio={audio} secret={secret} />, <Midnight onNext={next} audio={audio} secret={secret} />, <WishWheel onNext={next} audio={audio} secret={secret} />, <IceCream onNext={next} audio={audio} secret={secret} />, <CakeBuilder onNext={next} audio={audio} secret={secret} />, <Candles onNext={next} audio={audio} secret={secret} />, <Finale audio={audio} secret={secret} />], [next, audio, secret]);
  return <main className="birthday-story">
    {scene > 0 && <nav className="story-controls" aria-label="Story controls"><div className="progress-dots">{chapterNames.map((name, i) => <span key={name} className={i <= scene ? "active" : ""} title={name} />)}</div><Button size="icon" variant="ghost" aria-label={audio.muted ? "Turn music on" : "Turn music off"} onClick={audio.toggle}>{audio.muted ? <Music /> : <Music2 />}</Button></nav>}
    <div key={scene} className="scene-enter">{scenes[scene]}</div>
    {secretText && <div className="secret-toast" role="status">✦ {secretText}</div>}
    {scene === 8 && <Button className="replay-button" variant="ghost" onClick={() => setScene(0)}><RotateCcw /> Replay</Button>}
  </main>;
}