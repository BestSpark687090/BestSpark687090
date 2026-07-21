// hello!!
// hello!!!!
// hi!!!!!!!

/**
 {name: "", url:"Doom 2.wad.html"},{name: "", url:"Doom.wad.html"},{name: "", url:"Majora's Mask.html"},{name: "", url:"Mario Kart 64.z64.html"},{name: "", url:"Ocarina of Time.z64.html"},{name: "", url:"Pokemon Diamond.nds.html"},{name: "", url:"README.md"},{name: "", url:"Sonic The Hedgehog 2.md.html"},{name: "", url:"Sonic The Hedgehog.md.html"},{name: "", url:"Sonic the Hedgehog 3.md.html"},{name: "", url:"Super Mario 64 DS.nds.html"},{name: "", url:"Super Mario 64.z64.html"},{name: "", url:"Super Smash Bros.z64.html"},{name: "", url:"Super Spamton 64.z64.html"},{name: "", url:"Tetris Arcade.nes.html"},{name: "", url:"Tetris.nes.html"},{name: "", url:"TetrisWorlds.gba.html"},{name: "", url:"TetrisZero.nes.html"},{name: "", url:"Ultimate Mortal Kombat 3 (U).smc.html"},{name: "", url:"kof98.zip.html"}
 */
export default {
  special: [
    // they're special because they're hosted statically :trollcart:
    { name: "Mario Kart 64", url: "mk64.html" },
    { name: "Super Mario 64", url: "sm64.html" },
    { name: "Super Smash Bros (N64)", url: "sb64.html" },
    { name: "Ocarina of Time", url: "oot64.html" },
    { name: "Sonic 2 XL", url: "s2xl.html" },
  ],
  normal: [
    // { name: "Doom 2", url: "Doom 2.wad.html" }, // Crashes on startup
    // { name: "Doom", url: "Doom.wad.html" }, // Crashes on startup
    // { name: "Majora's Mask", url: "Majora's Mask.html" }, // wait why does this one crash
    // { name: "Ocarina of Time", url: "Ocarina of Time.z64.html" },
    // { name: "Pokemon Diamond", url: "Pokemon Diamond.nds.html" },
    { name: "Sonic The Hedgehog 2", url: "Sonic The Hedgehog 2.md.html" },
    { name: "Sonic The Hedgehog", url: "Sonic The Hedgehog.md.html" },
    { name: "Sonic The Hedgehog 3", url: "Sonic the Hedgehog 3.md.html" },
    // { name: "Super Mario 64 DS", url: "Super Mario 64 DS.nds.html" },
    // { name: "Super Mario 64", url: "Super Mario 64.z64.html" },
    // { name: "", url: "Super Spamton 64.z64.html" },
    { name: "Tetris Arcade", url: "Tetris Arcade.nes.html" },
    { name: "Tetris (NES)", url: "Tetris.nes.html" },
    { name: "Tetris Worlds", url: "TetrisWorlds.gba.html" },
    { name: "Tetris Zero (NES, ROM Hack)", url: "TetrisZero.nes.html" },
    {
      name: "Ultimate Mortal Kombat 3",
      url: "Ultimate Mortal Kombat 3 (U).smc.html",
    },
    //    { name: "Sonic 2 XL", url: "Sonic 2 XL.bin.html"}

    // { name: "", url: "kof98.zip.html" } // I don't even think this ever worked.
  ],
};
