
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 24608, hash: '14c770512790a3985e0e768484c439191e66f3ae66acfd74bc1c6d6189685aa5', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17118, hash: '2a8054a536056001dfbe15fec758f258741a9aef9af98a9654946783feaf6a79', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 121866, hash: '669cf9bc7ff8908ea8e47c289e9dc751d1f8a39664537caef69a2cb0113ad5c8', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-4KNJEDFK.css': {size: 8043, hash: 'tbl85N9iC0k', text: () => import('./assets-chunks/styles-4KNJEDFK_css.mjs').then(m => m.default)}
  },
};
