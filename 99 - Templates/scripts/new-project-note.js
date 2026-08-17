module.exports = async (params) => {
    const { app, quickAddApi } = params;

    // 1. Deteksi apakah file aktif adalah proyek
    let selectedFile = app.workspace.getActiveFile();
    let selectedProjectName = "";

    const projectFiles = app.vault.getFiles().filter(file => {
        if (!file.path.startsWith("02 - Projects/") || file.extension !== "md") return false;
        const relativePath = file.path.substring("02 - Projects/".length);
        return !relativePath.includes("/");
    });

    if (selectedFile && selectedFile.path.startsWith("02 - Projects/") && selectedFile.extension === "md") {
        selectedProjectName = selectedFile.basename;
    } else {
        if (projectFiles.length === 0) {
            new Notice("Tidak ada proyek aktif di folder '02 - Projects'.");
            return;
        }

        const projectNames = projectFiles.map(file => file.basename);
        selectedProjectName = await quickAddApi.suggester(projectNames, projectNames);
        if (!selectedProjectName) return;

        selectedFile = projectFiles.find(file => file.basename === selectedProjectName);
    }

    // 2. Input Nama Catatan
    const noteName = await quickAddApi.inputPrompt(`📝 Catatan Baru untuk proyek [${selectedProjectName}]:`);
    if (!noteName || noteName.trim() === "") {
        new Notice("Pembuatan catatan dibatalkan.");
        return;
    }

    const cleanNoteName = noteName.trim();
    const folderPath = "02 - Projects";
    const noteFileName = `${folderPath}/${selectedProjectName} - ${cleanNoteName}.md`;

    try {
        // 3. Buat file catatan baru
        let subNoteFile = app.vault.getAbstractFileByPath(noteFileName);
        if (!subNoteFile) {
            const dateStr = window.moment ? window.moment().format("YYYY-MM-DD") : new Date().toISOString().slice(0, 10);
            const subNoteContent = `---\ntype: note\nproject: [[${selectedProjectName}]]\ncreated: ${dateStr}\n---\n\n# ${selectedProjectName} - ${cleanNoteName}\n\nTautan Induk: [[${selectedProjectName}]]\n\n- `;
            subNoteFile = await app.vault.create(noteFileName, subNoteContent);
        }

        // 4. Masukkan tautan ke bagian ## Notes di berkas proyek induk
        const projectContent = await app.vault.read(selectedFile);
        const notesRegex = /(## Notes\s*?\n)(.*?)(\n##|$)/s;
        let newProjectContent = projectContent;

        if (projectContent.match(notesRegex)) {
            newProjectContent = projectContent.replace(notesRegex, `$1$2\n- [[${selectedProjectName} - ${cleanNoteName}]]\n$3`);
        } else {
            newProjectContent = projectContent + `\n\n## Notes\n\n- [[${selectedProjectName} - ${cleanNoteName}]]`;
        }

        await app.vault.modify(selectedFile, newProjectContent);

        // 5. Buka berkas catatan baru
        if (subNoteFile) {
            app.workspace.getLeaf().openFile(subNoteFile);
        }
        new Notice(`✅ Catatan "${cleanNoteName}" berhasil dibuat!`);
    } catch (err) {
        new Notice(`Gagal membuat catatan: ${err.message}`);
    }
};
