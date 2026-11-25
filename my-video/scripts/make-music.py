"""Generate an original, calm background track for the Laveka ad.

Soft pads + a gentle plucked arpeggio + light shaker, with a simple
convolution reverb. Everything is synthesized here, so there are no
licensing concerns.

Usage: python3 scripts/make-music.py <seconds> <out.wav>
"""

import sys
import wave

import numpy as np

SR = 44100
BPM = 84
BEAT = 60 / BPM
rng = np.random.default_rng(7)


def midi_hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


# Fmaj9 - C/E - Dm9 - Bbmaj7, two bars (8 beats) each.
CHORDS = [
    [53, 57, 60, 64, 67],
    [52, 55, 60, 64, 67],
    [50, 57, 60, 64, 65],
    [46, 53, 57, 62, 65],
]


def envelope(n, attack, release):
    env = np.ones(n)
    a = min(n, int(attack * SR))
    r = min(n - a, int(release * SR))
    if a:
        env[:a] = np.linspace(0, 1, a)
    if r:
        env[n - r :] = np.linspace(1, 0, r)
    return env


def pad(freqs, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for f in freqs:
        for detune in (-0.12, 0.0, 0.13):
            ff = f * 2 ** (detune / 12)
            out += np.sin(2 * np.pi * ff * t) + 0.25 * np.sin(4 * np.pi * ff * t)
    out *= envelope(n, 1.2, 1.4) / (len(freqs) * 3)
    return out


def pluck(f, dur=1.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    tone = (
        np.sin(2 * np.pi * f * t)
        + 0.45 * np.sin(4 * np.pi * f * t) * np.exp(-t * 3)
        + 0.2 * np.sin(6 * np.pi * f * t) * np.exp(-t * 6)
    )
    return tone * np.exp(-t * 2.6) * envelope(n, 0.004, 0.05)


def shaker(dur=0.09):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    hp = noise - np.concatenate([[0], noise[:-1]])
    return hp * np.exp(-np.arange(n) / SR * 45)


def add(buf, sig, start):
    i = int(start * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def reverb(x, seconds=2.4, mix=0.28):
    n = int(seconds * SR)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 3.2)
    ir /= np.sqrt(np.sum(ir**2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return (1 - mix) * x + mix * wet


def main():
    total = float(sys.argv[1])
    out_path = sys.argv[2]
    n = int(total * SR)
    left = np.zeros(n)
    right = np.zeros(n)

    bar_chord = 8 * BEAT
    pattern = [0, 2, 3, 4, 3, 2, 1, 2]  # arpeggio over chord tones
    t0 = 0.0
    k = 0
    while t0 < total:
        chord = CHORDS[k % len(CHORDS)]
        p = pad([midi_hz(m) for m in chord], bar_chord + 1.0) * 0.55
        add(left, p, t0)
        add(right, p, t0)
        for step in range(16):  # eighth notes
            note = chord[pattern[step % 8]] + 12
            if step >= 8:
                note += 12 if step % 4 == 0 else 0
            s = pluck(midi_hz(note)) * (0.32 if step % 2 == 0 else 0.22)
            pan = 0.5 + 0.35 * np.sin(step * 0.9)
            add(left, s * (1 - pan) * 2 * 0.5, t0 + step * BEAT / 2)
            add(right, s * pan * 2 * 0.5, t0 + step * BEAT / 2)
        # Light shaker from the second chord on.
        if k >= 1:
            for step in range(16):
                sh = shaker() * (0.05 if step % 2 else 0.03)
                add(left, sh, t0 + step * BEAT / 2 + 0.01)
                add(right, sh, t0 + step * BEAT / 2)
        # Bass on beat 1 and 5.
        for b in (0, 4):
            f = midi_hz(chord[0] - 12)
            m = int(3.5 * BEAT * SR)
            tt = np.arange(m) / SR
            bass = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 0.9) * envelope(m, 0.02, 0.3) * 0.35
            add(left, bass, t0 + b * BEAT)
            add(right, bass, t0 + b * BEAT)
        t0 += bar_chord
        k += 1

    left, right = reverb(left), reverb(right)
    fade = envelope(n, 1.0, 2.5)
    stereo = np.stack([left * fade, right * fade], axis=1)
    stereo /= np.max(np.abs(stereo)) / 0.85
    pcm = (stereo * 32767).astype(np.int16)
    with wave.open(out_path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


if __name__ == "__main__":
    main()
