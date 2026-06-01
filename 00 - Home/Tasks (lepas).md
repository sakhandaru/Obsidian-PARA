> Task lepas — tidak milik project manapun.
> Tambah due date dengan 📅 YYYY-MM-DD untuk muncul di Today.

```dataviewjs
const style = "background-color: var(--background-modifier-border); color: var(--text-normal); padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); font-weight: 500; font-size: 0.9em; cursor: pointer; transition: background-color 0.2s ease, transform 0.1s ease; outline: none;";

const container = dv.el("div", "", {
    attr: { style: "display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;" }
});

const createButton = (label, action, activeStyle = "") => {
    const btn = document.createElement("button");
    btn.innerText = label;
    btn.style = style + activeStyle;
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
createButton("🗓️ Today", async () => {
    await app.workspace.openLinkText("Today", "00 - Home", false);
});
```

## 📥 Task Inbox
- [ ] cuci baju 📅 2026-06-02
- [ ] pulang lagi 📅 2026-07-08

- [x] bobo malam 📅 2026-06-01
- [x] bobo malam 🔺
- [ ] belajar python 🔺 📅 2026-06-03

> Tulis atau capture tugas baru di sini. Tugas yang Anda tulis di sini akan otomatis disaring dan ditampilkan di bagian bawah secara dinamis.

---

## ⚡ Scheduled Tasks (Tugas Terjadwal)
```tasks
has due date
path does not include 02 - Projects
path does not include 06 - Habits
path does not include 99 - Templates
sort by status reverse
sort by due
hide backlink
hide toolbar
```

---

## 📥 Undated Tasks (Tugas Tanpa Tanggal)
```tasks
no due date
path does not include 02 - Projects
path does not include 06 - Habits
path does not include 99 - Templates
sort by status reverse
hide backlink
hide toolbar
```

---

## 🗂️ Active Project Tasks (Tugas Proyek)
```tasks
path includes 02 - Projects
path does not include 99 - Templates
sort by status reverse
group by filename
hide backlink
hide toolbar
```

---

