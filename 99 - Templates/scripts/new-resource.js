module.exports = async (params) => {
    const { app, quickAddApi } = params;

    // 1. Input Nama Resource
    const resourceName = await quickAddApi.inputPrompt("🆕 Nama Resource Baru:");
    if (!resourceName || resourceName.trim() === "") {
        new Notice("Pembuatan resource dibatalkan: Nama kosong.");
        return;
    }

    const cleanName = resourceName.trim();
    const resourcePath = `03 - Resources/${cleanName}.md`;

    // Cek apakah file sudah ada
    if (app.vault.getAbstractFileByPath(resourcePath)) {
        new Notice("Resource dengan nama ini sudah ada!");
        return;
    }

    // 2. Input Source (URL atau Buku)
    const source = await quickAddApi.inputPrompt("🔗 Sumber (URL / Judul Buku / dll) - opsional:");
    const cleanSource = source ? source.trim() : "";

    // 3. Input Tags
    const tagsInput = await quickAddApi.inputPrompt("🏷️ Tags (pisahkan dengan koma, contoh: article, finance) - opsional:");
    let tagsArray = [];
    if (tagsInput && tagsInput.trim() !== "") {
        tagsArray = tagsInput.split(",").map(t => `"${t.trim()}"`);
    }
    const tagsYaml = tagsArray.length > 0 ? `[${tagsArray.join(", ")}]` : "[]";

    // 4. Baca template
    const templateFile = app.vault.getAbstractFileByPath("99 - Templates/Resource.md");
    if (!templateFile) {
        new Notice("Template 'Resource.md' tidak ditemukan!");
        return;
    }

    let templateContent = await app.vault.read(templateFile);

    // 5. Ganti properti frontmatter & konten
    let finalContent = templateContent
        .replace(/source:\s*.*?\n/g, `source: ${cleanSource}\n`)
        .replace(/tags:\s*\[.*?\]/g, `tags: ${tagsYaml}`)
        .replace(/#\s*<%.*?%>/g, `# ${cleanName}`);

    // Bersihkan sisa tag Templater jika ada
    finalContent = finalContent.replace(/<%.*?%>/g, "");

    // 6. Buat file
    const folder = app.vault.getAbstractFileByPath("03 - Resources");
    if (!folder) {
        await app.vault.createFolder("03 - Resources");
    }

    await app.vault.create(resourcePath, finalContent);
    new Notice(`✅ Resource '${cleanName}' berhasil dibuat!`);

    // Buka file
    const newFile = app.vault.getAbstractFileByPath(resourcePath);
    if (newFile) {
        await app.workspace.getLeaf().openFile(newFile);
    }
};
