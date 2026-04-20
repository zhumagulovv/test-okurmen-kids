export const Loading = ({ message = 'Загрузка...' }) => (
    <section className="bg-(--surface-container-lowest) min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 text-center">
            {/* Spinner ring */}
            <div style={{
                width: 48, height: 48, borderRadius: '50%',
                border: '3px solid var(--surface-container-high)',
                borderTopColor: 'var(--primary)',
                animation: 'spin 0.8s linear infinite',
            }} />

            <div>
                <p className="font-headline font-bold text-xl text-(--on-surface)">{message}</p>
            </div>

            {/* Indeterminate bar */}
            <div className="w-48 h-1 bg-(--surface-container-high) rounded-full overflow-hidden">
                <div style={{
                    height: '100%', background: 'var(--primary)',
                    borderRadius: 9999,
                    animation: 'loadbar 2.4s ease-in-out infinite',
                }} />
            </div>
        </div>

        {/* CSS — add to your global stylesheet */}
        {/* @keyframes spin { to { transform: rotate(360deg) } } */}
        {/* @keyframes loadbar { 0%{width:0%,marginLeft:0} 50%{width:60%} 100%{width:0%,marginLeft:100%} } */}
    </section>
)