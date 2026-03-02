{ pkgs }: {
  deps = [
    pkgs.gh
    pkgs.dig
    pkgs.u-root-cmds
    pkgs.unzip
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server
  ];
}