export async function createActivityLog({
    user_id,
    action,
    description,
    ip_address,
    user_agent
}: {
    user_id: number;
    action: string;
    description?: string;
    ip_address?: string;
    user_agent?: string;
}) {
    try {
        await fetch('/activity-logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, action, description, ip_address, user_agent })
        });
    } catch (err) {
        // Không throw để không ảnh hưởng luồng chính
        console.warn('Failed to log activity:', err);
    }
} 