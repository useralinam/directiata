import { Users, Calendar, Building2, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Calendar,
    value: "100+",
    label: "Oportunități listate",
    color: "text-primary",
  },
  {
    icon: Building2,
    value: "60+",
    label: "Organizații verificate",
    color: "text-secondary",
  },
  {
    icon: Users,
    value: "6",
    label: "Categorii disponibile",
    color: "text-accent-green",
  },
  {
    icon: TrendingUp,
    value: "Zeci",
    label: "Surse verificate",
    color: "text-accent-purple",
  },
];

export default function StatsBar() {
  return (
    <section className="py-6 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 justify-center animate-fade-in-up"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} shrink-0`} />
              <div>
                <p className={`text-lg sm:text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
