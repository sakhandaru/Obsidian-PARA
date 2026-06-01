
```dataviewjs
const style = "background-color: var(--background-modifier-border); color: var(--text-normal); padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border-color); font-weight: 500; font-size: 0.8em; cursor: pointer; transition: background-color 0.2s ease, transform 0.1s ease; outline: none;";

const container = dv.el("div", "", {
    attr: { style: "display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;" }
});

const createButton = (label, action, activeStyle = "") => {
    const btn = document.createElement("button");
    btn.innerText = label;
    btn.style = style + activeStyle;
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
createButton("📈 Overview", () => {
    const file = app.vault.getAbstractFileByPath("00 - Home/Overview.md");
    if (file) app.workspace.getLeaf().openFile(file);
});
```

## 📋 Due Today
```tasks
due today
not done
path does not include 06 - Habits
hide backlink
hide toolbar
```

---

## 🧘 Habits Today
```tasks
path includes 06 - Habits
due today
not done
hide backlink
hide recurrence rule
hide toolbar
```

---

## 📅 Due Tomorrow
```tasks
due tomorrow
not done
path does not include 06 - Habits
hide backlink
hide toolbar
```

---

## 📥 Undated Tasks
```tasks
no due date
not done
path does not include 06 - Habits
path does not include 99 - Templates
hide backlink
hide toolbar
```

---
