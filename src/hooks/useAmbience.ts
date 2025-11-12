import { useRef } from "react";

export function useAmbience() {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const srcRef = useRef<AudioBufferSourceNode | null>(null);
  const enabledRef = useRef<boolean>(false);
  const volumeRef = useRef<number>(0.25);

  const ensureCtx = () =>
    (ctxRef.current ??= new (window.AudioContext || (window as any).webkitAudioContext)());

  const arm = async () => {
    const ctx = ensureCtx();
    if (ctx.state !== "running") {
      try {
        await ctx.resume();
      } catch {}
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

  const start = async () => {
    await arm();
    const ctx = ensureCtx();
    if (srcRef.current) return;

    const gain = ctx.createGain();
    gain.gain.value = volumeRef.current;
    gainRef.current = gain;

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

    gain.connect(ctx.destination);
    noise.connect(bp);
    bp.connect(lp);
    lp.connect(gain);

    noise.start();
    srcRef.current = noise;
  };

  const stop = () => {
    if (srcRef.current) {
      try {
        srcRef.current.stop();
      } catch {}
      srcRef.current.disconnect();
      srcRef.current = null;
    }
  };

  return { setEnabled, setVolume, arm };
}
