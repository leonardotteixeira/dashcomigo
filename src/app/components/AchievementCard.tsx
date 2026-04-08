import { Trophy, Star, Award, Target, Zap, TrendingUp } from "lucide-react";

const achievements = [
  {
    id: 1,
    title: "Primeira Receita",
    description: "Registrou sua primeira receita",
    icon: Star,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    completed: true,
    progress: 100,
  },
  {
    id: 2,
    title: "Sequência de 7 Dias",
    description: "Acessou o sistema por 7 dias seguidos",
    icon: Zap,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    completed: true,
    progress: 100,
  },
  {
    id: 3,
    title: "Meta Mensal",
    description: "Atingiu a meta de receita do mês",
    icon: Target,
    color: "text-success",
    bgColor: "bg-success/10",
    completed: true,
    progress: 100,
  },
  {
    id: 4,
    title: "Crescimento 20%",
    description: "Aumentou receitas em 20% vs mês anterior",
    icon: TrendingUp,
    color: "text-accent",
    bgColor: "bg-accent/10",
    completed: false,
    progress: 68,
  },
  {
    id: 5,
    title: "100 Transações",
    description: "Registrou 100 transações no sistema",
    icon: Award,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    completed: false,
    progress: 42,
  },
];

export default function AchievementCard() {
  const completedCount = achievements.filter(a => a.completed).length;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-foreground">Conquistas</h3>
        </div>
        <span className="text-sm bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full font-medium">
          {completedCount}/{achievements.length}
        </span>
      </div>

      <div className="space-y-3">
        {achievements.slice(0, 3).map((achievement) => {
          const Icon = achievement.icon;
          return (
            <div
              key={achievement.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                achievement.completed
                  ? "border-border bg-secondary/50"
                  : "border-dashed border-border"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg ${achievement.bgColor} flex items-center justify-center flex-shrink-0 ${
                !achievement.completed && "opacity-50"
              }`}>
                <Icon className={`w-5 h-5 ${achievement.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className={`font-semibold text-sm ${
                    achievement.completed ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {achievement.title}
                  </h4>
                  {achievement.completed && (
                    <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {achievement.description}
                </p>
                {!achievement.completed && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${achievement.bgColor.replace('/10', '')}`}
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {achievement.progress}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-3 text-sm text-primary hover:underline font-medium">
        Ver todas as conquistas →
      </button>
    </div>
  );
}
