export function GiveawayStatus({ status }: { status: string }) {
  const colorByStatus = {
    pending: 'badge-neutral',
    'in progress': 'badge-success',
    completed: 'badge-info',
  };

  const badgeColor = colorByStatus[status];

  return (
    <div className={`badge ${badgeColor}	text-white select-none`}>
      <span className="pl-1">{status}</span>
    </div>
  );
}
