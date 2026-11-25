# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i --loglevel=error
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npm run render
```

Writes `out/video.mp4` (composition `MyComp`, 5 s, 1280×720, 30 fps).
Override the text with props:

```console
npx remotion render MyComp out/video.mp4 --props='{"title":"عنوان جديد","subtitle":"نص فرعي"}'
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Project notes

- `src/Composition.tsx` — the `MyComp` composition: an Arabic (RTL) title
  animated word by word, a fading subtitle and a progress bar.
- `public/fonts/` — the Cairo font (SIL Open Font License), bundled so renders
  work without reaching Google Fonts.
- Remotion downloads its rendering browser from `remotion.media` on first
  render. In a cloud sandbox that routes Node through an HTTPS proxy, run
  renders with `NODE_USE_ENV_PROXY=1`.

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
