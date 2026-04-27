let editingDate = null;

function setEntryModalOpen(open) {
    const modal = document.getElementById('entryModal');
    if (!modal) return;
    modal.classList.toggle('active', open);
    modal.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle('modal-open', open);
}

window.openEntryModal = function () {
    editingDate = null;
    document.getElementById('entryModalTitle').textContent = T('modalTitleNew');
    document.getElementById('addBtn').textContent = T('btnAddNew');
    document.getElementById('cancelBtn').textContent = T('btnCancel');
    document.getElementById('fDate').value = todayISO();
    document.getElementById('fV').value = '';
    document.getElementById('fI').value = '';
    document.getElementById('fG').value = '';
    updatePreview();
    setEntryModalOpen(true);
};

window.closeEntryModal = function () {
    setEntryModalOpen(false);
};

window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeEntryModal();
});

function initForm(allEntries, targetWeight, targetDeficit) {
    document.getElementById('fDate').value = todayISO();
    updatePreview();
}

function formNumber(id) {
    const raw = String(document.getElementById(id).value || '').replace(',', '.');
    return Number(raw);
}

function updatePreview() {
    const date = document.getElementById('fDate').value;
    const v = formNumber('fV');
    const i = formNumber('fI');
    const g = formNumber('fG');
    const preview = document.getElementById('preview');
    const btn = document.getElementById('addBtn');
    const dateOk = isValidISODate(date);
    const ok = dateOk && v > 0 && i >= 0 && g > 0;

    btn.disabled = !ok;
    preview.style.display = (ok || (date && !dateOk)) ? 'block' : 'none';
    preview.classList.toggle('error', Boolean(date && !dateOk));
    if (date && !dateOk) {
        preview.textContent = T('previewDateError');
        return;
    }
    if (ok) preview.textContent = T('previewDeficit')(fmt(v - i), fmtWeight(g));
}

function settingsText(de, en) {
    return currentLang === 'de' ? de : en;
}

function updateSettingsTexts() {
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    setText('settingsBtn', settingsText('⚙ Einstellungen', '⚙ Settings'));
    setText('settingsKicker', settingsText('Setup', 'Setup'));
    setText('settingsModalTitle', settingsText('Einstellungen', 'Settings'));
    setText('settingsStartLabel', settingsText('Startgewicht (kg)', 'Start weight (kg)'));
    setText('settingsTargetLabel', settingsText('Zielgewicht (kg)', 'Target weight (kg)'));
    setText('settingsDeficitLabel', settingsText('Geplantes Defizit (kcal/Tag)', 'Planned deficit (kcal/day)'));
    setText('settingsCancelBtn', settingsText('Abbrechen', 'Cancel'));
    setText('settingsSaveBtn', settingsText('Speichern', 'Save'));
}

window.openSettingsModal = function () {
    updateSettingsTexts();
    document.getElementById('sStartWeight').value = startWeight > 0 ? startWeight : '';
    document.getElementById('sTargetWeight').value = targetWeight > 0 ? targetWeight : '';
    document.getElementById('sTargetDeficit').value = targetDeficit > 0 ? targetDeficit : '';
    document.getElementById('settingsPreview').style.display = 'none';
    const modal = document.getElementById('settingsModal');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
};

window.closeSettingsModal = function () {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
};

window.saveSettings = function () {
    const sw = formNumber('sStartWeight');
    const tw = formNumber('sTargetWeight');
    const td = formNumber('sTargetDeficit');

    startWeight = sw > 0 ? sw : 0;
    targetWeight = tw > 0 ? tw : 0;
    targetDeficit = td > 0 ? td : 0;

    saveStartWeight(startWeight);
    saveTarget(targetWeight);
    saveTargetDeficit(targetDeficit);

    renderAll(entries, targetWeight, targetDeficit, startWeight);
    closeSettingsModal();
    showToast(settingsText('Einstellungen gespeichert.', 'Settings saved.'), 'success');
};

function showConfirm(message, onYes) {
    const modal = document.createElement('div');
    modal.className = 'confirm-modal';

    modal.innerHTML = `
        <div class="confirm-backdrop"></div>
        <div class="confirm-box">
            <div class="confirm-text">${message}</div>
            <div class="confirm-actions">
                <button class="confirm-cancel">${T('confirmCancel')}</button>
                <button class="confirm-ok">${T('confirmOk')}</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
        window.removeEventListener('keydown', handleKey);
        document.body.removeChild(modal);
    };

    const confirmDelete = () => {
        onYes();
        close();
    };

    const handleKey = (event) => {
        if (event.key === 'Enter') confirmDelete();
        if (event.key === 'Escape') close();
    };

    window.addEventListener('keydown', handleKey);

    modal.querySelector('.confirm-cancel').onclick = close;
    modal.querySelector('.confirm-ok').onclick = confirmDelete;
}

function addEntry() {
    const newEntry = {
        date: document.getElementById('fDate').value,
        verbraucht: formNumber('fV'),
        intake: formNumber('fI'),
        gewicht: formNumber('fG')
    };
    if (!isValidISODate(newEntry.date) || newEntry.verbraucht <= 0 || newEntry.intake < 0 || newEntry.gewicht <= 0) {
        updatePreview();
        return;
    }

    entries = entries.filter(e => e.date !== (editingDate || newEntry.date));
    entries.push(newEntry);
    entries = normalizeEntries(entries);
    saveEntries(entries);
    cancelEdit(false);
    renderAll(entries, targetWeight, targetDeficit, startWeight);
    closeEntryModal();
    switchTab('uebersicht');
}

window.editEntry = function (date) {
    const e = entries.find(x => x.date === date);
    if (!e) return;
    editingDate = date;
    document.getElementById('fDate').value = e.date;
    document.getElementById('fV').value = e.verbraucht;
    document.getElementById('fI').value = e.intake;
    document.getElementById('fG').value = e.gewicht;
    document.getElementById('entryModalTitle').textContent = T('modalTitleEdit');
    document.getElementById('addBtn').textContent = T('btnSave');
    document.getElementById('cancelBtn').textContent = T('btnCancel');
    updatePreview();
    setEntryModalOpen(true);
};

window.deleteEntry = function (date) {
    showConfirm(T('confirmDelete'), () => {
        entries = normalizeEntries(entries.filter(e => e.date !== date));
        saveEntries(entries);
        renderAll(entries, targetWeight, targetDeficit, startWeight);
    });
};

function cancelEdit(clear = true) {
    editingDate = null;
    document.getElementById('entryModalTitle').textContent = T('modalTitleNew');
    document.getElementById('addBtn').textContent = T('btnAddNew');
    document.getElementById('cancelBtn').textContent = T('btnCancel');

    if (clear) {
        closeEntryModal();
        return;
    }

    document.getElementById('fDate').value = todayISO();
    document.getElementById('fV').value = '';
    document.getElementById('fI').value = '';
    document.getElementById('fG').value = '';
    updatePreview();
}
window.cancelEdit = cancelEdit;
