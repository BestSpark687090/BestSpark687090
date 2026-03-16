{ pkgs }: {
  deps = [
    pkgs.lsof
    pkgs.dig
    pkgs.u-root-cmds
    pkgs.unzip
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server
  ];
}