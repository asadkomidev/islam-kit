import React from 'react';
import type { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <span style={{ fontWeight: 700 }}>Islam Kit</span>,
  project: {
    link: 'https://github.com/asadkomi/islam-kit',
  },
  docsRepositoryBase: 'https://github.com/asadkomi/islam-kit/tree/main/apps/docs',
  footer: {
    text: 'Islam Kit - Muslim utilities for the JavaScript ecosystem',
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Islam Kit" />
      <meta
        property="og:description"
        content="Muslim utilities for the JavaScript ecosystem"
      />
    </>
  ),
  useNextSeoProps() {
    return {
      titleTemplate: '%s - Islam Kit',
    };
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    backToTop: true,
  },
  editLink: {
    text: 'Edit this page on GitHub',
  },
  feedback: {
    content: 'Question? Give us feedback',
    labels: 'feedback',
  },
};

export default config;
