import { RxAvatar } from "react-icons/rx"
import StatusBadge from "./StatusBadge"

// ─── Student card ──────────────────────────────────────────────────────────────

function StudentCard({ student }) {
    const scoreColor =
        student.score >= 90 ? 'text-(--primary)'
            : student.score >= 70 ? 'text-(--primary)'
                : 'text-(--error)'

    return (
        <div className="group bg-(--surface-container-lowest) hover:bg-white transition-all duration-300 rounded-2xl p-4 md:p-6 shadow-[0_4px_12px_rgba(36,44,81,0.02)] hover:shadow-[0_20px_40px_rgba(36,44,81,0.08)] flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-(--secondary-container) overflow-hidden shrink-0 flex items-center justify-center">
                <RxAvatar className="text-4xl" />
            </div>

            {/* Name + group */}
            <div className="flex-1 text-center md:text-left">
                <h4 className="text-xl font-bold text-(--on-surface) group-hover:text-(--primary) transition-colors">
                    {student.student_name}
                </h4>
                <p className="text-(--on-surface-variant) font-medium">
                    GroupID: <code className="text-(--on-surface)">{student.attempt_id.slice(0, 10)}...</code>
                </p>
            </div>

            {/* Date + score */}
            <div className="grid grid-cols-2 md:flex items-center gap-8 text-center md:text-left">
                <div>
                    <p className="text-xs uppercase tracking-wider text-(--on-surface-variant) font-bold mb-1">Date</p>
                    <p className="font-bold">
                        {student.finished_at
                            ? new Date(student.finished_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : '—'}
                    </p>
                </div>
                <div>
                    <p className="text-xs uppercase tracking-wider text-(--on-surface-variant) font-bold mb-1">Score</p>
                    {student.score != null ? (
                        <p className={`text-2xl font-black ${scoreColor}`}>
                            {student.score}<span className="text-sm font-bold text-(--on-surface-variant)">/100</span>
                        </p>
                    ) : (
                        <p className="text-2xl font-black text-(--on-surface-variant)">
                            --<span className="text-sm font-bold">/100</span>
                        </p>
                    )}
                </div>
            </div>

            {/* Status + action */}
            <div className="shrink-0 flex flex-col items-center md:items-end gap-2">
                <StatusBadge status={student.status} />
                <button className="text-(--primary) text-sm font-bold hover:underline">
                    {student.status === 'In Progress' ? 'Track Activity' : 'View Details'}
                </button>
            </div>
        </div>
    )
}

export default StudentCard