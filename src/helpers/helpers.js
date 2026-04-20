export const medalColor = (rank) => {
    if (rank === 1) return '#FFD700'
    if (rank === 2) return '#C0C0C0'
    if (rank === 3) return '#CD7F32'
    return null
}

export const scoreColor = (score) => {
    if (score >= 90) return 'var(--primary)'
    if (score >= 75) return '#059669'
    if (score >= 60) return '#d97706'
    return 'var(--error)'
}

export const formatDuration = (seconds) => {
    if (seconds == null) return '—'
    const m = Math.floor(seconds / 60)
    const s = Math.round(seconds % 60)
    return `${m}м ${String(s).padStart(2, '0')}с`
}

export const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : '—';
