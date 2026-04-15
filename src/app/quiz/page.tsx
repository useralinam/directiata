"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Compass, Check } from "lucide-react";
import Link from "next/link";

const questions = [
  {
    id: "1",
    question: "Ce faci cel mai des în timpul liber?",
    options: [
      { label: "Citesc, scriu, învăț ceva nou", value: "intelectual", emoji: "📚" },
      { label: "Ies cu prietenii, organizez întâlniri", value: "social", emoji: "👋" },
      { label: "Creez: desene, muzică, cod, video", value: "creativ", emoji: "🎨" },
      { label: "Sport, drumeții, aventuri", value: "activ", emoji: "⚡" },
    ],
  },
  {
    id: "2",
    question: "Ce te entuziasmează cel mai mult?",
    options: [
      { label: "Să rezolv probleme complexe", value: "analitic", emoji: "🧩" },
      { label: "Să ajut oamenii din jurul meu", value: "empatic", emoji: "❤️" },
      { label: "Să descopăr locuri și culturi noi", value: "explorator", emoji: "🌍" },
      { label: "Să construiesc ceva de la zero", value: "antreprenor", emoji: "🚀" },
    ],
  },
  {
    id: "3",
    question: "Într-o echipă, tu ești de obicei...",
    options: [
      { label: "Cel care vine cu ideile", value: "vizionar", emoji: "💡" },
      { label: "Cel care organizează totul", value: "lider", emoji: "📋" },
      { label: "Cel care rezolvă conflictele", value: "mediator", emoji: "🤝" },
      { label: "Cel care face lucrurile să se întâmple", value: "executor", emoji: "⚡" },
    ],
  },
  {
    id: "4",
    question: "Ce fel de experiență ți-ar plăcea cel mai mult?",
    options: [
      { label: "Voluntariat care schimbă vieți", value: "impact", emoji: "🌱" },
      { label: "O competiție unde să-mi arăt abilitățile", value: "competitie", emoji: "🏆" },
      { label: "Un workshop unde să învăț ceva practic", value: "invatare", emoji: "🔧" },
      { label: "O călătorie care să-mi deschidă mintea", value: "calatorie", emoji: "✈️" },
    ],
  },
  {
    id: "5",
    question: "Cum preferi să înveți?",
    options: [
      { label: "Făcând — trec direct la practică", value: "practic", emoji: "🛠️" },
      { label: "Observând — mai întâi privesc pe alții", value: "observator", emoji: "👀" },
      { label: "Citind — manuale, articole, documentare", value: "teoretic", emoji: "📖" },
      { label: "Discutând — schimb de idei cu alții", value: "colaborativ", emoji: "💬" },
    ],
  },
];

type ExplorerType = {
  title: string;
  emoji: string;
  description: string;
  strengths: string[];
  suggestedCategories: string[];
  color: string;
};

const explorerTypes: Record<string, ExplorerType> = {
  social_impact: {
    title: "Exploratorul Social",
    emoji: "🌍",
    description:
      "Ești motivat de impact și conexiuni umane. Vrei să faci lumea mai bună și te hrănești din energia oamenilor din jurul tău.",
    strengths: ["Empatie", "Comunicare", "Organizare", "Leadership"],
    suggestedCategories: ["Voluntariat", "Evenimente", "Tabere"],
    color: "from-primary to-accent-purple",
  },
  creativ_builder: {
    title: "Constructorul Creativ",
    emoji: "🚀",
    description:
      "Ești un maker — construiești, creezi, inventezi. Nu te mulțumești cu ce există, vrei să faci ceva nou.",
    strengths: ["Creativitate", "Rezolvare de probleme", "Inovație", "Persistență"],
    suggestedCategories: ["Competiții", "Workshopuri", "Hackathoane"],
    color: "from-secondary to-accent-orange",
  },
  analitic_explorer: {
    title: "Mintea Analitică",
    emoji: "🧠",
    description:
      "Ești curios, metodic și iubești provocările intelectuale. Te atragi de complexitate și cauți mereu să înțelegi mai profund.",
    strengths: ["Gândire critică", "Cercetare", "Atenție la detalii", "Logică"],
    suggestedCategories: ["Competiții", "Burse", "Cursuri STEM"],
    color: "from-accent-blue to-primary",
  },
  aventurier: {
    title: "Aventurierul",
    emoji: "⛰️",
    description:
      "Ești energic, curajos și vrei mereu experiențe noi. Zona de confort nu e pentru tine — tu cauți aventura!",
    strengths: ["Adaptabilitate", "Curaj", "Reziliență", "Deschidere"],
    suggestedCategories: ["Tabere", "Schimburi europene", "Voluntariat internațional"],
    color: "from-accent-green to-accent-blue",
  },
};

function getExplorerType(answers: Record<string, string>): ExplorerType {
  const vals = Object.values(answers);
  if (vals.includes("empatic") || vals.includes("impact") || vals.includes("social")) {
    return explorerTypes.social_impact;
  }
  if (vals.includes("antreprenor") || vals.includes("creativ") || vals.includes("vizionar")) {
    return explorerTypes.creativ_builder;
  }
  if (vals.includes("analitic") || vals.includes("intelectual") || vals.includes("teoretic")) {
    return explorerTypes.analitic_explorer;
  }
  return explorerTypes.aventurier;
}

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const question = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setTimeout(() => setIsFinished(true), 300);
    }
  };

  if (isFinished) {
    const result = getExplorerType(answers);

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div
          className="max-w-lg w-full animate-fade-in-up"
        >
          <div className={`bg-gradient-to-br ${result.color} rounded-3xl p-8 md:p-12 text-white text-center mb-6`}>
            <div className="text-6xl mb-4">{result.emoji}</div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-3">Ești: {result.title}</h1>
            <p className="text-white/80 leading-relaxed">{result.description}</p>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold mb-2">Puncte forte</h3>
              <div className="flex flex-wrap gap-2">
                {result.strengths.map((s) => (
                  <span key={s} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-2">Categorii recomandate</h3>
              <div className="flex flex-wrap gap-2">
                {result.suggestedCategories.map((c) => (
                  <span key={c} className="px-3 py-1 bg-accent-green/10 text-accent-green rounded-full text-xs font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <Link
                href="/explorare"
                className="flex-1 px-6 py-3 bg-primary text-white text-center font-bold rounded-xl hover:bg-primary-dark transition-colors"
              >
                Explorează oportunitățile
              </Link>
              <button
                onClick={() => {
                  setAnswers({});
                  setCurrentStep(0);
                  setIsFinished(false);
                }}
                className="px-6 py-3 border border-border rounded-xl font-bold hover:border-primary hover:text-primary transition-all text-center"
              >
                Reia quiz-ul
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted">
              Întrebarea {currentStep + 1} din {questions.length}
            </span>
            <span className="text-xs font-semibold text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
          <div
            key={question.id}
            className="animate-fade-in-up"
          >
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Compass className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
                {question.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    answers[question.id] === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border bg-surface hover:border-primary/30 hover:bg-surface-alt"
                  }`}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

        {/* Navigation */}
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="mt-6 flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi
          </button>
        )}
      </div>
    </div>
  );
}
