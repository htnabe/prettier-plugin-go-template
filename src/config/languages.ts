import type { SupportLanguage } from "prettier";
import constants from "@/config/constants";

const languages: SupportLanguage[] = [
  {
    name: "GoTemplate",
    parsers: [constants.PLUGIN_KEY],
    extensions: [
      ".go.html",
      ".gohtml",
      ".gotmpl",
      ".go.tmpl",
      ".tmpl",
      ".tpl",
      ".html.tmpl",
      ".html.tpl",
    ],
    vscodeLanguageIds: ["gotemplate", "gohtml", "GoTemplate", "GoHTML"],
  },
];

export default languages;
