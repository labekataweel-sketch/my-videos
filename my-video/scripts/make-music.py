"""Generate an original, soft piano-and-strings track for the Laveka ad.

A gentle piano melody over warm strings and a soft low end, in D major,
I-V-vi-IV. Everything is synthesized here, so there are no licensing
concerns.

Usage: python3 scripts/make-music.py <seconds> <out.wav>
"""

import sys
import wave

import numpy as np

SR = 44100
BPM = 76
BEAT = 60 / BPM
BAR = 4 * BEAT
rng = np.random.default_rng(11)


def hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


# D - A/C# - Bm - G  (one bar each), voiced around middle C.
CHORDS = [
    [62, 66, 69, 74],
    [61, 64, 69, 73],
    [59, 62, 66, 71],
    [55, 59, 62, 67],
]
BASS = [38, 37, 35, 31]

# Melody per 4-bar cycle: (beat offset, midi, length in beats). Two variations.
MELODY = [
    [(0, 78, 1.5), (1.5, 76, 0.5), (2, 74, 2),
     (4, 76, 1.5), (5.5, 73, 0.5), (6, 69, 2),
     (8, 71, 1), (9, 74, 1), (10, 78, 2),
     (12, 79, 1.5), (13.5, 78, 0.5), (14, 74, 2)],
    [(0, 81, 1.5), (1.5, 78, 0.5), (2, 76, 2),
     (4, 76, 1), (5, 78, 1), (6, 73, 2),
     (8, 74, 1), (9, 78, 1), (10, 83, 2),
     (12, 81, 1), (13, 79, 1), (14, 78, 2)],
]


def env(n, attack, release):
    e = np.ones(n)
    a = min(n, int(attack * SR))
    r = min(n - a, int(release * SR))
    if a:
        e[:a] = np.linspace(0, 1, a) ** 2
    if r:
        e[n - r:] = np.linspace(1, 0, r) ** 2
    return e


def piano(f, dur, vel=1.0):
    """Additive piano-ish tone: slightly inharmonic partials, faster decay up high."""
    n = int((dur + 1.8) * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    B = 0.0004
    for k, amp in enumerate([1.0, 0.55, 0.3, 0.18, 0.1, 0.06, 0.035], start=1):
        fk = f * k * np.sqrt(1 + B * k * k)
        if fk > 16000:
            break
        decay = 1.6 + 0.9 * k + f / 900
        out += amp * np.sin(2 * np.pi * fk * t + rng.random() * 6.28) * np.exp(-t * decay)
    hammer = rng.standard_normal(n) * np.exp(-t * 180) * 0.02
    out = (out + hammer) * env(n, 0.003, 0.25)
    # Damper: notes stop a bit after their written length.
    stop = int(dur * SR)
    if stop < n:
        out[stop:] *= np.exp(-np.arange(n - stop) / SR * 6)
    return out * vel * 0.45


def strings(freqs, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for f in freqs:
        for d in (-0.08, 0.0, 0.09):
            vib = 1 + 0.002 * np.sin(2 * np.pi * (5 + d * 10) * t)
            ph = 2 * np.pi * f * 2 ** (d / 12) * np.cumsum(vib) / SR
            out += np.sin(ph) + 0.3 * np.sin(2 * ph) + 0.12 * np.sin(3 * ph)
    swell = 0.75 + 0.25 * np.sin(np.pi * np.clip(t / dur, 0, 1))
    return out * swell * env(n, 0.9, 0.9) / (len(freqs) * 3) * 0.33


def bass(f, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.2 * np.sin(4 * np.pi * f * t)) * env(n, 0.05, 0.6) * 0.22


def chime(f):
    n = int(2.5 * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.76 * t)
    return s * np.exp(-t * 2.2) * env(n, 0.002, 0.2) * 0.06


def add(buf, sig, start, gain=1.0):
    i = int(start * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def reverb(x, seconds=3.0, mix=0.3):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-t * 2.4)
    # Darken the tail with a running average.
    k = 24
    ir = np.convolve(ir, np.ones(k) / k, mode="same")
    ir[: int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))
    ir /= np.sqrt(np.sum(ir**2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return (1 - mix) * x + mix * wet


def main():
    total = float(sys.argv[1])
    out_path = sys.argv[2]
    n = int(total * SR)
    L = np.zeros(n)
    R = np.zeros(n)

    def put(sig, start, pan=0.5, gain=1.0):
        add(L, sig, start, gain * np.cos(pan * np.pi / 2) * 1.41)
        add(R, sig, start, gain * np.sin(pan * np.pi / 2) * 1.41)

    bar = 0
    t0 = 0.0
    while t0 < total:
        ci = bar % 4
        cycle = bar // 4
        chord = CHORDS[ci]
        # Strings enter softly after the first bar and stay.
        if bar >= 1:
            put(strings([hz(m) for m in chord], BAR + 0.6), t0, 0.5)
        # Left-hand piano: broken chord in eighths, gentle.
        lh = [chord[0] - 12, chord[1], chord[2], chord[1], chord[3] - 12, chord[1], chord[2], chord[1]]
        for s, m in enumerate(lh):
            put(piano(hz(m), BEAT * 0.9, 0.38 if s % 2 else 0.5), t0 + s * BEAT / 2, 0.38)
        # Bass from bar 2.
        if bar >= 2:
            put(bass(hz(BASS[ci]), BAR), t0, 0.5)
        # Melody from bar 1 (first bar is a short intro).
        if bar >= 1 or cycle > 0:
            phrase = MELODY[cycle % 2]
            for off, m, ln in phrase:
                if ci * 4 <= off < ci * 4 + 4:
                    put(piano(hz(m), ln * BEAT, 0.9), t0 + (off - ci * 4) * BEAT, 0.6)
        # A sparkle at the start of each cycle.
        if ci == 0 and bar > 0:
            put(chime(hz(chord[3] + 24)), t0, 0.7)
        t0 += BAR
        bar += 1

    L, R = reverb(L), reverb(R)
    fade = env(n, 0.8, 3.0)
    st = np.stack([L * fade, R * fade], axis=1)
    # Gentle soft-clip then normalize.
    st = np.tanh(st / np.max(np.abs(st)) * 1.2)
    st /= np.max(np.abs(st)) / 0.89
    with wave.open(out_path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


if __name__ == "__main__":
    main()
