import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';

const fumadocsSource = docs.toFumadocsSource();

// fumadocsSource.files is a function at runtime but typed as an array
// Use type assertion to call it as a function
const filesOrFn = fumadocsSource.files as unknown;
const files = typeof filesOrFn === 'function'
  ? (filesOrFn as () => typeof fumadocsSource.files)()
  : fumadocsSource.files;

export const source = loader({
  baseUrl: '/docs',
  source: {
    files,
  },
});
