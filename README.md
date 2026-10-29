# MyPresence — Android landing page

A single-page download and installation guide for the MyPresence Android app. It is plain HTML, CSS, and JavaScript — no build step and no dependencies.

## What's here

```
landing/
├── index.html                  # Page content and copy
├── styles.css                  # All styling, responsive rules, animations
├── script.js                   # Mobile menu, Android 7/8 toggle, FAQ reveals, APK size
├── assets/
│   ├── logo.png                # Full logo
│   ├── logo-mark.png           # Mark only (header, icon source)
│   ├── logo-wordmark.png       # Wordmark only (header)
│   ├── icon-192.png            # Web app / touch icon
│   ├── icon-512.png            # Web app icon
│   ├── icon-launcher-*.png     # Android launcher icons used in the app
│   └── favicon.png
└── downloads/
    └── MyPresence.apk          # The build served by the download buttons
```

## Preview it locally

From the `landing` folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

Opening `index.html` directly also works, but a local server is better for testing the APK download and the automatic file-size check.

## Deploy it

Upload the **contents of the `landing` folder** to any static host. Keep `index.html` at the root and keep the `assets/` and `downloads/` folders next to it.

Good options:

- **Netlify Drop** — drag the `landing` folder onto <https://app.netlify.com/drop>.
- **Vercel** — import the project and set the output directory to `landing`.
- **GitHub Pages** — publish the `landing` folder (for example with a GitHub Actions workflow, or by moving its contents to the Pages branch).
- **School / organization web host** — upload the folder with FTP or cPanel.

The download buttons use the relative path `downloads/MyPresence.apk`, so the page works on any domain without changes.

## Replace the APK

After building a new release:

```bash
cp build/app/outputs/flutter-apk/app-release.apk landing/downloads/MyPresence.apk
```

The page reads the file size automatically when it is served over HTTP, so the size labels update themselves. The fallback text in `index.html` (`54.3 MB`) should also be updated if the file changes significantly:

```bash
grep -n "data-apk-size" landing/index.html
```

## Update the version number

When the app version changes in `pubspec.yaml`, update the visible version in:

- `landing/index.html` — the hero badge, step 1 file chip, CTA meta, and footer
- `landing/README.md` — this file

Search for `1.0.0` in `index.html` to find every occurrence.

## Release signing (important)

The APK in this folder was built with the project's current `android/app/build.gradle.kts` configuration, which signs **release builds with the debug keystore**:

```kotlin
buildTypes {
    release {
        signingConfig = signingConfigs.getByName("debug")
    }
}
```

That is fine for sharing a test build with classmates or teammates, but it is **not** suitable for public distribution. Before sharing widely:

1. Create a release keystore.
2. Add the signing configuration to `android/app/build.gradle.kts` (or `key.properties`).
3. Rebuild with `flutter build apk --release`.
4. Keep the keystore and passwords safe — future updates must be signed with the same key.

If you switch signing keys, Android will refuse to install the new APK over the old one. Users will need to uninstall the old app first. The FAQ on the page explains this.

## APK details

| | |
|---|---|
| Package | `com.example.my_presence_app` |
| Version | 1.0.0 (build 1) |
| Minimum Android | 7.0 (API 24) |
| Architecture | Universal APK (works on most Android phones) |
| Signing | Debug keystore (see note above) |
| SHA-256 | `fa005075aded75420f6d47ec7627e8384a0b63791c4a2f7136d3aca3ac717acb` |

Verify a download on macOS/Linux:

```bash
shasum -a 256 MyPresence.apk
```

## Customize

- **Colors** — the brand palette is at the top of `styles.css` under `:root`. The main green is `#385b4f`; the ink is `#303030`.
- **Copy** — edit `index.html`. The installation steps and FAQ are plain HTML.
- **Logo** — replace the files in `assets/` and keep the same filenames.
- **Fonts** — the page loads Plus Jakarta Sans and Instrument Serif from Google Fonts. To make it fully offline, download the WOFF2 files and add `@font-face` rules to `styles.css`.
- **Phone mockup** — the app screen in the hero is built with HTML/CSS, not a screenshot, so it stays crisp at every size and is easy to edit.

## Notes

- No analytics, cookies, or third-party scripts are included.
- The page respects `prefers-reduced-motion`.
- The installation guide covers Android 8.0+ and Android 7.x paths. Menu labels vary slightly between Samsung, Xiaomi, Pixel, and other brands.
- If you change the package name in the Android app, update the details table above and, if desired, the copy in the FAQ.
