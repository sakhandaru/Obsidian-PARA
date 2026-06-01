---
type: dashboard
---

# 🗂️ Projects Dashboard

Daftar semua proyek aktif beserta *progress bar* penyelesaian tugasnya.

```dataviewjs
const pages = dv.pages('"02 - Projects"');

dv.table(["Project", "Area", "Due", "Progress"], pages.map(p => {
    const tasks = p.file.tasks;
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const color = percent === 100 ? "#a3e635" : "#6366f1";
    
    const progressBar = `<div style="display: flex; align-items: center; gap: 8px;">
        <div style="flex-grow: 1; background-color: var(--background-modifier-border); border-radius: 4px; height: 6px; overflow: hidden; min-width: 100px;">
            <div style="background-color: ${color}; width: ${percent}%; height: 100%; border-radius: 4px;"></div>
        </div>
        <span style="font-size: 0.85em; color: var(--text-muted);">${completed}/${total}</span>
    </div>`;
    
    return [
        p.file.link,
        p.area || "-",
        p.due || "-",
        progressBar
    ];
}));
```
