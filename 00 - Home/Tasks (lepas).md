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
        if (typeof action === "function") {
            action();
            return;
        }

        app.commands.executeCommandById(action);
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
createButton("🗓️ Today", async () => {
    await app.workspace.openLinkText("Today", "00 - Home", false);
});
```

## 📥 Unscheduled Task
```dataview
TASK
WHERE !completed AND (file.path = "00 - Home/Tasks (lepas).md" OR contains(file.path, "TunTask/tasks")) AND !due
```

---

## ⚡ Scheduled Tasks 
```dataview
TASK
WHERE !completed AND due AND (contains(file.path, "TunTask/tasks") OR contains(file.path, "00 - Home/Tasks (lepas)"))
SORT due ASC
```

---


## 🗃️ Task Source

---

## ✅ Completed Tasks
```dataview
TASK
WHERE completed AND !contains(file.path, "99 - Templates")
SORT completion DESC
```