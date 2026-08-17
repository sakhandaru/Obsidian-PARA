module.exports = async (params) => {
    const { app, quickAddApi } = params;

    // 1. Input Nama Habit
    const habitName = await quickAddApi.inputPrompt("🆕 Nama Habit Baru:");
    if (!habitName || habitName.trim() === "") {
        new Notice("Pembuatan habit dibatalkan: Nama kosong.");
        return;
    }

    const cleanName = habitName.trim();
    const habitPath = `06 - Habits/${cleanName}.md`;

    // Cek apakah file sudah ada
    if (app.vault.getAbstractFileByPath(habitPath)) {
        new Notice("Habit dengan nama ini sudah ada!");
        return;
    }

    // 2. Pilih Frekuensi
    const freqOptions = [
        "🔁 Setiap Hari (Daily)",
        "🔁 Setiap Minggu (Weekly)",
        "🔁 Setiap Bulan (Monthly)",
        "✏️ Kustom (Custom Rule)"
    ];
    const freqValues = [
        "every day",
        "every week",
        "every month",
        "custom"
    ];

    const selectedFreq = await quickAddApi.suggester(freqOptions, freqValues);
    if (selectedFreq === undefined) return;

    let repeatRule = "";
    let freqLabel = "";
    if (selectedFreq === "custom") {
        const customRule = await quickAddApi.inputPrompt("Masukkan aturan pengulangan kustom (contoh: every weekday, every 2 days):");
        if (customRule && customRule.trim() !== "") {
            repeatRule = ` 🔁 ${customRule.trim()}`;
            freqLabel = `kustom (${customRule.trim()})`;
        } else {
            new Notice("Pembuatan habit dibatalkan: Aturan kosong.");
            return;
        }
    } else {
        repeatRule = ` 🔁 ${selectedFreq}`;
        freqLabel = selectedFreq;
    }

    // 3. Tentukan Tanggal Mulai (Hari Ini)
    const todayStr = moment().format("YYYY-MM-DD");

    // 4. Bangun Konten File Menggunakan Konten Templat Habit
    const fileContent = `---
type: habit
frequency: ${freqLabel}
created: ${todayStr}
tags:
---

# 🧘 Habit: ${cleanName}

\`\`\`dataviewjs
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
\`\`\`


> Frekuensi: ${freqLabel}
> Dilacak otomatis menggunakan tugas selesai di bawah.

\`\`\`contributionGraph
title: ${cleanName}
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
  value: '"06 - Habits/${cleanName}.md"'
  dateField: {}
  filters:
    - id: "\${Date.now().toString()}"
      type: STATUS_IS
      value: COMPLETED
fillTheScreen: false
enableMainContainerShadow: false
cellStyleRules: []
\`\`\`

## Tasks

- [ ] 🌱 ${cleanName}${repeatRule} 📅 ${todayStr}

## Notes

- 
`;

    // 5. Buat Folder 06 - Habits jika belum ada
    const folder = app.vault.getAbstractFileByPath("06 - Habits");
    if (!folder) {
        await app.vault.createFolder("06 - Habits");
    }

    // 6. Buat Catatan Habit Baru
    await app.vault.create(habitPath, fileContent);
    new Notice(`✅ Habit '${cleanName}' berhasil dibuat di folder 06 - Habits!`);
    
    // Buka berkas yang baru dibuat
    const newFile = app.vault.getAbstractFileByPath(habitPath);
    if (newFile) {
        await app.workspace.getLeaf().openFile(newFile);
    }
};
