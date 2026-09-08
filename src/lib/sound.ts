/**
 * High-fidelity Payment Sound Synthesizer
 * Uses native Web Audio API to create a crisp, pleasant, and premium
 * "ticking chime" payment confirmation sound with zero external audio assets.
 */

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return null;

    if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
      sharedAudioCtx = new AudioContextClass();
    }

    if (sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }

    return sharedAudioCtx;
  } catch {
    return null;
  }
}

/**
 * Plays an authentic, uplifting "Payment Done" ticking chime.
 * Structure:
 * 1. Crisp initial mechanical "tick / register click" (0.00s - 0.04s)
 * 2. Sweet ascending harmonic chime triad (G5 -> C6 -> E6) with bell resonance (0.05s - 1.25s)
 */
export function playPaymentSuccessSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // --- PHASE 1: Crisp "Tick" / Cash Tock Transient ---
    const tickOsc = ctx.createOscillator();
    const tickGain = ctx.createGain();
    tickOsc.type = "sine";
    tickOsc.frequency.setValueAtTime(1400, now);
    tickOsc.frequency.exponentialRampToValueAtTime(280, now + 0.035);

    tickGain.gain.setValueAtTime(0.3, now);
    tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    tickOsc.connect(tickGain);
    tickGain.connect(ctx.destination);

    tickOsc.start(now);
    tickOsc.stop(now + 0.045);

    // --- PHASE 2: Bell Chime 1 (G5 - 783.99 Hz) ---
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(783.99, now + 0.06);
    gain1.gain.setValueAtTime(0.001, now + 0.06);
    gain1.gain.linearRampToValueAtTime(0.28, now + 0.08);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now + 0.06);
    osc1.stop(now + 0.46);

    // Add a subtle overtone for bell richness
    const overtone1 = ctx.createOscillator();
    const overGain1 = ctx.createGain();
    overtone1.type = "triangle";
    overtone1.frequency.setValueAtTime(1567.98, now + 0.06);
    overGain1.gain.setValueAtTime(0.001, now + 0.06);
    overGain1.gain.linearRampToValueAtTime(0.08, now + 0.08);
    overGain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    overtone1.connect(overGain1);
    overGain1.connect(ctx.destination);
    overtone1.start(now + 0.06);
    overtone1.stop(now + 0.32);

    // --- PHASE 3: Bell Chime 2 (C6 - 1046.50 Hz) ---
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1046.5, now + 0.15);
    gain2.gain.setValueAtTime(0.001, now + 0.15);
    gain2.gain.linearRampToValueAtTime(0.35, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.72);

    // --- PHASE 4: Peak Harmonic Sparkle (E6 - 1318.51 Hz) ---
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(1318.51, now + 0.24);
    gain3.gain.setValueAtTime(0.001, now + 0.24);
    gain3.gain.linearRampToValueAtTime(0.38, now + 0.28);
    // Long, lush reverb-like decay
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);

    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.24);
    osc3.stop(now + 1.28);

    // High shimmer overtone (G6 - 1567.98 Hz)
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(1567.98, now + 0.25);
    shimmerGain.gain.setValueAtTime(0.001, now + 0.25);
    shimmerGain.gain.linearRampToValueAtTime(0.12, now + 0.29);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

    shimmer.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmer.start(now + 0.25);
    shimmer.stop(now + 0.98);
  } catch (e) {
    // Non-intrusive fallback if browser audio policy prevents immediate playback
    console.debug("Audio chime playback:", e);
  }
}

/**
 * Plays a short, crisp UI "tick" / click sound for interactions
 */
export function playTickSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.025);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  } catch {}
}
