import { shop } from './shop';

export type DiscoverPageContent = {
  title: string;
  subtitle: string;
  body: string;
};

export function getDiscoverPages(): Record<string, DiscoverPageContent> {
  const { name, catalog } = shop;

  return {
    'about-us': {
      title: 'About Us',
      subtitle: `Know the story behind ${name}.`,
      body: `${name} — ${shop.tagline} — offers quality ${catalog.plural} and a seamless shopping experience. Update this page with your company story, values, and mission.`,
    },
    'our-doctors': {
      title: 'Our Team',
      subtitle: `Meet the people behind ${name}.`,
      body: 'Add your team, experts, or partners here with profiles, qualifications, and how customers can reach them.',
    },
    'our-whitepapers': {
      title: 'Resources',
      subtitle: 'Guides, downloads, and reference material.',
      body: 'Publish PDFs, guides, or documentation here. You can connect this to a CMS or manage it as static content.',
    },
    'our-blogs': {
      title: 'Blog',
      subtitle: `News, tips, and updates from ${name}.`,
      body: 'Share articles and updates with your customers. This page can be connected to a blog or CMS later.',
    },
    'our-media-center': {
      title: 'Media Center',
      subtitle: 'Press, announcements, and brand updates.',
      body: 'Add press releases, media mentions, images, and brand assets here.',
    },
    careers: {
      title: 'Careers',
      subtitle: `Join ${name} and grow with us.`,
      body: 'List open positions, culture, and how candidates can apply.',
    },
  };
}
