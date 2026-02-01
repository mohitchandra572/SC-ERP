export function NoticesPlaceholder() {
    return (
        <div className="p-6 border rounded-lg bg-white dark:bg-zinc-800 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Notices Board</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>🔔 Summer vacation starts from June 1st.</li>
                <li>🔔 Exam results will be published next week.</li>
                <li>🔔 Parents meeting on Friday at 10 AM.</li>
            </ul>
        </div>
    )
}

export function ContactPlaceholder() {
    return (
        <div className="p-6 border rounded-lg bg-slate-50 dark:bg-zinc-900 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="text-sm">📞 +880 1700 000000</p>
            <p className="text-sm">📧 info@school.com</p>
            <p className="text-sm">📍 Dhaka, Bangladesh</p>
        </div>
    )
}






