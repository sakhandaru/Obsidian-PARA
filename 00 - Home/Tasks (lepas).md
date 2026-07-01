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
createButton("🗓️ Today", async () => {
    await app.workspace.openLinkText("Today", "00 - Home", false);
});
```

## 📥 Unscheduled Task
```dataview
TASK
WHERE !completed AND file.path = "00 - Home/Tasks (lepas).md" AND !due
```

---

## ⚡ Scheduled Tasks 
```dataview
TASK
WHERE !completed AND due AND !contains(file.path, "02 - Projects") AND !contains(file.path, "06 - Habits") AND !contains(file.path, "99 - Templates")
SORT due ASC
```

---

## 🗂️ Project Tasks (Tugas Proyek)
```dataview
TASK
WHERE !completed AND contains(file.path, "02 - Projects") AND !contains(file.path, "99 - Templates")
GROUP BY file.link
```

---

## 🗃️ Task Source
- [ ] bikin crud
- [ ] mandi
- [ ] beres² kamar
- [ ] belajar woilah 📅 2026-06-07 🔺
- [x] ada bl 📅 2026-06-08 ⏰ 19:00 [completion:: 2026-06-08]
- [x] nemoni mas haris 📅 2026-06-06 [completion:: 2026-06-06]
- [x] jam 9 cuci baju 📅 2026-06-06 [completion:: 2026-06-06]
- [x] fix obsidian 📅 2026-06-05 [completion:: 2026-06-05]
- [x] isi ulang galon 📅 2026-06-05 [completion:: 2026-06-05]
- [x] beli sabun 📅 2026-06-05 [completion:: 2026-06-05]
- [x] ketemu ellak 📅 2026-06-06 [completion:: 2026-06-08]
- [x] laundry 📅 2026-06-05 🔺 [completion:: 2026-06-05]

---

## ✅ Completed Tasks
```dataview
TASK
WHERE completed AND !contains(file.path, "99 - Templates")
SORT completion DESC
```