{ pkgs, ... }: {
  channel = "stable-23.05"; # "stable-23.05" or "unstable"
  packages = [
    pkgs.nodejs
    pkgs.nodePackages.firebase-tools
  ];
  idx.extensions = [
    "angular.ng-template"
  ];
  idx.previews = {
    enable = true;
    previews = [
      {
        command = ["npm" "run" "start" "--" "--port" "$PORT" "--host" "0.0.0.0" "--disable-host-check"];
        manager = "web";
        id = "web";
      }
    ];
  };
}