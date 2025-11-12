import { useRef } from "react";

type Amb = {
  ctx: AudioContext;
  master: GainNode;
  padGain: GainNode;
  padLP: BiquadFilterNode;
  chorus: DelayNode;
  chorusFB: GainNode;
  o1: OscillatorNode;
  o2: OscillatorNode;
  tremLfo: OscillatorNode;
  tremAmt: GainNode;
  filtLfo: OscillatorNode;
  filtAmt: GainNode;
  noise: AudioBufferSourceNode;
  noiseHP: BiquadFilterNode;
  noiseLP: BiquadFilterNode;
  noiseGain: GainNode;
};

export function useAmbience80s() {
  const ref = useRef<Amb | null>(null);

  const ensure = () => {
    if (ref.current) return ref.current;
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
    const ctx = new Ctx();

    const master = ctx.createGain();
    master.gain.value = 0.0;
    master.connect(ctx.destination);

    const padGain = ctx.createGain();
    padGain.gain.value = 0.0;

    const padLP = ctx.createBiquadFilter();
    padLP.type = "lowpass";
    padLP.frequency.value = 1200;
    padLP.Q.value = 0.7;

    const chorus = ctx.createDelay();
    chorus.delayTime.value = 0.02;
    const chorusFB = ctx.createGain();
    chorusFB.gain.value = 0.12;

    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    o1.type = "sawtooth";
    o2.type = "sawtooth";
    o1.frequency.value = 196;    // G3
    o2.frequency.value = 196;
    o1.detune.value = -7;
    o2.detune.value = +7;

    const tremLfo = ctx.createOscillator();
    tremLfo.type = "sine";
    tremLfo.frequency.value = 0.09; // ~11s ciclo
    const tremAmt = ctx.createGain();
    tremAmt.gain.value = 0.08;

    const filtLfo = ctx.createOscillator();
    filtLfo.type = "sine";
    filtLfo.frequency.value = 0.05; // ~20s ciclo
    const filtAmt = ctx.createGain();
    filtAmt.gain.value = 180;

    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    noise.loop = true;

    const noiseHP = ctx.createBiquadFilter();
    noiseHP.type = "highpass";
    noiseHP.frequency.value = 180;
    const noiseLP = ctx.createBiquadFilter();
    noiseLP.type = "lowpass";
    noiseLP.frequency.value = 3500;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.01;

    o1.connect(padLP);
    o2.connect(padLP);
    padLP.connect(chorus);
    chorus.connect(chorusFB);
    chorusFB.connect(chorus);
    chorus.connect(padGain);
    padLP.connect(padGain);
    padGain.connect(master);

    tremLfo.connect(tremAmt);
    tremAmt.connect(padGain.gain);

    filtLfo.connect(filtAmt);
    filtAmt.connect(padLP.frequency);

    noise.connect(noiseHP);
    noiseHP.connect(noiseLP);
    noiseLP.connect(noiseGain);
    noiseGain.connect(master);

    ref.current = {
      ctx,
      master,
      padGain,
      padLP,
      chorus,
      chorusFB,
      o1,
      o2,
      tremLfo,
      tremAmt,
      filtLfo,
      filtAmt,
      noise,
      noiseHP,
      noiseLP,
      noiseGain,
    };
    return ref.current;
  };

  const start = async (opts?: { volume?: number }) => {
    const n = ensure();
    if (n.ctx.state !== "running") { try { await n.ctx.resume(); } catch {} }
    const t = n.ctx.currentTime;

    try { n.o1.start(t); } catch {}
    try { n.o2.start(t); } catch {}
    try { n.tremLfo.start(t + 0.05); } catch {}
    try { n.filtLfo.start(t + 0.05); } catch {}
    try { n.noise.start(t); } catch {}

    n.padGain.gain.cancelScheduledValues(t);
    n.padGain.gain.setTargetAtTime(0.18, t, 2.0);

    n.master.gain.cancelScheduledValues(t);
    const vol = Math.max(0, Math.min(1, opts?.volume ?? 0.06));
    n.master.gain.setTargetAtTime(vol, t, 1.2);
  };

  const stop = () => {
    const n = ref.current;
    if (!n) return;
    const t = n.ctx.currentTime;
    n.master.gain.setTargetAtTime(0, t, 0.8);
    n.padGain.gain.setTargetAtTime(0, t, 0.8);
    window.setTimeout(() => {
      try { n.o1.stop(); } catch {}
      try { n.o2.stop(); } catch {}
      try { n.tremLfo.stop(); } catch {}
      try { n.filtLfo.stop(); } catch {}
      try { n.noise.stop(); } catch {}
      ref.current = null;
    }, 1200);
  };

  const setVolume = (v: number) => {
    const n = ensure();
    const t = n.ctx.currentTime;
    n.master.gain.setTargetAtTime(Math.max(0, Math.min(1, v)), t, 0.4);
  };

  return { start, stop, setVolume };
}
