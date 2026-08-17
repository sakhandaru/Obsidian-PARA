---
type: dashboard
---

# 🧘 Habits Dashboard

Daftar kebiasaan aktif yang dilacak otomatis menggunakan TunTask. Klik pada nama habit untuk melihat visualisasi heatmap kontribusi lengkapnya.

```dataviewjs
const habitsFile = dv.page("TunTask/habits.md");
if (!habitsFile) {
    dv.paragraph("Belum ada data sinkronisasi habit dari TunTask.");
} else {
    const tasks = habitsFile.file.tasks;
    const habitGroups = {};

    tasks.forEach(t => {
        const match = t.text.match(/🌱\s*(.*?)\s*🔁/);
        if (match) {
            const title = match[1].trim();
            if (!habitGroups[title]) {
                habitGroups[title] = {
                    title: title,
                    total: 0,
                    completed: 0,
                    skipped: 0
                };
            }
            habitGroups[title].total++;
            if (t.completed) {
                habitGroups[title].completed++;
            } else if (t.status === '-') {
                habitGroups[title].skipped++;
            }
        }
    });

    const rows = Object.values(habitGroups).map(h => {
        const percent = h.total > 0 ? Math.round((h.completed / h.total) * 100) : 0;
        const color = percent >= 80 ? "#a3e635" : percent >= 50 ? "#fbbf24" : "#6366f1";
        
        const progressBar = `<div style="display: flex; align-items: center; gap: 8px;">
            <div style="flex-grow: 1; background-color: var(--background-modifier-border); border-radius: 4px; height: 6px; overflow: hidden; min-width: 120px;">
                <div style="background-color: ${color}; width: ${percent}%; height: 100%; border-radius: 4px;"></div>
            </div>
            <span style="font-size: 0.85em; color: var(--text-muted);">${h.completed}/${h.total} hari</span>
        </div>`;

        const habitLink = `[[06 - Habits/${h.title}|${h.title}]]`;

        return [
            habitLink,
            progressBar,
            `**${percent}%**`
        ];
    });

    if (rows.length === 0) {
        dv.paragraph("Belum ada habit aktif yang terdaftar di TunTask.");
    } else {
        dv.table(["Habit", "Progress (30 Hari Terakhir)", "Rasio"], rows);
    }
}
```

---
[[Today|⬅️ Today]] | [[Overview|📈 Overview]] | [[Projects Dashboard|🗂️ Projects]]
