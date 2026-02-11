// ═══════════════════════════════════════════════════════
// Room Designer — Typography System
// ═══════════════════════════════════════════════════════

export const fonts = {
  // Display — hero headlines, splash text
  display: {
    fontFamily: 'System',
    fontWeight: '900' as const,
    letterSpacing: -1,
  },

  // Heading — section titles
  heading: {
    fontFamily: 'System',
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },

  // Subheading — card titles, list headers
  subheading: {
    fontFamily: 'System',
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },

  // Body — paragraphs, descriptions
  body: {
    fontFamily: 'System',
    fontWeight: '400' as const,
    letterSpacing: 0.15,
  },

  // Body bold — emphasis within body text
  bodyBold: {
    fontFamily: 'System',
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },

  // Button — CTA text
  button: {
    fontFamily: 'System',
    fontWeight: '700' as const,
    letterSpacing: 0.4,
  },

  // Caption — meta info, timestamps
  caption: {
    fontFamily: 'System',
    fontWeight: '500' as const,
    letterSpacing: 0.2,
  },

  // Label — tags, badges, section labels
  label: {
    fontFamily: 'System',
    fontWeight: '700' as const,
    letterSpacing: 1.2,
  },
};

export default fonts;
