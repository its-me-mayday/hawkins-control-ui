import { useRef } from "react";

type AmbienceMode = "tape" | "pulse";

export function useAmbience() {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const srcRef = useRef<AudioNode | null>(null); // root node for current mode graph
  const playingRef = useRef<boolean>(false);

  const modeRef = useRef<AmbienceMode>("tape");
  const enabledRef = useRef<boolean>(false);
  const volumeRef = useRef<number>(0.25);

  // keep nodes for pulse graph so we can stop cleanly
  const pulse = useRef<{
    o1?: OscillatorNode;
    o2?: OscillatorNode;
    lp?: BiquadFilterNode;
    lfoF?: OscillatorNode;
    lfoFDepth?: GainNode;
    lfoA?: OscillatorNode;
    lfoADepth?: GainNode;
    delay?: DelayNode;
    fb?: GainNode;
  }>({});

  const ensureCtx = () =>
    (ctxRef.current ??= new (window.AudioContext || (window as any).webkitAudioContext)());

  const arm = async () => {
    const ctx = ensureCtx();
    if (ctx.state !== "running") {
      try { await ctx.resume(); } catch {}
    }
  };

  const setEnabled = async (on: boolean) => {
    enabledRef.current = on;
    if (on) start();
    else stop();
  };

  const setVolume = (v: number) => {
    volumeRef.current = Math.max(0, Math.min(1, v));
    if (gainRef.current) gainRef.current.gain.value = volumeRef.current;
  };

  const setMode = (m: AmbienceMode) => {
    if (modeRef.current === m) return;
    modeRef.current = m;
    if (playingRef.current) {
      stop();
      start();
    }
  };

  const start = async () => {
    if (playingRef.current) return;
    await arm();
    const ctx = ensureCtx();

    const gain = ctx.createGain();
    gain.gain.value = volumeRef.current;
    gainRef.current = gain;

    let root: AudioNode | null = null;

    if (modeRef.current === "tape") {
      // ── Tape/Air: filtered looped noise
      const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.3;

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuf;
      noise.loop = true;

      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 220;
      bp.Q.value = 1.2;

      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 1200;

      noise.connect(bp);
      bp.connect(lp);
      lp.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      root = noise;
    } else {
      // ── Pulse Pad: 2 detuned saws → lowpass; slow LFO on cutoff & slight tremolo; tiny delay
      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      o1.type = "sawtooth";
      o2.type = "sawtooth";

      // base note ~ A2 (110 Hz) slightly above to reduce rumble; detune subtly
      o1.frequency.value = 135;         // ~C#3
      o2.frequency.value = 135 * 0.997; // tiny detune

      const mix = ctx.createGain();
      mix.gain.value = 0.25;

      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 900;
      lp.Q.value = 0.0001;

      // LFO for filter cutoff (slow sweep 0.07 Hz)
      const lfoF = ctx.createOscillator();
      lfoF.type = "sine";
      lfoF.frequency.value = 0.07;

      const lfoFDepth = ctx.createGain();
      lfoFDepth.gain.value = 300; // +/- 300 Hz around base cutoff

      // LFO for gentle amplitude wobble (0.11 Hz)
      const lfoA = ctx.createOscillator();
      lfoA.type = "sine";
      lfoA.frequency.value = 0.11;

      const lfoADepth = ctx.createGain();
      lfoADepth.gain.value = 0.06; // subtle tremolo

      const amp = ctx.createGain();
      amp.gain.value = 0.9; // base before tremolo

      // tiny delay for space (no reverb to keep it light)
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.18;

      const fb = ctx.createGain();
      fb.gain.value = 0.12;

      // wiring
      o1.connect(mix);
      o2.connect(mix);
      mix.connect(lp);
      lp.connect(amp);
      amp.connect(delay);
      delay.connect(fb);
      fb.connect(delay);
      delay.connect(gain);
      gain.connect(ctx.destination);

      // LFO routings
      lfoF.connect(lfoFDepth);
      lfoFDepth.connect(lp.frequency);
      lfoA.connect(lfoADepth);
      lfoADepth.connect(amp.gain);

      o1.start();
      o2.start();
      lfoF.start();
      lfoA.start();

      root = mix;

      // keep refs to stop later
      pulse.current = { o1, o2, lp, lfoF, lfoFDepth, lfoA, lfoADepth, delay, fb };
    }

    srcRef.current = root!;
    playingRef.current = true;
  };

  const stop = () => {
    const ctx = ctxRef.current;
    if (!playingRef.current || !ctx) return;

    if (modeRef.current === "tape") {
      const node = srcRef.current as AudioBufferSourceNode | null;
      if (node) {
        try { node.stop(); } catch {}
        node.disconnect();
      }
    } else {
      const p = pulse.current;
      try { p.o1?.stop(); } catch {}
      try { p.o2?.stop(); } catch {}
      try { p.lfoF?.stop(); } catch {}
      try { p.lfoA?.stop(); } catch {}
      [p.o1, p.o2, p.lfoF, p.lfoA].forEach((n) => n?.disconnect());
      [p.lp, p.lfoFDepth, p.lfoADepth, p.delay, p.fb].forEach((n) => n?.disconnect());
      pulse.current = {};
    }

    gainRef.current?.disconnect();
    gainRef.current = null;

    srcRef.current = null;
    playingRef.current = false;
  };

  const getMode = () => modeRef.current;

  return { setEnabled, setVolume, setMode, getMode, arm };
}
