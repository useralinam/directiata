import { Compass, Sparkles, Rocket, Trophy } from "lucide-react";

const steps = [
  {
    icon: Compass,
    number: "01",
    title: "Descoperă cine ești",
    description:
      "Completează quiz-ul nostru rapid (2 min) și află ce tip de explorator ești. Fără răspunsuri greșite — doar descoperire.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "Primește recomandări",
    description:
      "Pe baza intereselor tale, vârstei și locației, primești un feed personalizat cu oportunitățile perfecte pentru tine.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Trăiește experiența",
    description:
      "Înscrie-te, participă, învață. Fiecare experiență se adaugă la portfoliul tău și te ajută să îți construiești viitorul.",
    color: "bg-accent-green/10 text-accent-green",
  },
  {
    icon: Trophy,
    number: "04",
    title: "Crești și inspiri",
    description:
      "Câștigi badge-uri, deblochezi niveluri, scrii review-uri care ajută alți tineri. Direcția ta devine clară.",
    color: "bg-accent-purple/10 text-accent-purple",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Cum <span className="text-primary">funcționează</span>?
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            De la curiozitate la acțiune — în 4 pași simpli.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative text-center animate-fade-in-up"
            >
              {/* Connection line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-border" />
              )}

              <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-5`}>
                <step.icon className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold text-muted tracking-widest uppercase mb-2 block">
                Pasul {step.number}
              </span>
              <h3 className="text-lg font-bold mb-3">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
