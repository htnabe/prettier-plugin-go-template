# Guidance

Single-page guide for setup, migration, examples, and ignore rules.

## Setup

### Install

```bash
npm i -D prettier
npm i -D @htnabe/prettier-plugin-go-template@rc && npm uninstall prettier-plugin-go-template
```

### .prettierrc.json

```json
{
  "plugins": ["@htnabe/prettier-plugin-go-template"],
  "overrides": [
    {
      "files": ["*.html"],
      "options": {
        "parser": "go-template"
      }
    }
  ]
}
```

### Supported File Types

Auto-detected: `.go.html`, `.gohtml`, `.gotmpl`, `.go.tmpl`, `.tmpl`, `.tpl`, `.html.tmpl`, `.html.tpl`

The override is required only when templates use plain `.html`.
For auto-detected extensions listed above, the override can be omitted.

### Option

`goTemplateBracketSpacing` (default: `true`)

- `true`: `{{ statement }}`
- `false`: `{{statement}}`

## Migration

From `prettier-plugin-go-template` to `@htnabe/prettier-plugin-go-template`:

1. `npm uninstall prettier-plugin-go-template`
2. `npm i -D @htnabe/prettier-plugin-go-template@rc`
3. Update `.prettierrc.json` plugin name:

```json
{
  "plugins": ["@htnabe/prettier-plugin-go-template"]
}
```

## Ignore Rules

### Single block

```html
<!-- prettier-ignore -->
{{ if someCondition }} {{ somethingUnformatted }} {{ end }}
```

### Multi-line block

```html
{{/* prettier-ignore-start */}} ... {{/* prettier-ignore-end */}}
```

Use Go template comments (`{{/* ... */}}`) for multi-line ignore.

### Script and style

Template syntax inside `<script>` and `<style>` is preserved.

## Example

### Before

```html
{{if or .Prev .Next}} {{$p := where site.Pages}}
<div class="my-navigation">
  {{with $p.Next .}}
  <a href="{{ .RelPermalink }}">{{ .Title }}</a>
  {{end}}
</div>
{{end}}
```

### After

```html
{{ if or .Prev .Next }} {{ $p := where site.Pages }}
<div class="my-navigation">
  {{ with $p.Next . }}
  <a href="{{ .RelPermalink }}">{{ .Title }}</a>
  {{ end }}
</div>
{{ end }}
```

## Features

- Automatic indentation for template blocks (`if`, `range`, `with`, `define`, `end`)
- HTML-aware formatting for mixed Go template and HTML content
- Configurable bracket spacing with `goTemplateBracketSpacing`
- Ignore directives: `prettier-ignore` and `prettier-ignore-start` / `prettier-ignore-end`
- Preserves template sections in `<script>` and `<style>` blocks
- Supports Hugo and Go template file extensions
