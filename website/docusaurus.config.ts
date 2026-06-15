import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'devstack',
  tagline: 'Spin up your local dev infrastructure in seconds.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://PALR-DEV.github.io',
  baseUrl: '/devStack/',

  organizationName: 'PALR-DEV',
  projectName: 'devStack',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/PALR-DEV/devStack/tree/main/website/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/devstack-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'devstack',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/PALR-DEV/devStack',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Getting Started', to: '/docs/getting-started' },
            { label: 'Services', to: '/docs/services/postgres' },
            { label: 'Commands', to: '/docs/commands' },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/PALR-DEV/devStack',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/@palr-dev/devstack-cli',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Pedro Lorenzo. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
