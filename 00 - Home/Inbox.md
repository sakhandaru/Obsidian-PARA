```dataviewjs
const container = dv.el("div", "", {
    cls: "dashboard-btn-container"
});

const createButton = (label, action, activeStyle = "") => {
    const btn = document.createElement("button");
    btn.innerText = label;
    btn.className = "dashboard-btn";
    if (activeStyle) {
        btn.style = activeStyle;
    }
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

createButton("✅ New Task", "quickadd:choice:capture-task", "background-color: var(--interactive-accent); color: var(--text-on-accent); border: none; font-weight: 600;");
createButton("🔁 Recurring Task", "quickadd:choice:new-recurring-task");
createButton("📥 Capture Inbox", "quickadd:choice:capture-inbox");
createButton("📈 Overview", () => {
    const file = app.vault.getAbstractFileByPath("00 - Home/Overview.md");
    if (file) app.workspace.getLeaf().openFile(file);
});
createButton("🗓️ Today", async () => {
    await app.workspace.openLinkText("Today", "00 - Home", false);
});
createButton("📋 Tasks", () => {
    const file = app.vault.getAbstractFileByPath("00 - Home/Tasks (lepas).md");
    if (file) app.workspace.getLeaf().openFile(file);
});
```

## 📥 Captured

- compounding interestd 
- pikirin strategi soal wajah
- compounding interestd 
- cari tahu soal MT manajemen training
- gym rat
- gym lagi

---

- jangan lupa segera eksekusi brand baju

- next-lang-lib## 📔 Reviewed

 - coba cari tahu soal ollama + qwen3 + macbook + local + beratnya menjalankannya -> [[Ai Local]]
 - besok riset gym dan gaya hidup sehat [[Abstraksi Sehat]]
 - 