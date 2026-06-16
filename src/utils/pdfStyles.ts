const PDF_STYLE_PROPS = [
  'box-sizing',
  'display',
  'position',
  'width',
  'height',
  'min-width',
  'min-height',
  'max-width',
  'max-height',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border-top',
  'border-right',
  'border-bottom',
  'border-left',
  'border-radius',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'border-top-style',
  'border-right-style',
  'border-bottom-style',
  'border-left-style',
  'background-color',
  'color',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'line-height',
  'letter-spacing',
  'text-align',
  'text-transform',
  'text-decoration',
  'text-decoration-line',
  'text-decoration-color',
  'white-space',
  'word-break',
  'flex',
  'flex-direction',
  'flex-wrap',
  'flex-grow',
  'flex-shrink',
  'align-items',
  'align-self',
  'justify-content',
  'gap',
  'list-style-type',
  'list-style-position',
  'opacity',
  'overflow',
  'vertical-align',
  'transform',
  'transform-origin',
];

const COLOR_PROPS = new Set([
  'background-color',
  'color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'text-decoration-color',
]);

const UNSUPPORTED_COLOR_PATTERN = /oklch|lab\(|lch\(/i;

type StyleSnapshot = Map<Element, string>;

function resolveComputedValue(prop: string, value: string): string {
  if (!value) {
    return COLOR_PROPS.has(prop) ? defaultColorForProp(prop) : '';
  }

  if (!UNSUPPORTED_COLOR_PATTERN.test(value)) {
    if (prop === 'font-family') {
      return value
        .replace(/Inter/g, 'Arial')
        .replace(/"Inter"/g, 'Arial')
        .replace(/ui-sans-serif/g, 'Arial');
    }
    return value;
  }

  if (!COLOR_PROPS.has(prop)) {
    return '';
  }

  const probe = document.createElement('span');
  probe.style.setProperty(prop, value);
  probe.style.position = 'fixed';
  probe.style.left = '-9999px';
  probe.style.top = '0';
  probe.style.visibility = 'hidden';
  document.body.appendChild(probe);

  const resolved = window.getComputedStyle(probe).getPropertyValue(prop);
  probe.remove();

  if (!resolved || UNSUPPORTED_COLOR_PATTERN.test(resolved)) {
    return defaultColorForProp(prop);
  }

  return resolved;
}

function defaultColorForProp(prop: string): string {
  return prop.includes('background') ? '#ffffff' : '#000000';
}

function snapshotComputedStyles(root: HTMLElement): StyleSnapshot {
  const snapshot: StyleSnapshot = new Map();
  const nodes = [root, ...root.querySelectorAll('*')];

  for (const node of nodes) {
    const computed = window.getComputedStyle(node);
    const cssText = PDF_STYLE_PROPS.map((prop) => {
      const value = resolveComputedValue(prop, computed.getPropertyValue(prop));
      return value ? `${prop}:${value}` : '';
    })
      .filter(Boolean)
      .join(';');

    snapshot.set(node, cssText);
  }

  return snapshot;
}

function stripAttributes(root: HTMLElement): void {
  root.removeAttribute('class');
  root.removeAttribute('style');

  root.querySelectorAll('*').forEach((node) => {
    node.removeAttribute('class');
    node.removeAttribute('style');
  });
}

function applyStyleSnapshot(
  sourceRoot: HTMLElement,
  cloneRoot: HTMLElement,
  snapshot: StyleSnapshot,
): void {
  const sourceNodes = [sourceRoot, ...sourceRoot.querySelectorAll('*')];
  const cloneNodes = [cloneRoot, ...cloneRoot.querySelectorAll('*')];
  const count = Math.min(sourceNodes.length, cloneNodes.length);

  for (let i = 0; i < count; i += 1) {
    const cssText = snapshot.get(sourceNodes[i]);
    if (cssText) {
      (cloneNodes[i] as HTMLElement).style.cssText = cssText;
    }
  }

  cloneRoot.style.backgroundColor = '#ffffff';
  cloneRoot.style.boxShadow = 'none';
  cloneRoot.style.color = '#000000';
}

function hidePdfOnlyNodes(sourceRoot: HTMLElement, cloneRoot: HTMLElement): void {
  const sourceNodes = [sourceRoot, ...sourceRoot.querySelectorAll('*')];
  const cloneNodes = [cloneRoot, ...cloneRoot.querySelectorAll('*')];
  const count = Math.min(sourceNodes.length, cloneNodes.length);

  for (let i = 0; i < count; i += 1) {
    if (sourceNodes[i].hasAttribute('data-pdf-hidden')) {
      (cloneNodes[i] as HTMLElement).style.display = 'none';
    }
  }
}

export async function createIsolatedCaptureRoot(source: HTMLElement): Promise<{
  element: HTMLElement;
  cleanup: () => void;
}> {
  const snapshot = snapshotComputedStyles(source);
  const width = source.offsetWidth;

  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.left = '-10000px';
  iframe.style.top = '0';
  iframe.style.width = `${width}px`;
  iframe.style.height = '1px';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const iframeDocument = iframe.contentDocument;
  if (!iframeDocument) {
    iframe.remove();
    throw new Error('Could not create PDF capture frame.');
  }

  iframeDocument.open();
  iframeDocument.write(
    '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>',
  );
  iframeDocument.close();

  iframeDocument.documentElement.style.backgroundColor = '#ffffff';
  iframeDocument.documentElement.style.color = '#000000';
  iframeDocument.body.style.margin = '0';
  iframeDocument.body.style.padding = '0';
  iframeDocument.body.style.backgroundColor = '#ffffff';
  iframeDocument.body.style.color = '#000000';

  const clone = source.cloneNode(true) as HTMLElement;
  stripAttributes(clone);
  applyStyleSnapshot(source, clone, snapshot);
  hidePdfOnlyNodes(source, clone);
  iframeDocument.body.appendChild(clone);
  iframe.style.height = `${Math.max(clone.scrollHeight, clone.offsetHeight)}px`;

  iframeDocument
    .querySelectorAll('style, link[rel="stylesheet"]')
    .forEach((node) => node.remove());

  return {
    element: clone,
    cleanup: () => iframe.remove(),
  };
}
