const { app, Menu, Tray } = require("electron");
const config = require("./config.json");
let tray = null;

function checkIfIconExists(path) {
  try {
    require("fs").accessSync(path);
    return path;
  } catch (e) {
    return null;
  }
}

app.whenReady().then(() => {
  tray = new Tray(
    checkIfIconExists("./resources/app/traylinks/icon.png") ||
      checkIfIconExists("./traylinks/icon.png")
  );

  const websites = config.menuItems;

  const contextMenu = Menu.buildFromTemplate([
    ...websites.map((site) =>
      site.type === "separator"
        ? { type: "separator" }
        : {
            label: site.name,
            click: () => {
              require("electron").shell.openExternal(site.url);
            },
          }
    ),
    { type: "separator" },
    {
      label: "Open Config Folder",
      click: () => {
        // Open current folder in explorer
        require("child_process").exec("start traylinks");
      },
    },
    {
      label: "Reload Config",
      click: () => {
        app.relaunch();
        app.quit();
      },
    },
    { type: "separator" },
    {
      label: "Exit",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip("TrayLinks");

  // Listen for a click on the tray icon
  tray.on("click", () => {
    // Pop up the context menu
    tray.popUpContextMenu(contextMenu);
  });

  // Listen for a right-click on the tray icon
  tray.on("right-click", () => {
    // Pop up the context menu
    tray.popUpContextMenu(contextMenu);
  });
});
