module.exports = async (params) => {
    const { app } = params;
    const file = app.vault.getAbstractFileByPath("00 - Home/Today.md");
    if (file) {
        await app.workspace.getLeaf().openFile(file);
    }
};
