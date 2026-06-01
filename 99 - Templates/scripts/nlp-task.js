module.exports = async (params) => {
    const { app, quickAddApi } = params;

    // 1. Input Deskripsi Tugas
    const description = await quickAddApi.inputPrompt("📋 Tulis Deskripsi Tugas:");
    if (!description || description.trim() === "") {
        new Notice("Tugas dibatalkan: Deskripsi kosong.");
        return;
    }

    // 2. Format Tanggal
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

    // 3. Suggester Prioritas
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

    // Gabungkan menjadi string task
    const taskString = `- [ ] ${description.trim()}${due}${selectedPriority}`;

    // 4. Cari dan tulis ke file Tasks.md di bawah ## Active
    const taskFile = app.vault.getAbstractFileByPath("00 - Home/Tasks.md");
    if (!taskFile) {
        new Notice("File Tasks.md tidak ditemukan di folder 00 - Home!");
        return;
    }

    try {
        let content = await app.vault.read(taskFile);
        const activeHeader = "## Active";
        const index = content.indexOf(activeHeader);

        if (index !== -1) {
            // Find the line break after the header
            const afterHeader = content.indexOf('\n', index);
            const insertPos = afterHeader === -1 ? content.length : afterHeader + 1;
            content = content.slice(0, insertPos) + taskString + "\n" + content.slice(insertPos);
            await app.vault.modify(taskFile, content);
            new Notice("✅ Tugas berhasil ditambahkan!");
        } else {
            // Jika header tidak ditemukan, append ke paling bawah
            content += "\n" + taskString;
            await app.vault.modify(taskFile, content);
            new Notice("✅ Tugas ditambahkan ke akhir file.");
        }
    } catch (err) {
        new Notice(`Gagal menulis tugas: ${err.message}`);
    }
};
