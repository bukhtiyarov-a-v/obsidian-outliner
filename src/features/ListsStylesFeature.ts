import { Feature } from "./Feature";

import { ObsidianService } from "../services/ObsidianService";
import { SettingsService } from "../services/SettingsService";

const BETTER_LISTS_CLASS = "outliner-plugin-better-lists";
const BETTER_BULLETS_CLASS = "outliner-plugin-better-bullets";
const VERTICAL_LINES = "outliner-plugin-vertical-lines";
const KNOWN_CLASSES = [
  BETTER_LISTS_CLASS,
  BETTER_BULLETS_CLASS,
  VERTICAL_LINES,
];

export class ListsStylesFeature implements Feature {
  private interval: number;

  constructor(
    private settings: SettingsService,
    private obsidian: ObsidianService
  ) {}

  async load() {
    this.syncListsStyles();
    this.interval = window.setInterval(() => {
      this.syncListsStyles();
    }, 1000);
  }

  async unload() {
    clearInterval(this.interval);
    this.applyListsStyles([]);
  }

  private syncListsStyles = () => {
    const classes = [];

    if (this.obsidian.isDefaultThemeEnabled()) {
      if (this.settings.styleLists) {
        classes.push(BETTER_LISTS_CLASS);
        classes.push(BETTER_BULLETS_CLASS);
      }

      if (this.settings.listLines) {
        classes.push(VERTICAL_LINES);
      }
    }

    this.applyListsStyles(classes);
  };

  private applyListsStyles(classes: string[]) {
    const toKeep = classes.filter((c) => KNOWN_CLASSES.contains(c));
    const toRemove = KNOWN_CLASSES.filter((c) => !toKeep.contains(c));

    for (const c of toKeep) {
      if (!document.body.classList.contains(c)) {
        document.body.classList.add(c);
      }
    }

    for (const c of toRemove) {
      if (document.body.classList.contains(c)) {
        document.body.classList.remove(c);
      }
    }
  }
}
