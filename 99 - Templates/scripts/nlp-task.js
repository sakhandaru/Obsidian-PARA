module.exports = async (params) => {
    const { app, quickAddApi } = params;

    // 1. Ambil atau Buat Konfigurasi Google Calendar
    const configFile = "99 - Templates/scripts/gcal_config.json";
    let config = { webAppUrl: "", token: "" };

    const configAbstractFile = app.vault.getAbstractFileByPath(configFile);
    if (configAbstractFile) {
        try {
            config = JSON.parse(await app.vault.read(configAbstractFile));
        } catch (e) {
            new Notice("⚠️ Gagal membaca gcal_config.json, menggunakan nilai default.");
        }
    } else {
        // Wizard Konfigurasi Awal
        new Notice("⚙️ Memulai konfigurasi integrasi Google Calendar...");
        const url = await quickAddApi.inputPrompt("🔗 Masukkan URL Google Apps Script Web App (kosongkan jika hanya ingin parsing lokal):");
        let token = "";
        if (url && url.trim() !== "") {
            token = await quickAddApi.inputPrompt("🔑 Tentukan Security Token (bebas, harus sama dengan di Apps Script):");
        }
        
        config = {
            webAppUrl: url ? url.trim() : "",
            token: token ? token.trim() : ""
        };
        
        await app.vault.create(configFile, JSON.stringify(config, null, 2));
        new Notice("✅ Konfigurasi disimpan! (Hapus gcal_config.json jika ingin mengulang setup)");
    }

    // 2. Input Deskripsi Tugas Natural Language
    const rawInput = await quickAddApi.inputPrompt("📋 Tulis Tugas (NLP):", "misal: Rapat koordinasi besok jam 10 pagi penting !");
    if (!rawInput || rawInput.trim() === "") {
        new Notice("Pembuatan tugas dibatalkan: Masukan kosong.");
        return;
    }

    // 3. NLP Parser (Bahasa Indonesia)
    const parseNaturalLanguage = (input) => {
        const today = new Date();
        let title = input.trim().replace(/\s+/g, ' ');
        let rawDate = "";
        let rawTime = "";
        let prioritySymbol = "";

        const formatDate = (d) => {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
        };
        const addDays = (d, days) => {
            const result = new Date(d);
            result.setDate(d.getDate() + days);
            return result;
        };
        const nextWeekday = (dayIndex, base = new Date()) => {
            const current = base.getDay();
            const distance = (dayIndex - current + 7) % 7 || 7;
            return addDays(base, distance);
        };

        const weekdayMap = new Map([
            ['minggu', 0],
            ['senin', 1],
            ['selasa', 2],
            ['rabu', 3],
            ['kamis', 4],
            ['jumat', 5],
            ['sabtu', 6]
        ]);

        // A. Deteksi Prioritas (Check all, replace all)
        let isHigh = false;
        let isMedium = false;
        let isLow = false;

        if (title.includes('!')) {
            isHigh = true;
            title = title.replace(/!+/g, ' ');
        }
        if (/\b(penting|tinggi)\b/i.test(title)) {
            isHigh = true;
            title = title.replace(/\b(penting|tinggi)\b/gi, ' ');
        }
        if (/\bsedang\b/i.test(title)) {
            isMedium = true;
            title = title.replace(/\bsedang\b/gi, ' ');
        }
        if (/\b(rendah|kecil)\b/i.test(title)) {
            isLow = true;
            title = title.replace(/\b(rendah|kecil)\b/gi, ' ');
        }

        if (isHigh) prioritySymbol = " 🔺";
        else if (isMedium) prioritySymbol = " 🔼";
        else if (isLow) prioritySymbol = " 🔽";

        // B. Deteksi Waktu (Jam) - mendukung modifier di depan atau di belakang
        const timeRegex = /(pagi|siang|sore|malam)?\s*(?:jam|pukul)\s*(\d{1,2})(?:\s*[:.]\s*(\d{2}))?\s*(pagi|siang|sore|malam)?/i;
        const timeMatch = title.match(timeRegex);
        if (timeMatch) {
            let hour = parseInt(timeMatch[2], 10);
            let minute = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;
            const modifier = (timeMatch[1] || timeMatch[4] || "").toLowerCase();

            if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
                if (modifier) {
                    if (modifier === 'pagi') {
                        if (hour === 12) hour = 0;
                    } else if (modifier === 'siang') {
                        if (hour < 12) hour += 12;
                    } else if (modifier === 'sore') {
                        if (hour < 12) hour += 12;
                    } else if (modifier === 'malam') {
                        if (hour < 12) hour += 12;
                        if (hour === 24) hour = 0;
                    }
                } else {
                    if (hour < 7) {
                        hour += 12; // Default ke PM jika di bawah jam 7 tanpa keterangan
                    }
                }
                rawTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
                title = title.replace(timeRegex, ' ');
            }
        }

        // C. Deteksi Tanggal (Relative & Weekdays, stripping optional "hari " prefix)
        const dateLower = title.toLowerCase();
        if (/(?:hari\s+)?\blusa\b/i.test(dateLower)) {
            rawDate = formatDate(addDays(today, 2));
            title = title.replace(/(?:hari\s+)?\blusa\b/gi, ' ');
        } else if (/(?:hari\s+)?\bminggu depan\b/i.test(dateLower)) {
            rawDate = formatDate(addDays(today, 7));
            title = title.replace(/(?:hari\s+)?\bminggu depan\b/gi, ' ');
        } else if (/(?:hari\s+)?\bbesok\b/i.test(dateLower)) {
            rawDate = formatDate(addDays(today, 1));
            title = title.replace(/(?:hari\s+)?\bbesok\b/gi, ' ');
        } else if (/(?:hari\s+)?\bhari ini\b/i.test(dateLower)) {
            rawDate = formatDate(today);
            title = title.replace(/(?:hari\s+)?\bhari ini\b/gi, ' ');
        } else {
            for (const [dayName, dayIndex] of weekdayMap) {
                const pattern = new RegExp(`(?:hari\\s+)?\\b${dayName}\\b`, 'i');
                if (pattern.test(dateLower)) {
                    rawDate = formatDate(nextWeekday(dayIndex, today));
                    title = title.replace(pattern, ' ');
                    break;
                }
            }
        }

        // D. Pembersihan Spasi & Default Title
        title = title.replace(/\s+/g, ' ').trim();
        if (!title) {
            title = input.trim();
        }

        return {
            title,
            rawDate,
            rawTime,
            dueDate: rawDate ? ` 📅 ${rawDate}` : "",
            dueTime: rawTime ? ` ⏰ ${rawTime}` : "",
            prioritySymbol
        };
    };

    const parsed = parseNaturalLanguage(rawInput);
    const taskString = `- [ ] ${parsed.title}${parsed.dueDate}${parsed.dueTime}${parsed.prioritySymbol}`;

    // 4. Tulis ke file Tasks (lepas).md di bawah ## 🗃️ Task Source
    const taskFile = app.vault.getAbstractFileByPath("00 - Home/Tasks (lepas).md");
    if (!taskFile) {
        new Notice("⚠️ File Tasks (lepas).md tidak ditemukan!");
        return;
    }

    try {
        let content = await app.vault.read(taskFile);
        const activeHeader = "## 🗃️ Task Source";
        const index = content.indexOf(activeHeader);

        if (index !== -1) {
            const afterHeader = content.indexOf('\n', index);
            const insertPos = afterHeader === -1 ? content.length : afterHeader + 1;
            content = content.slice(0, insertPos) + taskString + "\n" + content.slice(insertPos);
            await app.vault.modify(taskFile, content);
        } else {
            content += "\n" + taskString;
            await app.vault.modify(taskFile, content);
        }
        new Notice(`✅ Tugas lokal berhasil disimpan!`);
    } catch (err) {
        new Notice(`⚠️ Gagal menulis tugas lokal: ${err.message}`);
        return;
    }

    // 5. Sinkronisasi ke Google Calendar jika dikonfigurasi (Asynchronous & Graceful)
    if (config.webAppUrl && config.webAppUrl.trim() !== "") {
        new Notice("⏳ Menyinkronkan tugas ke Google Calendar...");
        
        const requestParams = {
            url: config.webAppUrl,
            method: "POST",
            contentType: "application/json",
            body: JSON.stringify({
                title: parsed.title,
                date: parsed.rawDate,
                time: parsed.rawTime,
                token: config.token
            }),
            throw: false
        };

        const fetchFunc = window.requestUrl ? window.requestUrl : requestUrl;

        fetchFunc(requestParams)
            .then((res) => {
                if (res.status === 200) {
                    try {
                        const resData = typeof res.json === "object" ? res.json : JSON.parse(res.text);
                        if (resData.status === "success") {
                            new Notice("📅 Berhasil disinkronkan ke Google Calendar!");
                        } else {
                            new Notice(`⚠️ Gagal sinkron ke GCal: ${resData.message}`);
                        }
                    } catch (e) {
                        new Notice("⚠️ Respon GCal tidak valid.");
                    }
                } else {
                    new Notice(`⚠️ GCal merespon dengan status ${res.status}`);
                }
            })
            .catch(() => {
                new Notice("⚠️ Gagal terhubung ke GCal (offline/jaringan bermasalah).");
            });
    }
};
