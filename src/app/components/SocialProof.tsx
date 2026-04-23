import { Users, Star, TrendingUp, Award } from "lucide-react";

export default function SocialProof() {
  const stats = [
    { label: "MEIs ativos", value: "12.847", icon: Users },
    { label: "Avaliação média", value: "4.9/5", icon: Star },
    { label: "Economia média", value: "R$ 3.200", icon: TrendingUp },
  ];

  const testimonials = [
    {
      name: "Maria S.",
      role: "Consultora MEI",
      avatar: "MS",
      text: "Economizei R$ 4.500 no primeiro ano com as sugestões de otimização do Premium!",
      rating: 5,
    },
    {
      name: "Carlos R.",
      role: "Designer MEI",
      avatar: "CR",
      text: "O melhor investimento que fiz. Pago só pelo tempo que economizo mensalmente.",
      rating: 5,
    },
    {
      name: "Ana P.",
      role: "Desenvolvedora MEI",
      avatar: "AP",
      text: "Interface limpa, insights valiosos. Não consigo mais trabalhar sem!",
      rating: 5,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-5 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <p className="font-bold text-foreground mb-1" style={{ fontSize: "1.5rem" }}>
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Testimonials */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-foreground">
            O que nossos usuários Premium dizem
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                  {testimonial.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-500 text-amber-500"
                  />
                ))}
              </div>

              <p className="text-sm text-foreground italic">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
