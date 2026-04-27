function loadEntries() {
    try {
        const current = localStorage.getItem(STORAGE_KEY);
        if (current) return normalizeEntries(JSON.parse(current));

        const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacy) return normalizeEntries(JSON.parse(legacy));
    } catch (e) { console.error(e); }

    return normalizeEntries(JSON.parse(JSON.stringify(DEFAULT_DATA)));
}

function saveEntries(entries) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeEntries(entries)));
    } catch (e) { console.error(e); }
}

function loadStartWeight() {
    try {
        const v = Number(localStorage.getItem(START_WEIGHT_KEY));
        return v > 0 ? v : 0;
    } catch {
        return 0;
    }
}

function saveStartWeight(v) {
    try {
        if (v > 0) localStorage.setItem(START_WEIGHT_KEY, String(v));
        else localStorage.removeItem(START_WEIGHT_KEY);
    } catch (e) { console.error(e); }
}

function loadTarget() {
    try {
        const v = Number(localStorage.getItem(TARGET_KEY));
        return v > 0 ? v : 0;
    } catch {
        return 0;
    }
}

function saveTarget(v) {
    try {
        if (v > 0) localStorage.setItem(TARGET_KEY, String(v));
        else localStorage.removeItem(TARGET_KEY);
    } catch (e) { console.error(e); }
}

function loadTargetDeficit() {
    try {
        const v = Number(localStorage.getItem(TARGET_DEFICIT_KEY));
        return v > 0 ? v : 0;
    } catch {
        return 0;
    }
}

function saveTargetDeficit(v) {
    try {
        if (v > 0) localStorage.setItem(TARGET_DEFICIT_KEY, String(v));
        else localStorage.removeItem(TARGET_DEFICIT_KEY);
    } catch (e) { console.error(e); }
}

window.exportData = function () {
    const exportObject = {
        entries: entries,
        startWeight: startWeight,
        targetWeight: targetWeight,
        targetDeficit: targetDeficit,
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportObject, null, 2);
    const blob = new Blob([dataStr], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `diaet-tracker-backup-${todayISO()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(T('toastExportOk'), 'success');
};

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2600);
}

window.importData = function (input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const imported = JSON.parse(e.target.result);

            if (imported.entries && Array.isArray(imported.entries)) {
                entries = normalizeEntries(imported.entries);
                saveEntries(entries);

                if (imported.startWeight > 0) {
                    startWeight = imported.startWeight;
                    saveStartWeight(startWeight);
                }

                if (imported.targetWeight > 0) {
                    targetWeight = imported.targetWeight;
                    saveTarget(targetWeight);
                }

                if (imported.targetDeficit > 0) {
                    targetDeficit = imported.targetDeficit;
                    saveTargetDeficit(targetDeficit);
                }

                renderAll(entries, targetWeight, targetDeficit, startWeight);
                showToast(T('toastImportOk')(entries.length), 'success');
            } else {
                showToast(T('toastImportInvalid'), 'error');
            }
        } catch (err) {
            showToast(T('toastImportFailed')(err.message), 'error');
        }

        input.value = '';
    };
    reader.readAsText(file);
};
