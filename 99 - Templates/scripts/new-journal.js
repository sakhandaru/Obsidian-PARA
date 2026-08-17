module.exports = async (params) => {
    const { app, quickAddApi } = params;

    // 1. Tentukan tanggal hari ini
    const todayStr = moment().format("YYYY-MM-DD");
    const journalPath = `04 - Journal/${todayStr}.md`;

    // 2. Cek apakah file jurnal hari ini sudah ada
    const existingFile = app.vault.getAbstractFileByPath(journalPath);
    if (existingFile) {
        new Notice("Jurnal hari ini sudah ada, membuka berkas...");
        
        // Buka berkas yang ada
        await app.workspace.getLeaf().openFile(existingFile);
        return;
    }

    // 3. Baca template
    const templateFile = app.vault.getAbstractFileByPath("99 - Templates/Journal.md");
    if (!templateFile) {
        new Notice("Templat 'Journal.md' tidak ditemukan!");
        return;
    }

    let templateContent = await app.vault.read(templateFile);

    // 4. Ganti properti frontmatter & konten secara dinamis
    // date: <% tp.date.now("YYYY-MM-DD") %> -> date: YYYY-MM-DD
    // # <% tp.date.now("dddd, D MMMM YYYY") %> -> # Sunday, 7 June 2026
    const todayTitle = moment().format("dddd, D MMMM YYYY");
    let finalContent = templateContent
        .replace(/date:\s*<%.*?%>/g, `date: ${todayStr}`)
        .replace(/#\s*<%.*?%>/g, `# ${todayTitle}`);

    // Bersihkan sisa tag Templater jika ada
    finalContent = finalContent.replace(/<%.*?%>/g, "");

    // 5. Buat Folder 04 - Journal jika belum ada
    const folder = app.vault.getAbstractFileByPath("04 - Journal");
    if (!folder) {
        await app.vault.createFolder("04 - Journal");
    }

    // 6. Buat Catatan Jurnal Baru
    await app.vault.create(journalPath, finalContent);
    new Notice(`✅ Jurnal hari ini berhasil dibuat di folder 04 - Journal!`);
    
    // Buka berkas yang baru dibuat
    const newFile = app.vault.getAbstractFileByPath(journalPath);
    if (newFile) {
        await app.workspace.getLeaf().openFile(newFile);
    }
};
