```dataviewjs
const container = dv.el("div", "", {
    cls: "dashboard-btn-container"
});

const createButton = (label, action, activeStyle = "") => {
    const btn = document.createElement("button");
    btn.innerText = label;
    btn.className = "dashboard-btn";
    if (activeStyle) {
        btn.style = activeStyle;
    }
    btn.addEventListener("click", () => {
        if (typeof action === "string") {
            app.commands.executeCommandById(action);
        } else if (typeof action === "function") {
            action();
        }
    });
    btn.addEventListener("mousedown", () => btn.style.transform = "scale(0.95)");
    btn.addEventListener("mouseup", () => btn.style.transform = "scale(1)");
    container.appendChild(btn);
};

createButton("📥 Inbox", () => {
    const file = app.vault.getAbstractFileByPath("00 - Home/Inbox.md");
    if (file) app.workspace.getLeaf().openFile(file);
});
createButton("📈 Overview", () => {
    const file = app.vault.getAbstractFileByPath("00 - Home/Overview.md");
    if (file) app.workspace.getLeaf().openFile(file);
});
```