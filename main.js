const { app, Menu, Tray } = require("electron");
const config = require("./config.json");
let tray = null;

app.whenReady().then(() => {
  tray = new Tray("icon.png");

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
