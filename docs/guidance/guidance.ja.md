# ガイダンス

セットアップ、移行、例、無視ルールを1ページにまとめたガイドです。

## セットアップ

### インストール

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

### サポート拡張子

自動検出: `.go.html`, `.gohtml`, `.gotmpl`, `.go.tmpl`, `.tmpl`, `.tpl`, `.html.tmpl`, `.html.tpl`

通常の `.html` は上記 override を設定してください。

### オプション

`goTemplateBracketSpacing`（デフォルト: `true`）

- `true`: `{{ statement }}`
- `false`: `{{statement}}`

## 移行

`prettier-plugin-go-template` から `@htnabe/prettier-plugin-go-template` へ:

1. `npm uninstall prettier-plugin-go-template`
2. `npm i -D @htnabe/prettier-plugin-go-template@rc`
3. `.prettierrc.json` の plugin 名を更新:

```json
{
  "plugins": ["@htnabe/prettier-plugin-go-template"]
}
```

## 無視ルール

### 単一ブロック

```html
<!-- prettier-ignore -->
{{ if someCondition }} {{ somethingUnformatted }} {{ end }}
```

### 複数行

```html
{{/* prettier-ignore-start */}} ... {{/* prettier-ignore-end */}}
```

複数行の無視には Go テンプレートコメント（`{{/* ... */}}`）を使ってください。

### script/style

`<script>` と `<style>` 内のテンプレート構文は保持されます。

## 例

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

## 機能

- テンプレートブロック（`if` / `range` / `with` / `define` / `end`）の自動インデント
- Go テンプレートと HTML が混在する内容の整形
- `goTemplateBracketSpacing` によるブレース内スペース設定
- 無視ディレクティブ対応: `prettier-ignore` と `prettier-ignore-start` / `prettier-ignore-end`
- `<script>` / `<style>` ブロック内のテンプレート部分を保持
- Hugo / Go template 拡張子をサポート
