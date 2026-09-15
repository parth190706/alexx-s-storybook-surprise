import { useCallback, useEffect, useRef, useState } from "react";

type Cue = "pop" | "pluck" | "hit" | "chime" | "spin" | "catch" | "snap" | "flame" | "blow" | "sparkle";

export function useBirthdayAudio() {
  const contextRef = useRef<AudioContext | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);

  const tone = useCallback((frequency: number, duration = 0.18, volume = 0.08, type: OscillatorType = "sine", delay = 0) => {
    const context = contextRef.current;
    if (!context || muted) return;
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.04);
  }, [muted]);

  const scheduleMusic = useCallback((context: AudioContext, gain: GainNode) => {
    const chords = [[261.63, 329.63, 392], [220, 261.63, 329.63], [174.61, 220, 293.66], [196, 246.94, 329.63]];
    let step = 0;
    const playChord = () => {
      if (context.state === "closed") return;
      const now = context.currentTime;
      const chord = chords[step % chords.length] ?? chords[0];
      chord?.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        const filter = context.createBiquadFilter();
        oscillator.type = index === 0 ? "sine" : "triangle";
        oscillator.frequency.value = frequency / 2;
        filter.type = "lowpass";
        filter.frequency.value = 900;
        envelope.gain.setValueAtTime(0.0001, now);
        envelope.gain.exponentialRampToValueAtTime(0.032, now + 0.7);
        envelope.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);
        oscillator.connect(filter).connect(envelope).connect(gain);
        oscillator.start(now);
        oscillator.stop(now + 5);
      });
      if (step % 2 === 0) {
        const bell = chord?.[1] ?? 329.63;
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = bell * 2;
        envelope.gain.setValueAtTime(0.018, now + 0.3);
        envelope.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
        oscillator.connect(envelope).connect(gain);
        oscillator.start(now + 0.3);
        oscillator.stop(now + 1.9);
      }
      step += 1;
      timerRef.current = window.setTimeout(playChord, 4200);
    };
    playChord();
  }, []);

  const unlock = useCallback(async () => {
    if (typeof window === "undefined") return;
    let context = contextRef.current;
    if (!context) {
      context = new AudioContext();
      contextRef.current = context;
      const gain = context.createGain();
      gain.gain.value = muted ? 0 : 0.7;
      gain.connect(context.destination);
      musicGainRef.current = gain;
      scheduleMusic(context, gain);
    }
    if (context.state === "suspended") await context.resume();
    setReady(true);
  }, [muted, scheduleMusic]);

  const play = useCallback((cue: Cue) => {
    const map: Record<Cue, [number, number, number, OscillatorType]> = {
      pop: [150, 0.12, 0.08, "square"], pluck: [392, 0.24, 0.07, "triangle"],
      hit: [659, 0.42, 0.09, "sine"], chime: [523, 0.8, 0.1, "sine"],
      spin: [440, 0.08, 0.035, "triangle"], catch: [330, 0.22, 0.07, "sine"],
      snap: [494, 0.2, 0.07, "triangle"], flame: [784, 0.3, 0.05, "sine"],
      blow: [110, 0.45, 0.04, "sawtooth"], sparkle: [988, 0.5, 0.05, "sine"],
    };
    const values = map[cue];
    tone(...values);
    if (cue === "chime" || cue === "hit" || cue === "sparkle") tone(values[0] * 1.5, values[1], values[2] * 0.7, "sine", 0.1);
  }, [tone]);

  const toggle = useCallback(() => {
    setMuted((value) => {
      const next = !value;
      const context = contextRef.current;
      const gain = musicGainRef.current;
      if (context && gain) gain.gain.setTargetAtTime(next ? 0 : 0.7, context.currentTime, 0.08);
      return next;
    });
  }, []);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    void contextRef.current?.close();
  }, []);

  return { muted, ready, unlock, toggle, play };
}