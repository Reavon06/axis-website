import { mkdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { site } from './lib/content.mjs'
import { layoutPage } from './lib/partials.mjs'
import {
  renderAboutBody,
  renderContactBody,
  renderGalleryBody,
  renderHomeBody,
  renderWorksBody,
} from './lib/pages.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const pages = [
  {
    out: join(root, 'index.html'),
    depth: 0,
    active: 'home',
    title: `${site.name} | Premium 3D Printing & Fabrication`,
    body: renderHomeBody(0),
    includeThree: true,
  },
  {
    out: join(root, 'works', 'index.html'),
    depth: 1,
    active: 'works',
    title: `Works | ${site.name}`,
    body: renderWorksBody(1),
    includeThree: false,
  },
  {
    out: join(root, 'gallery', 'index.html'),
    depth: 1,
    active: 'gallery',
    title: `Gallery | ${site.name}`,
    body: renderGalleryBody(1),
    includeThree: false,
  },
  {
    out: join(root, 'about', 'index.html'),
    depth: 1,
    active: 'about',
    title: `About | ${site.name}`,
    body: renderAboutBody(1),
    includeThree: false,
  },
  {
    out: join(root, 'contact', 'index.html'),
    depth: 1,
    active: 'contact',
    title: `Contact | ${site.name}`,
    body: renderContactBody(1),
    includeThree: false,
  },
]

for (const p of pages) {
  mkdirSync(dirname(p.out), { recursive: true })
  writeFileSync(
    p.out,
    layoutPage({
      depth: p.depth,
      active: p.active,
      title: p.title,
      body: p.body,
      includeThree: p.includeThree,
    }),
    'utf8',
  )
}

console.log(`Built ${pages.length} pages into ${root}`)
