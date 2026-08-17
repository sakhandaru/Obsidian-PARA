module.exports = async (params) => {
    const { app, quickAddApi } = params;

    // 1. Input Nama Project
    const projectName = await quickAddApi.inputPrompt("🆕 Nama Project Baru:");
    if (!projectName || projectName.trim() === "") {
        new Notice("Pembuatan project dibatalkan: Nama kosong.");
        return;
    }

    const cleanName = projectName.trim();
    const projectPath = `02 - Projects/${cleanName}.md`;

    // Cek apakah file sudah ada
    if (app.vault.getAbstractFileByPath(projectPath)) {
        new Notice("Project dengan nama ini sudah ada!");
        return;
    }

    // 2. Ambil daftar Area dari folder "01 - Areas"
    let areaOptions = ["❌ Tanpa Area"];
    let areaValues = [""];

    const areaFolder = app.vault.getAbstractFileByPath("01 - Areas");
    if (areaFolder) {
        const areaFiles = app.vault.getFiles().filter(file => file.path.startsWith("01 - Areas/") && file.extension === "md");
        areaFiles.forEach(file => {
            areaOptions.push(`🗺️ ${file.basename}`);
            areaValues.push(`[[${file.basename}]]`);
        });
    }

    const selectedArea = await quickAddApi.suggester(areaOptions, areaValues);
    if (selectedArea === undefined) return;

    // 3. Tentukan Due Date
    const today = new Date();
    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const addDays = (days) => {
        const result = new Date(today);
        result.setDate(today.getDate() + days);
        return result;
    };

    const dueOptions = [
        "❌ Tanpa Tenggat",
        `📅 1 Minggu Lagi (${formatDate(addDays(7))})`,
        `📅 2 Minggu Lagi (${formatDate(addDays(14))})`,
        `📅 1 Bulan Lagi (${formatDate(addDays(30))})`,
        "✏️ Pilih Tanggal Kustom (YYYY-MM-DD)"
    ];

    const dueValues = [
        "",
        formatDate(addDays(7)),
        formatDate(addDays(14)),
        formatDate(addDays(30)),
        "custom"
    ];

    const selectedDue = await quickAddApi.suggester(dueOptions, dueValues);
    if (selectedDue === undefined) return;

    let due = "";
    if (selectedDue === "custom") {
        const customDue = await quickAddApi.inputPrompt("Masukkan Tanggal (YYYY-MM-DD):", formatDate(today));
        if (customDue && /^\d{4}-\d{2}-\d{2}$/.test(customDue.trim())) {
            due = customDue.trim();
        } else if (customDue) {
            new Notice("Format tanggal salah! Gunakan YYYY-MM-DD.");
            return;
        }
    } else {
        due = selectedDue;
    }

    // 4. Baca template
    const templateFile = app.vault.getAbstractFileByPath("99 - Templates/Project.md");
    if (!templateFile) {
        new Notice("Template 'Project.md' tidak ditemukan!");
        return;
    }

    let templateContent = await app.vault.read(templateFile);

    // 5. Ganti properti frontmatter & konten
    const todayStr = formatDate(today);
    let finalContent = templateContent
        .replace(/area:\s*".*?"/g, `area: "${selectedArea}"`)
        .replace(/due:\s*.*?\n/g, `due: ${due}\n`)
        .replace(/created:\s*<%.*?%>/g, `created: ${todayStr}`)
        .replace(/#\s*<%.*?%>/g, `# ${cleanName}`);

    // Bersihkan sisa tag Templater jika ada
    finalContent = finalContent.replace(/<%.*?%>/g, "");

    // 6. Buat file
    const folder = app.vault.getAbstractFileByPath("02 - Projects");
    if (!folder) {
        await app.vault.createFolder("02 - Projects");
    }

    await app.vault.create(projectPath, finalContent);
    new Notice(`✅ Project '${cleanName}' berhasil dibuat!`);

    // Buka file
    const newFile = app.vault.getAbstractFileByPath(projectPath);
    if (newFile) {
        await app.workspace.getLeaf().openFile(newFile);
    }
};
