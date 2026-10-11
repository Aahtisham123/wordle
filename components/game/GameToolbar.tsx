import { BarChart3, RotateCcw, Share2, Users } from "lucide-react";

export function GameToolbar({
  onNew,
  onShare,
  onChallenge,
  onStats,
}: {
  onNew: () => void;
  onShare: () => void;
  onChallenge: () => void;
  onStats: () => void;
}) {
  const actions = [
    { label: "New Game", icon: RotateCcw, onClick: onNew },
    { label: "Share", icon: Share2, onClick: onShare },
    { label: "Challenge Friend", icon: Users, onClick: onChallenge },
    { label: "Statistics", icon: BarChart3, onClick: onStats },
  ];
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={action.onClick}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--line)] px-3 text-sm font-semibold"
        >
          <action.icon size={16} aria-hidden="true" />
          {action.label}
        </button>
      ))}
    </div>
  );
}
