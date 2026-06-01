> Tulis apapun di sini dulu. Jangan pikir struktur saat capture.
> Proses saat review: jadikan task, project, resource, atau hapus.

```dataviewjs
const style = "background-color: var(--background-modifier-border); color: var(--text-normal); padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); font-weight: 500; font-size: 0.9em; cursor: pointer; transition: background-color 0.2s ease, transform 0.1s ease; outline: none;";

const container = dv.el("div", "", {
    attr: { style: "display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;" }
});

const createButton = (label, commandId, activeStyle = "") => {
    const btn = document.createElement("button");
    btn.innerText = label;
    btn.style = style + activeStyle;
    btn.addEventListener("click", () => {
        app.commands.executeCommandById(commandId);
    });
    btn.addEventListener("mousedown", () => btn.style.transform = "scale(0.95)");
    btn.addEventListener("mouseup", () => btn.style.transform = "scale(1)");
    container.appendChild(btn);
};

createButton("✅ New Task", "quickadd:choice:capture-task", "background-color: var(--interactive-accent); color: var(--text-on-accent); border: none; font-weight: 600;");
createButton("🔁 Recurring Task", "quickadd:choice:new-recurring-task");
createButton("📌 Project Task", "quickadd:choice:new-project-task");
createButton("📥 Capture Inbox", "quickadd:choice:capture-inbox");
createButton("🗂️ New Project", "quickadd:choice:new-project");
createButton("🆕 New Habit", "quickadd:choice:new-habit");
createButton("🗺️ New Area", "quickadd:choice:new-area");
createButton("📚 New Resource", "quickadd:choice:new-resource");
createButton("📔 New Journal", "quickadd:choice:new-journal");
```

[[Today]]
[[Tasks]]
