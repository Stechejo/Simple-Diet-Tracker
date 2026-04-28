export default function ConfirmModal({ title, message, cancelLabel, confirmLabel, onCancel, onConfirm }) {
    return (
        <div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-text">
            <div className="confirm-backdrop" onClick={onCancel}></div>

            <div className="confirm-box">
                <h3 id="confirm-title" className="confirm-title">
                    {title}
                </h3>
                <p id="confirm-text" className="confirm-text">
                    {message}
                </p>

                <div className="confirm-actions">
                    <button onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button className="confirm-ok" onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}