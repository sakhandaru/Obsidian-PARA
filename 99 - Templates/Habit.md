---
type: habit
frequency: daily
created: <% tp.date.now("YYYY-MM-DD") %>
tags:
---

# 🧘 Habit: <% tp.file.title %>

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

createButton("📥 Archive Habit", "quickadd:choice:archive-active-note", "background-color: var(--interactive-accent); color: var(--text-on-accent); border: none; font-weight: 600;");
```


> Frekuensi: daily
> Dilacak otomatis menggunakan tugas selesai di bawah.

```contributionGraph
title: <% tp.file.title %>
graphType: default
dateRangeValue: 365
dateRangeType: LATEST_DAYS
startOfWeek: 0
showCellRuleIndicators: true
titleStyle:
  textAlign: left
  fontSize: 15px
  fontWeight: normal
dataSource:
  type: TASK_IN_SPECIFIC_PAGE
  value: '"06 - Habits/<% tp.file.title %>.md"'
  dateField: {}
  filters:
    - id: "1780293636021"
      type: STATUS_IS
      value: COMPLETED
fillTheScreen: false
enableMainContainerShadow: false
cellStyleRules: []

```

## Tasks

- [ ] 🌱 <% tp.file.title %> 🔁 every day 📅 <% tp.date.now("YYYY-MM-DD") %>

## Notes

- [[Habit]]
