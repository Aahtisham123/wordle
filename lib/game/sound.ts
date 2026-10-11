let context: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!context) context = new Ctx();
  return context;
}

export function playSound(kind: "tap" | "bad" | "win", enabled: boolean) {
  if (!enabled) return;
  const ctx = audio();
  if (!ctx) return;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  const now = ctx.currentTime;
  oscillator.frequency.value = kind === "win" ? 660 : kind === "bad" ? 180 : 480;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(kind === "tap" ? 0.03 : 0.05, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === "win" ? 0.28 : 0.12));
  oscillator.start(now);
  oscillator.stop(now + 0.3);
}

export function vibrateKeys(enabled: boolean) {
  if (!enabled || typeof navigator === "undefined" || !navigator.vibrate) return;
  navigator.vibrate(12);
}
