module.exports = async (params) => {
    const { app } = params;

    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) {
        new Notice("❌ Tidak ada file aktif yang terbuka!");
        return;
    }

    // Baca file cache untuk mendeteksi tipe
    const fileCache = app.metadataCache.getFileCache(activeFile);
    const frontmatter = fileCache ? fileCache.frontmatter : null;

    if (!frontmatter || !frontmatter.type) {
        new Notice("❌ File ini tidak memiliki properti 'type' di frontmatter!");
        return;
    }

    const type = frontmatter.type;
    let archiveTag = "";
    let folderName = "";

    if (type === "project") {
        archiveTag = "archive/project";
        folderName = "Projects";
    } else if (type === "area") {
        archiveTag = "archive/area";
        folderName = "Areas";
    } else if (type === "habit") {
        archiveTag = "archive/habit";
        folderName = "Habits";
    } else {
        new Notice(`❌ Tipe catatan '${type}' tidak didukung untuk pengarsipan.`);
        return;
    }

    // Buat subfolder di 05 - Archive jika belum ada
    const targetFolder = `05 - Archive/${folderName}`;
    if (!app.vault.getAbstractFileByPath(targetFolder)) {
        await app.vault.createFolder(targetFolder);
    }

    // Update frontmatter secara aman menggunakan API resmi Obsidian
    await app.fileManager.processFrontMatter(activeFile, (fm) => {
        // Tambah tag
        if (!fm.tags) {
            fm.tags = [archiveTag];
        } else if (Array.isArray(fm.tags)) {
            if (!fm.tags.includes(archiveTag)) {
                fm.tags.push(archiveTag);
            }
        } else if (typeof fm.tags === "string") {
            if (fm.tags !== archiveTag) {
                fm.tags = [fm.tags, archiveTag];
            }
        }
    });

    new Notice(`📥 ${type.charAt(0).toUpperCase() + type.slice(1)} '${activeFile.basename}' berhasil diarsipkan!`);
};
