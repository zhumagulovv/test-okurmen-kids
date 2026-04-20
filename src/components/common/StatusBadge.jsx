import { STATUS_LABELS, STATUS_STYLES } from "../../constants/constants"

function StatusBadge({ status }) {
    const cls = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600'
    return (
        <span className={`${cls} px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest`}>
            {STATUS_LABELS[status] ?? status}
        </span>
    )
}

export default StatusBadge