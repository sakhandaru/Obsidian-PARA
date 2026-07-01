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

createButton("✅ New Task", "quickadd:choice:capture-task", "background-color: var(--interactive-accent); color: var(--text-on-accent); border: none; font-weight: 600;");
createButton("🔁 Recurring Task", "quickadd:choice:new-recurring-task");
createButton("📥 Inbox", () => {
    const file = app.vault.getAbstractFileByPath("00 - Home/Inbox.md");
    if (file) app.workspace.getLeaf().openFile(file);
});
createButton("📈 Overview", () => {
    const file = app.vault.getAbstractFileByPath("00 - Home/Overview.md");
    if (file) app.workspace.getLeaf().openFile(file);
});
createButton("📋 Tasks", () => {
    const file = app.vault.getAbstractFileByPath("00 - Home/Tasks (lepas).md");
    if (file) app.workspace.getLeaf().openFile(file);
});
```
## 📋 Due Today & Overdue
```dataview
TASK
WHERE !completed AND due <= date("today") AND !contains(file.path, "06 - Habits") AND !contains(file.path, "99 - Templates")
SORT due ASC
```

---

## 🧘 Habits Today
```dataview
TASK
WHERE !completed AND contains(file.path, "06 - Habits") AND due <= date("today")
```

---

## 📅 Due Tomorrow
```dataview
TASK
WHERE !completed AND due = date("tomorrow") AND !contains(file.path, "06 - Habits") AND !contains(file.path, "99 - Templates")
```

---

## 📥 Undated Tasks
```dataview
TASK
WHERE !completed AND !due AND !contains(file.path, "06 - Habits") AND !contains(file.path, "99 - Templates")
```

---

## ✅ Completed Today
```dataview
TASK
WHERE completed AND completion = date("today") AND !contains(file.path, "99 - Templates")
```