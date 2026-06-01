---
type: project
area: ""
due:
created: <% tp.date.now("YYYY-MM-DD") %>
tags:
---

# <% tp.file.title %>

## Objective

Apa hasil konkret yang ingin dicapai?

## Progress

```dataviewjs
const tasks = dv.current().file.tasks;
const total = tasks.length;
const completed = tasks.filter(t => t.completed).length;
const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
const color = percent === 100 ? "#a3e635" : "#6366f1";

dv.paragraph(`
<div style="display: flex; align-items: center; gap: 12px; margin: 10px 0; font-family: var(--font-interface);">
  <div style="flex-grow: 1; background-color: var(--background-modifier-border); border-radius: 4px; height: 8px; overflow: hidden;">
    <div style="background-color: ${color}; width: ${percent}%; height: 100%; border-radius: 4px; transition: width 0.3s ease;"></div>
  </div>
  <span style="font-weight: 600; color: ${color}; font-size: 0.95em; white-space: nowrap;">${completed}/${total} (${percent}%)</span>
</div>
`);
```

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

createButton("📌 Project Task", "quickadd:choice:new-project-task", "background-color: var(--interactive-accent); color: var(--text-on-accent); border: none; font-weight: 600;");
createButton("📥 Archive Project", "quickadd:choice:archive-active-note");
```

## Tasks

```tasks
path includes {{query.file.path}}
hide backlink
hide toolbar
```

> [!note]- Task Source
> Task markdown disimpan di sini agar tombol edit dari plugin Tasks tetap bisa bekerja.
>

## Notes

- 

## Resources

- 
