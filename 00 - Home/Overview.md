
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
---


```dataviewjs
const todayStr = moment().format("YYYY-MM-DD");

// 1. Ambil data tugas
const allTasks = dv.pages('!"99 - Templates"').file.tasks;

// Helper untuk mengambil tanggal tugas secara konsisten
const getTaskDate = (t) => {
    const dueMatch = t.text.match(/📅 (\d{4}-\d{2}-\d{2})/);
    if (dueMatch) return moment(dueMatch[1]);
    
    const journalMatch = t.path.match(/04 - Journal\/(\d{4}-\d{2}-\d{2})/);
    if (journalMatch) return moment(journalMatch[1]);
    
    return null;
};

// Global Stats
const globalCompleted = allTasks.filter(t => t.completed);
const globalTotal = allTasks.length;
const globalCompletedCount = globalCompleted.length;
const globalPercent = globalTotal > 0 ? Math.round((globalCompletedCount / globalTotal) * 100) : 0;

// Daily Stats
const todayTasks = allTasks.filter(t => {
    const date = getTaskDate(t);
    return date && date.isSame(moment(), 'day');
});
const todayCompleted = todayTasks.filter(t => t.completed);
const todayTotal = todayTasks.length;
const todayCompletedCount = todayCompleted.length;
const todayPercent = todayTotal > 0 ? Math.round((todayCompletedCount / todayTotal) * 100) : 0;

// Weekly Stats
const weekTasks = allTasks.filter(t => {
    const date = getTaskDate(t);
    return date && date.isSame(moment(), 'week');
});
const weekCompleted = weekTasks.filter(t => t.completed);
const weekTotal = weekTasks.length;
const weekCompletedCount = weekCompleted.length;
const weekPercent = weekTotal > 0 ? Math.round((weekCompletedCount / weekTotal) * 100) : 0;

// Monthly Stats
const monthTasks = allTasks.filter(t => {
    const date = getTaskDate(t);
    return date && date.isSame(moment(), 'month');
});
const monthCompleted = monthTasks.filter(t => t.completed);
const monthTotal = monthTasks.length;
const monthCompletedCount = monthCompleted.length;
const monthPercent = monthTotal > 0 ? Math.round((monthCompletedCount / monthTotal) * 100) : 0;

// 2. Render Tabs Container
const container = dv.el("div", "", {
    attr: { style: "font-family: var(--font-interface); width: 100%; margin: 12px 0;" }
});

// Render Tab Buttons Header
const tabHeader = document.createElement("div");
tabHeader.style = "display: flex; width: 100%; gap: 6px; border-bottom: 1px solid var(--background-modifier-border); padding-bottom: 8px; margin-bottom: 12px;";
container.appendChild(tabHeader);

const createTabButton = (label) => {
    const btn = document.createElement("button");
    btn.innerText = label;
    btn.style = "flex: 1; background: none; border: none; padding: 6px 4px; text-align: center; border-radius: 4px; font-weight: 600; font-size: 0.8em; cursor: pointer; color: var(--text-muted); transition: all 0.2s ease; outline: none; white-space: nowrap;";
    tabHeader.appendChild(btn);
    return btn;
};

const tabDailyBtn = createTabButton("📅 Hari Ini");
const tabWeeklyBtn = createTabButton("🗓️ Minggu Ini");
const tabMonthlyBtn = createTabButton("🌕 Bulan Ini");
const tabGlobalBtn = createTabButton("📊 Semua");

// Content Containers
const contentContainer = document.createElement("div");
contentContainer.style = "display: flex; flex-direction: column; gap: 8px;";
container.appendChild(contentContainer);

const renderCards = (completed, total, percent) => {
    return `
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
      ">${completed}</span>
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
      ">${total}</span>
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
        color: ${percent === 100 ? '#7ee787' : 'var(--text-normal)'};
      ">${percent}%</span>
    </div>
  </div>
    `;
};

// Switch Tab Logic
const selectTab = (active) => {
    // Reset all button styles
    [tabDailyBtn, tabWeeklyBtn, tabMonthlyBtn, tabGlobalBtn].forEach(btn => {
        btn.style.backgroundColor = "transparent";
        btn.style.color = "var(--text-muted)";
    });

    if (active === "daily") {
        tabDailyBtn.style.backgroundColor = "var(--interactive-accent)";
        tabDailyBtn.style.color = "var(--text-on-accent)";
        contentContainer.innerHTML = renderCards(todayCompletedCount, todayTotal, todayPercent);
    } else if (active === "weekly") {
        tabWeeklyBtn.style.backgroundColor = "var(--interactive-accent)";
        tabWeeklyBtn.style.color = "var(--text-on-accent)";
        contentContainer.innerHTML = renderCards(weekCompletedCount, weekTotal, weekPercent);
    } else if (active === "monthly") {
        tabMonthlyBtn.style.backgroundColor = "var(--interactive-accent)";
        tabMonthlyBtn.style.color = "var(--text-on-accent)";
        contentContainer.innerHTML = renderCards(monthCompletedCount, monthTotal, monthPercent);
    } else {
        tabGlobalBtn.style.backgroundColor = "var(--interactive-accent)";
        tabGlobalBtn.style.color = "var(--text-on-accent)";
        contentContainer.innerHTML = renderCards(globalCompletedCount, globalTotal, globalPercent);
    }
};

// Event Listeners
tabDailyBtn.addEventListener("click", () => selectTab("daily"));
tabWeeklyBtn.addEventListener("click", () => selectTab("weekly"));
tabMonthlyBtn.addEventListener("click", () => selectTab("monthly"));
tabGlobalBtn.addEventListener("click", () => selectTab("global"));

// Default Tab
selectTab("daily");
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

## 📥 Captured (inbox)
