import defaultComponents from 'fumadocs-ui/mdx';
import { Callout } from 'fumadocs-ui/components/callout';
import { InstallTabs, CopyButton } from '@/components';

export function useMDXComponents() {
  return {
    ...defaultComponents,
    Callout,
    InstallTabs,
    CopyButton,
  };
}
