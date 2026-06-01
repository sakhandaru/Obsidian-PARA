
```contributionGraph
title: 🏆 Daily Productivity
graphType: default
dateRangeValue: 180
dateRangeType: LATEST_DAYS
startOfWeek: 0
showCellRuleIndicators: true
titleStyle:
  textAlign: left
  fontSize: 16px
  fontWeight: bold
dataSource:
  type: ALL_TASK
  value: ""
  dateField: {}
  filters:
    - id: "1780293636021"
      type: STATUS_IS
      value: COMPLETED
fillTheScreen: false
enableMainContainerShadow: false
cellStyleRules: []

```
```dataviewjs
const allTasks = dv.pages('!"99 - Templates"').file.tasks;
const completed = allTasks.filter(t => t.completed);
const totalCount = allTasks.length;
const completedCount = completed.length;
const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

dv.paragraph(`
<div style="
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0;
  font-family: var(--font-interface);
  max-width: 420px;
">

  <div style="
    background-color: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    padding: 10px 12px;
  ">
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
      <span style="
        display: inline-flex;
        align-items: center;
        gap: 6px;
        width: fit-content;
        padding: 2px 8px;
        border-radius: 4px;
        background-color: rgba(46, 160, 67, 0.18);
        color: #7ee787;
        font-size: 0.78em;
        font-weight: 600;
        line-height: 1.6;
      ">
        <span style="
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #7ee787;
          display: inline-block;
        "></span>
        Tugas Selesai
      </span>
      <span style="
        font-size: 0.9em;
        font-weight: 600;
        color: var(--text-normal);
      ">${completedCount}</span>
    </div>
  </div>

  <div style="
    background-color: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    padding: 10px 12px;
  ">
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
      <span style="
        display: inline-flex;
        align-items: center;
        gap: 6px;
        width: fit-content;
        padding: 2px 8px;
        border-radius: 4px;
        background-color: rgba(88, 166, 255, 0.16);
        color: #79c0ff;
        font-size: 0.78em;
        font-weight: 600;
        line-height: 1.6;
      ">
        <span style="
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #79c0ff;
          display: inline-block;
        "></span>
        Total Tugas Dibuat
      </span>
      <span style="
        font-size: 0.9em;
        font-weight: 600;
        color: var(--text-normal);
      ">${totalCount}</span>
    </div>
  </div>

  <div style="
    background-color: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    padding: 10px 12px;
  ">
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
      <span style="
        display: inline-flex;
        align-items: center;
        gap: 6px;
        width: fit-content;
        padding: 2px 8px;
        border-radius: 4px;
        background-color: rgba(210, 153, 34, 0.18);
        color: #d29922;
        font-size: 0.78em;
        font-weight: 600;
        line-height: 1.6;
      ">
        <span style="
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #d29922;
          display: inline-block;
        "></span>
        Rasio Penyelesaian
      </span>
      <span style="
        font-size: 0.9em;
        font-weight: 600;
        color: var(--text-normal);
      ">${percent}%</span>
    </div>
  </div>

</div>
`);
```

---

> Tulis apapun di sini dulu.

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

[[Today|⬅️ Today]] | [[Tasks (lepas)|📋 Tasks]]

---

## 📥 Captured (inbox)

- baru lagi
