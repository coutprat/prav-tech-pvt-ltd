/**
 * A soft generative pad for the MENNIE film, made in Web Audio rather than
 * shipped as a file: nothing to download before it can start, no licence,
 * and it can follow the film — brightening with the sunrise and marking each
 * interface beat with a chime.
 *
 * Browsers only allow audio after a gesture, so nothing here runs until
 * start() is called from a click or key press.
 */

/** D major add9, spread wide: open, unresolved, calm. */
const PAD_HZ = [73.42, 110.0, 146.83, 220.0, 329.63, 369.99];
/** D major pentatonic, two octaves up — the chimes. */
const CHIME_HZ = [587.33, 659.25, 739.99, 880.0, 987.77, 1174.66];

const MASTER = 0.16;

export class AmbientPad {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private wet: GainNode | null = null;
  private nodes: AudioScheduledSourceNode[] = [];
  private running = false;

  get isRunning() {
    return this.running;
  }

  /** Must be called from a user gesture. Safe to call repeatedly. */
  async start() {
    if (!this.ctx) this.build();
    const ctx = this.ctx!;
    if (ctx.state === "suspended") await ctx.resume();
    if (this.running) return;
    this.running = true;
    const g = this.master!.gain;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(g.value, ctx.currentTime);
    g.linearRampToValueAtTime(MASTER, ctx.currentTime + 2.5);
  }

  /** Fades out, then suspends the context so it costs nothing. */
  stop(fade = 1.2) {
    if (!this.ctx || !this.running) return;
    this.running = false;
    const ctx = this.ctx;
    const g = this.master!.gain;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(g.value, ctx.currentTime);
    g.linearRampToValueAtTime(0, ctx.currentTime + fade);
    window.setTimeout(() => {
      if (!this.running) void ctx.suspend();
    }, fade * 1000 + 100);
  }

  /** 0..1 through the film: the pad opens up as the sun comes up. */
  setProgress(p: number) {
    if (!this.ctx || !this.filter) return;
    const hz = 420 + Math.pow(Math.max(0, Math.min(1, p)), 1.4) * 2200;
    this.filter.frequency.setTargetAtTime(hz, this.ctx.currentTime, 0.4);
  }

  /** A single soft bell, for a beat in the film. */
  chime(index: number) {
    if (!this.ctx || !this.running) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const f = CHIME_HZ[((index % CHIME_HZ.length) + CHIME_HZ.length) % CHIME_HZ.length];
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.09, t + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
    env.connect(this.wet!);
    env.connect(this.master!);
    // A bell is a fundamental and a few inharmonic partials that die faster.
    [
      [1, 1],
      [2.76, 0.35],
      [5.4, 0.12]
    ].forEach(([mult, amp]) => {
      const o = ctx.createOscillator();
      const a = ctx.createGain();
      o.type = "sine";
      o.frequency.value = f * mult;
      a.gain.value = amp;
      o.connect(a).connect(env);
      o.start(t);
      o.stop(t + 3.4);
    });
  }

  dispose() {
    this.nodes.forEach((n) => {
      try {
        n.stop();
      } catch {
        /* already stopped */
      }
    });
    this.nodes = [];
    void this.ctx?.close();
    this.ctx = null;
    this.running = false;
  }

  private build() {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -18;
    limiter.ratio.value = 4;
    master.connect(limiter).connect(ctx.destination);
    this.master = master;

    // A long, dark room: generated noise with an exponential tail.
    const reverb = ctx.createConvolver();
    reverb.buffer = impulse(ctx, 4.2, 2.6);
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    wet.connect(reverb).connect(master);
    this.wet = wet;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    filter.Q.value = 0.6;
    filter.connect(master);
    filter.connect(wet);
    this.filter = filter;

    // The cutoff breathes slowly on its own, so a still page still moves.
    const lfo = ctx.createOscillator();
    const lfoAmt = ctx.createGain();
    lfo.frequency.value = 0.05;
    lfoAmt.gain.value = 160;
    lfo.connect(lfoAmt).connect(filter.frequency);
    lfo.start();
    this.nodes.push(lfo);

    PAD_HZ.forEach((hz, i) => {
      const voice = ctx.createGain();
      voice.gain.value = 0.0;
      voice.connect(filter);
      // Each voice swells on its own slow cycle, so the chord never sits still.
      const swell = ctx.createOscillator();
      const swellAmt = ctx.createGain();
      swell.frequency.value = 0.03 + i * 0.011;
      swellAmt.gain.value = 0.045;
      swell.connect(swellAmt).connect(voice.gain);
      voice.gain.setValueAtTime(0.06, ctx.currentTime);
      swell.start();
      this.nodes.push(swell);

      // Two slightly detuned oscillators per note: warmth without beating.
      [-4, 4].forEach((cents, k) => {
        const o = ctx.createOscillator();
        o.type = k === 0 ? "sine" : "triangle";
        o.frequency.value = hz;
        o.detune.value = cents;
        const pan = ctx.createStereoPanner();
        pan.pan.value = (i / (PAD_HZ.length - 1)) * 1.2 - 0.6 + (k ? 0.1 : -0.1);
        o.connect(pan).connect(voice);
        o.start();
        this.nodes.push(o);
      });
    });
  }
}

function impulse(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buf;
}
