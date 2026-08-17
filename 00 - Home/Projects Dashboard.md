---
type: dashboard
---

# 🗂️ Projects Dashboard

Daftar semua proyek aktif beserta *progress bar* penyelesaian tugasnya.

```dataviewjs
const pages = dv.pages('"02 - Projects"').filter(p => !p.file.path.includes("02 - Projects/TunTask"));

dv.table(["Proyek", "Area", "Tenggat", "Jumlah Catatan Terkait"], pages.map(p => {
    const outlinks = p.file.outlinks;
    const count = outlinks.length;
    const label = count > 0 ? `🔗 ${count} sub-catatan` : "-";
    
    return [
        p.file.link,
        p.area || "-",
        p.due || "-",
        label
    ];
}));
```
