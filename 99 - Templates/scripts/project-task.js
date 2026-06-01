module.exports = async (params) => {
    const { app, quickAddApi } = params;

    // 1. Deteksi apakah file aktif adalah proyek
    let selectedFile = app.workspace.getActiveFile();
    let selectedProjectName = "";

    if (selectedFile && selectedFile.path.startsWith("02 - Projects/") && selectedFile.extension === "md") {
        selectedProjectName = selectedFile.basename;
    } else {
        // Ambil semua file proyek dari folder "02 - Projects"
        const projectFolder = app.vault.getAbstractFileByPath("02 - Projects");
        if (!projectFolder) {
            new Notice("Folder '02 - Projects' tidak ditemukan!");
            return;
        }

        const projectFiles = app.vault.getFiles().filter(file => file.path.startsWith("02 - Projects/") && file.extension === "md");
        if (projectFiles.length === 0) {
            new Notice("Tidak ada proyek aktif di folder '02 - Projects'. Buat proyek baru terlebih dahulu!");
            return;
        }

        const projectNames = projectFiles.map(file => file.basename);
        
        // Suggester untuk memilih proyek
        selectedProjectName = await quickAddApi.suggester(projectNames, projectNames);
        if (!selectedProjectName) return;

        selectedFile = projectFiles.find(file => file.basename === selectedProjectName);
    }

    // 2. Input Deskripsi Tugas
    const description = await quickAddApi.inputPrompt(`📋 Tugas untuk [${selectedProjectName}]:`);
    if (!description || description.trim() === "") {
        new Notice("Tugas dibatalkan: Deskripsi kosong.");
        return;
    }

    // 3. Format Tanggal
    const today = new Date();
    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const lusa = new Date(today);
    lusa.setDate(today.getDate() + 2);

    const dateOptions = [
        "❌ Tanpa Tenggat",
        `📅 Hari ini (${formatDate(today)})`,
        `📅 Besok (${formatDate(tomorrow)})`,
        `📅 Lusa (${formatDate(lusa)})`,
        "✏️ Pilih Tanggal Kustom (YYYY-MM-DD)"
    ];

    const dateValues = [
        "",
        ` 📅 ${formatDate(today)}`,
        ` 📅 ${formatDate(tomorrow)}`,
        ` 📅 ${formatDate(lusa)}`,
        "custom"
    ];

    // Suggester Tanggal
    const selectedDateIndex = await quickAddApi.suggester(dateOptions, dateValues);
    if (selectedDateIndex === undefined) return;

    let due = "";
    if (selectedDateIndex === "custom") {
        const customDate = await quickAddApi.inputPrompt("Masukkan Tanggal (YYYY-MM-DD):", formatDate(today));
        if (customDate && /^\d{4}-\d{2}-\d{2}$/.test(customDate.trim())) {
            due = ` 📅 ${customDate.trim()}`;
        } else if (customDate) {
            new Notice("Format tanggal salah! Gunakan YYYY-MM-DD.");
            return;
        }
    } else {
        due = selectedDateIndex;
    }

    // 4. Suggester Prioritas
    const priorityOptions = [
        "⚪ Normal Priority",
        "🔺 High Priority",
        "🔼 Medium Priority",
        "🔽 Low Priority"
    ];

    const priorityValues = [
        "",
        " 🔺",
        " 🔼",
        " 🔽"
    ];

    const selectedPriority = await quickAddApi.suggester(priorityOptions, priorityValues);
    if (selectedPriority === undefined) return;

    // 4. Suggester Pengulangan (Recurrence)
    const recurrenceOptions = [
        "❌ Tanpa Pengulangan",
        "🔁 Setiap Hari (every day)",
        "🔁 Setiap Minggu (every week)",
        "🔁 Setiap Bulan (every month)",
        "✏️ Pengulangan Kustom..."
    ];

    const recurrenceValues = [
        "",
        " 🔁 every day",
        " 🔁 every week",
        " 🔁 every month",
        "custom"
    ];

    const selectedRecurrence = await quickAddApi.suggester(recurrenceOptions, recurrenceValues);
    if (selectedRecurrence === undefined) return;

    let repeat = "";
    if (selectedRecurrence === "custom") {
        const customRepeat = await quickAddApi.inputPrompt("Masukkan Aturan Pengulangan (contoh: every weekday, every 2 weeks):");
        if (customRepeat && customRepeat.trim() !== "") {
            repeat = ` 🔁 ${customRepeat.trim()}`;
        }
    } else {
        repeat = selectedRecurrence;
    }

    // Gabungkan menjadi string task
    const taskString = `- [ ] ${description.trim()}${due}${selectedPriority}${repeat}`;

    // 5. Tulis ke file proyek terpilih di Task Source
    try {
        let content = await app.vault.read(selectedFile);
        const tasksHeader = "## Tasks";
        const taskSourceHeader = "> [!note]- Task Source";
        const taskSourceIntro = "> Task markdown disimpan di sini agar tombol edit dari plugin Tasks tetap bisa bekerja.";
        const tasksView = [
            tasksHeader,
            "",
            "```tasks",
            "path includes {{query.file.path}}",
            "hide backlink",
            "hide toolbar",
            "```",
            "",
            taskSourceHeader,
            taskSourceIntro,
            ">"
        ].join("\n");

        const ensureTaskSource = (text) => {
            if (text.includes(taskSourceHeader)) return text;

            const tasksIndex = text.indexOf(tasksHeader);
            if (tasksIndex === -1) {
                return `${text.trimEnd()}\n\n${tasksView}\n`;
            }

            const notesIndex = text.indexOf("\n## Notes", tasksIndex);
            if (notesIndex === -1) {
                return `${text.trimEnd()}\n\n${taskSourceHeader}\n${taskSourceIntro}\n>\n`;
            }

            const beforeTasks = text.slice(0, tasksIndex).trimEnd();
            const existingTasks = text.slice(tasksIndex + tasksHeader.length, notesIndex).trim();
            const afterTasks = text.slice(notesIndex);
            const sourceLines = existingTasks
                .split("\n")
                .map(line => line.trimEnd())
                .filter(line => line.length > 0 && !line.startsWith("```") && !line.startsWith("path includes") && !line.startsWith("hide backlink") && !line.startsWith("hide toolbar"))
                .map(line => line.startsWith(">") ? line : `> ${line}`);
            const sourceBlock = sourceLines.length > 0 ? `${tasksView}\n${sourceLines.join("\n")}\n` : `${tasksView}\n`;

            return `${beforeTasks}\n\n${sourceBlock}${afterTasks}`;
        };

        const insertTask = (text) => {
            const sourceIndex = text.indexOf(taskSourceHeader);
            if (sourceIndex === -1) return `${text.trimEnd()}\n> ${taskString}\n`;

            const nextSectionIndex = text.indexOf("\n## ", sourceIndex + taskSourceHeader.length);
            const insertPosition = nextSectionIndex === -1 ? text.length : nextSectionIndex;
            const beforeSourceEnd = text.slice(0, insertPosition).trimEnd();
            const afterSourceEnd = text.slice(insertPosition);

            return `${beforeSourceEnd}\n> ${taskString}\n${afterSourceEnd}`;
        };

        content = ensureTaskSource(content);
        content = insertTask(content);
        await app.vault.modify(selectedFile, content);
        new Notice(`✅ Tugas berhasil ditambahkan ke proyek [${selectedProjectName}]!`);
    } catch (err) {
        new Notice(`Gagal menulis tugas: ${err.message}`);
    }
};
