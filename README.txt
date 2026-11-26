UNKNOWN403 — WEBSITE ZIP

CONTENTS
- index.html: the complete personal website and all visible sections
- styles.css: desktop, tablet, and mobile layouts, visual styling, and reduced-motion rules
- script.js: responsive navigation, scroll progress, reveal effects, cursor, Backroom Terminal 2.0, and discoveries
- assets/: locally bundled profile, game, anime, movie, social, goal, and blueprint images

PUBLISH WITH GITHUB PAGES
1. Extract this ZIP on your computer.
2. Open the repository: https://github.com/unkn0wn4o3/unkn0wn4o3.github.io
3. Upload the contents inside the extracted unkn0wn4o3-rebuild folder to the repository root.
4. Keep index.html, styles.css, script.js, and the assets folder together at the root.
5. Review the file replacement list and commit the changes.

FEATURE NOTES
- The profile clue stays below the crown logo and alias on narrow screens.
- The anime profile image is centered on mobile, with its halo centered behind it and both labels layered above.
- The custom cursor is enabled only for fine pointers and is disabled for touch and reduced-motion preferences.
- The terminal opens with ? or after five quick clicks on the header brand/profile picture.
- Backroom Terminal 2.0 uses a central command registry and grouped help directory. Use `help <command>` for command-specific details.
- Original commands: help, joke, lore, secrets, clear, room, exit, quote, roast.
- Additional commands: whoami, date, history, version, riddle, guide, ascii, cipher, scan.
- Additional controls: hint, answer, newchallenge, cancel, scan-cancel, history-filter, ascii next, ascii list, and named ASCII artwork commands.
- Jokes, quotes, roasts, lore fragments, secret hints, riddles, and cipher challenges each have ten entries. The ASCII archive has ten named designs.
- Quote and Roast cards appear only when their own commands are entered. Help does not generate either card.
- Output cards replace earlier output. An active riddle/cipher card remains visible until the challenge is completed or cancelled.
- The History card includes numbered commands, local timestamps, result summaries, a session count, and filtering.
- Desktop keyboard controls remain available. The terminal also includes touch controls for navigation, Tab, Enter, Backspace, Escape, B/A, hints, and cancellation.
- The scan is a harmless local interface animation; it does not inspect the device or perform a network scan. It can be cancelled or is stopped when the terminal closes.
- The discovery register tracks four clues locally in the current browser. Clearing browser storage resets the register; progress is not synced between devices.
- The classic cheat code can be entered with a keyboard or with the touch-friendly tracker panel on touch devices.
- Google Fonts are optional. System font fallbacks keep the layout usable when external font loading is unavailable.
- Large local artwork is optimized as WebP to reduce page weight. Images remain bundled in the assets folder; no external image host is required.
- Some franchise categories use one representative poster while the accompanying text describes the full series.

BACKUP
Keep a copy of your currently working GitHub Pages files before replacing them with this build.


ACHIEVEMENT ARCHIVE UPDATE
- achievements.html: standalone archive page with all 20 badge artworks and unlock status
- achievements.css: responsive archive styling
- achievements.js: local achievement state, unlock conditions, progress, and unlock notifications
- assets/achievements/: 20 transparent badge PNGs plus the transparent trophy PNG
- The trophy launcher sits above the existing footer copyright. The original copyright five-click interaction is preserved.
- My World cards unlock individually on click/tap (also keyboard accessible).
- Entertainment cards unlock their category badge and the parent Fictional Hours badge on click/tap. Hovering alone never unlocks.
- Section tasks use actual viewport visibility. Blueprint requires all four Focus Quests to be viewed and the live project link to be opened.
- Terminal Tourist, Big Brain, and Four Traces connect to the existing terminal and discovery system.
- Achievement progress is stored locally in this browser under unknown403-achievements-v1. It does not sync across devices.
- Reset is available at the bottom of the achievement archive and requires confirmation.


AFTERHOURS — STRUCTURE BUILD
- afterhours.html: standalone Deep Forest music-player page.
- afterhours.css: responsive player layout and Deep Forest styling.
- afterhours.js: reserved scaffold for future track integration; no audio is bundled or playable in this build.
- Homepage entry point: a left-edge headphone-style tab placed within the hero section, so it scrolls away with the page (not fixed/sticky).
- Clicking the tab opens a dotted-border preview panel. Its inner AFTERHOURS card opens afterhours.html in the same tab.
- The player layout has a central Now Playing area and a right-side library list with 16 numbered track slots.
- The selected track artwork is designed to occupy the central artwork area and its corresponding small artwork slot in the right-side list once track data is added.
- Track titles, artist names, MP3 files, track images, headphone icon, preview image, and background image are intentionally not included yet.
- Playback controls are visual placeholders and remain disabled until authorised audio files and track metadata are supplied.
- No mood filters or playlist categories are included.
- No Punjabi tracks or playlist content are included.
- Earlier requested About wording is restored: “stalk my socials” and “SCROLL DOWN, BESTIE!”
- Existing homepage sections, assets, achievements archive, trophy, cursor, terminal, discoveries, and Secret Room files are carried forward from the supplied ZIP. No GitHub repository changes were made.


AFTERHOURS / WEBSITE POLISH UPDATE
- Homepage copy received a consistency pass for punctuation, phrasing, and the requested Gen-Z voice.
- The left-edge AFTERHOURS launcher now peeks out as an icon-only tab; hover/focus reveals the full headphone + AFTERHOURS label. It is positioned inside the homepage hero (not fixed/sticky), so it scrolls away with the hero.
- Clicking the tab opens a two-stage preview: image slot + witty entrance copy, followed by a separate clickable AFTERHOURS entry card.
- AFTERHOURS now uses the same 👾 idle cursor and crimson tech crosshair on interactive elements as the main website and archive.
- AFTERHOURS centre stage shows the large empty background state at first. The Now Playing panel is hidden until a future track-selection integration.
- The right-side library contains 16 numbered replaceable slots. Track titles, artists, MP3s and artwork remain intentionally empty.
- Achievement Archive received searchable/filterable All, Unlocked, Locked, and category views; progress copy, badge descriptions and focus states were polished. Existing unlock IDs and local storage keys are preserved.
- Added responsive layout, keyboard focus styling, and reduced-motion handling for new interactions.
- No MP3s, track artwork, user-provided headphone icon, preview image, or background image are included. No GitHub changes were made.


AFTERHOURS SIDEBAR IMAGE UPDATE
- Repositioned the headphone launcher as a fixed viewport-side control, visible throughout the entire homepage while scrolling (not limited to the hero section).
- Removed the green rectangular/tab background, border and container styling. The supplied headphone artwork is the only visible launcher graphic.
- Launcher is mostly tucked beyond the left edge by default; hover reveals the full headphone artwork and the AFTERHOURS label in the same DM Mono lettering style as the trophy label.
- Clicking the headphone control opens a preview panel with the supplied wide forest-headphones image, a short entrance message, and a separate AFTERHOURS entry card.
- Added supplied assets: assets/afterhours/afterhours-headphones.png and assets/afterhours/afterhours-preview.png.
- The preview panel's inner card opens afterhours.html. Existing website sections and achievement launcher are unchanged.
