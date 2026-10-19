FONT TRIAL NOTES — 2026-10-19

The current trial uses Great Vibes for the couple names and the header/footer brand. It is loaded from Google Fonts in index.html and rsvp.html, rather than bundled as a local font file. The Great Vibes family includes Vietnamese character support and is published under the SIL Open Font License (OFL).

The previously supplied Angeline Vintage demo font remains in this folder for easy rollback, but the current Great Vibes CSS overrides do not use it. The caption “Một hành trình, hai trái tim” and the footer sign-off use Cormorant Garamond italic so there is not a second handwritten typeface competing in the same visual frame.

If you preview the site by opening the HTML directly from disk, an internet connection is needed to load Great Vibes from Google Fonts. The existing site already uses Google Fonts for its other typefaces.

FLORAL RESPONSIVE PASS — 2026-10-19
The latest responsive.css update applies fluid clamp()-based sizes to the botanical motifs across the home and RSVP pages. Decorative sprigs and frame overlays scale with viewport width while retaining their section-specific positions, rotations, and opacity. The Great Vibes couple-name style now uses letter-spacing: 0 and word-spacing: 0.08em for a little more room between words.
