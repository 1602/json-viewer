# json-viewer

This is a json-viewer custom element (a.k.a. web-component). Nothing fancy, just a copy of devtools json viewer you see in network panel when previewing json response.

Here’s a [demo](https://jsfiddle.net/ewq831s6/3/).

## Usage

### HTML

Load as module, and use

```html
<script type="module" src="https://unpkg.com/@_1602/json-viewer"></script>
<json-viewer value='{"foo": "bar"}'></json-viewer>
```

Customize appearance in CSS

```css
json-viewer {
  --background-color: #fff;
  --color: rgb(31, 31, 31);
  --expand-bullet-color: black;
  --expand-bullet-width: 14px;
  --expand-bullet-height: 14px;
  --key-color: rgb(142, 0, 75);
  --number-value-color: rgb(8, 66, 160);
  --bool-value-color: rgb(8, 66, 160);
  --null-value-color: rgba(31, 31, 31, 0.38);
  --string-value-color: rgb(220, 54, 46);
  --focused-node-background: #eee;
  --hovered-node-background: #eee;
}
```

To change toggle icon (‣):

```css
json-viewer {
  --expand-bullet-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"><path d="M10.5 6.65 4.9 2.8v7.7" fill="black"/></svg>');
}
```

### React+TS

To use it in react create `declarations.d.ts` with

```typescript
declare namespace JSX {
  interface IntrinsicElements {
    "json-viewer": any;
  }
}
```

And then use as like this

```jsx
export function JsonViewer({ value } : { value: string }) {
  return <json-viewer value={ value }></json-viewer>
}
```

### Vue+Vite

In vite config, add to `vue()` plugin

```js
export default defineConfig({
  // ...
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => ['json-viewer'].includes(tag),
        },
      },
    }),
  ],
  // ...
});

```
