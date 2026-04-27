let entries = [];
let startWeight = 0;
let targetWeight = 0;
let targetDeficit = 0;

window.switchTab = function (name) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

    document.getElementById('panel-' + name).classList.add('active');

    const tabs = document.querySelectorAll('.tab');
    if (name === 'perioden') tabs[1].classList.add('active');
    else tabs[0].classList.add('active');
};

function init() {
    entries = loadEntries();
    startWeight = loadStartWeight();
    targetWeight = loadTarget();
    targetDeficit = loadTargetDeficit();

    applyI18n();

    initForm(entries, targetWeight, targetDeficit);
    renderAll(entries, targetWeight, targetDeficit, startWeight);

    ['fDate', 'fV', 'fI', 'fG'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => window.updatePreview());
    });

    window.updatePreview = updatePreview;
    window.addEntry = addEntry;
}

init();
