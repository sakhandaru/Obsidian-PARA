---
type: project
area: ""
due:
created: <% tp.date.now("YYYY-MM-DD") %>
tags:
---

# <% tp.file.title %>

## Objective

Apa hasil konkret yang ingin dicapai?

## Actions

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

const handleNewProjectNote = async () => {
    const activeFile = app.workspace.getActiveFile();
    let defaultProj = "";
    if (activeFile && activeFile.path.startsWith("02 - Projects/")) {
        defaultProj = activeFile.basename;
    }

    const projFiles = app.vault.getMarkdownFiles().filter(f => f.path.startsWith("02 - Projects/") && !f.path.includes("TunTask"));
    const projList = projFiles.map(f => f.basename);

    const { SuggestModal } = require("obsidian");
    class ProjectSuggest extends SuggestModal {
        constructor(app, items, onSelect) {
            super(app);
            this.items = items;
            this.onSelect = onSelect;
            this.setPlaceholder("Pilih Proyek...");
        }
        getSuggestions(query) {
            return this.items.filter(item => item.toLowerCase().includes(query.toLowerCase()));
        }
        renderSuggestion(value, el) {
            el.createEl("div", { text: value });
        }
        onChooseSuggestion(item, evt) {
            this.onSelect(item);
        }
    }

    const runCreation = async (projName) => {
        const noteName = prompt("Ketik Nama Catatan Baru:");
        if (!noteName || !noteName.trim()) return;
        
        const cleanNoteName = noteName.trim();
        const projFile = projFiles.find(f => f.basename === projName);
        if (!projFile) return;
        
        const folderPath = "02 - Projects";
        const noteFileName = `${folderPath}/${projName} - ${cleanNoteName}.md`;
        
        // 1. Create the note
        let subNoteFile = app.vault.getAbstractFileByPath(noteFileName);
        if (!subNoteFile) {
            const dateStr = moment().format("YYYY-MM-DD");
            const subNoteContent = `---\ntype: note\nproject: [[${projName}]]\ncreated: ${dateStr}\n---\n\n# ${projName} - ${cleanNoteName}\n\nTautan Induk: [[${projName}]]\n\n- `;
            subNoteFile = await app.vault.create(noteFileName, subNoteContent);
        }
        
        // 2. Insert outlink under ## Notes in the project note file
        const projectContent = await app.vault.read(projFile);
        const notesRegex = /(## Notes\s*?\n)(.*?)(\n##|$)/s;
        let newProjectContent = projectContent;
        
        if (projectContent.match(notesRegex)) {
            newProjectContent = projectContent.replace(notesRegex, `$1$2\n- [[${projName} - ${cleanNoteName}]]\n$3`);
        } else {
            newProjectContent = projectContent + `\n\n## Notes\n\n- [[${projName} - ${cleanNoteName}]]`;
        }
        
        await app.vault.modify(projFile, newProjectContent);
        
        // 3. Open the newly created note
        if (subNoteFile) {
            app.workspace.getLeaf().openFile(subNoteFile);
        }
    };

    if (defaultProj) {
        await runCreation(defaultProj);
    } else {
        new ProjectSuggest(app, projList, runCreation).open();
    }
};

createButton("📝 New Project Note", handleNewProjectNote, "background-color: var(--interactive-accent); color: var(--text-on-accent); border: none; font-weight: 600;");
createButton("📥 Archive Project", "quickadd:choice:archive-active-note");
```

## Notes

- 

## Resources

- 
