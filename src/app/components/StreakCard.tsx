import { Flame, Trophy } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function StreakCard() {
  const { user } = useAuth();

  const currentStreak = user?.loginStreak ?? 0;
  const bestStreak = user?.bestStreak ?? 0;
  const rewardClaimed = user?.streakRewardClaimed ?? false;

  // Build last-7-days grid based on current streak
  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
  const today = new Date().getDay(); // 0=Sun … 6=Sat
  const completedDays = weekDays.map((_, i) => {
    // A day is "completed" if it falls within the current streak window
    const daysAgo = (today - i + 7) % 7;
    return daysAgo < currentStreak;
  });

  const GOAL = 7;
  const goalReached = currentStreak >= GOAL;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Sequência Ativa</h3>
            <p className="text-xs text-muted-foreground">Continue acessando diariamente</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-orange-500">{currentStreak} {currentStreak === 1 ? "dia" : "dias"}</p>
          <p className="text-xs text-muted-foreground">Recorde: {bestStreak}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        {weekDays.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                completedDays[index]
                  ? "bg-orange-500 text-white"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {day}
            </div>
            {completedDays[index] && (
              <div className="w-1 h-1 rounded-full bg-orange-500" />
            )}
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-lg p-3 border border-orange-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-semibold text-foreground">
            {user?.plan === "pro" ? "Consistência" : "Meta da Semana"}
          </span>
        </div>
        {user?.plan === "pro" ? (
          <p className="text-xs text-muted-foreground mb-2">
            {currentStreak >= GOAL
              ? `Incrível! ${currentStreak} dias consecutivos. Continue assim! 🔥`
              : `Acesse diariamente para manter sua sequência ativa.`}
          </p>
        ) : rewardClaimed ? (
          <p className="text-xs text-green-600 font-semibold mb-2">
            🎉 Recompensa ativa! Você ganhou 1 mês grátis do Premium.
          </p>
        ) : goalReached ? (
          <p className="text-xs text-muted-foreground mb-2">
            ✅ Meta atingida! Desbloqueando recompensa...
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mb-2">
            Acesse {GOAL} dias seguidos e ganhe 1 mês grátis do Premium!
          </p>
        )}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
              style={{ width: `${Math.min((currentStreak / GOAL) * 100, 100)}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-orange-500">
            {Math.min(currentStreak, GOAL)}/{GOAL}
          </span>
        </div>
      </div>
    </div>
  );
}
