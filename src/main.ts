import { Boot } from "./scenes/boot/Boot";
import { Game as MainGame } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/boot/Preloader";

import { Game, Types } from "phaser";
import PhaserGamebus from "./lib/gamebus";

import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import { Debug } from "./scenes/Debug";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1384,
  height: 850,
  parent: "game-container",
  backgroundColor: "#183f39",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "matter",
  },
  plugins: {
    global: [
      {
        key: "PhaserGamebus",
        plugin: PhaserGamebus,
        start: true,
        mapping: "gamebus",
      },
    ],
    scene: [
      {
        key: "rexUI",
        plugin: RexUIPlugin,
        mapping: "rexUI",
      },
    ],
  },
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver, Debug],
};

if (import.meta.env.DEV) {
  {
    config.physics!.matter = {};
    config.physics!.matter.debug = false;
  }
}

export default new Game(config);
