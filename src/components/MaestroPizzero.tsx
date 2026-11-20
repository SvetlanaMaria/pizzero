import {FormEvent, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {ChefHat, Loader2, Send} from 'lucide-react';
import {PizzaConfig, PizzaMetrics, describePizzaSummary} from '../data/pizzaData';

interface MaestroPizzeroProps {
  config: PizzaConfig;
  metrics: PizzaMetrics;
}

interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const MAX_CHARS = 400;

const QUICK_QUESTIONS = [
  '¿Cómo equilibrar mejor los sabores de mi pizza actual?',
  '¿Qué bebida o vino marida mejor con esta combinación?',
  '¿Cómo reducir calorías sin perder textura crujiente?',
];

export function MaestroPizzero({config, metrics}: MaestroPizzeroProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [remainingRequests, setRemainingRequests] = useState<number | null>(null);

  const currentSummary = `${describePizzaSummary(config)} · ${metrics.calories} kcal totales (${metrics.protein}g prot, ${metrics.carbs}g carb, ${metrics.fat}g grasas) · ${metrics.dietaryLabel}`;

  const askMaestro = async (questionText: string) => {
    const trimmed = questionText.trim().slice(0, MAX_CHARS);
    if (!trimmed || isLoading) return;

    setErrorText(null);
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {id: `u-${Date.now()}`, role: 'user', text: trimmed},
    ]);
    setInput('');

    try {
      const response = await fetch('/api/pizzero', {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          message: trimmed,
          pizzaSummary: currentSummary,
        }),
      });

      const rawText = await response.text();
      let data: {
        reply?: string;
        error?: string;
        details?: string;
        remainingRequests?: number;
      } = {};

      try {
        data = rawText ? (JSON.parse(rawText) as typeof data) : {};
      } catch {
        const plainSnippet = rawText
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 140);
        setErrorText(
          `El proxy/servidor devolvió HTTP ${response.status} sin JSON${plainSnippet ? ` («${plainSnippet}»)` : ''}. Si estás viendo la app dentro del iframe de vista previa, ábrela en una pestaña nueva para que el navegador envíe las cookies de sesión en peticiones POST.`,
        );
        return;
      }

      if (!response.ok || !data.reply) {
        setErrorText(
          data.error ||
            `Error del servidor (HTTP ${response.status}) al consultar al maestro pizzero.`,
        );
        return;
      }

      if (typeof data.remainingRequests === 'number') {
        setRemainingRequests(data.remainingRequests);
      }

      setMessages((prev) => [
        ...prev,
        {id: `a-${Date.now()}`, role: 'assistant', text: data.reply!},
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setErrorText(
        `No se pudo contactar con el backend /api/pizzero${msg ? ` (${msg})` : ''}.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void askMaestro(input);
  };

  return (
    <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[#E5E2DC]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F3F1EC] border border-[#E5E2DC] flex items-center justify-center text-[#C83E2B] shrink-0">
            <ChefHat className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-[#18181B]">
              Consulta al Maestro Marco
            </h3>
            <p className="text-xs text-[#52525B] mt-0.5">
              Pizzaiolo napolitano · Analiza la pizza que tienes ahora mismo en la pala
            </p>
          </div>
        </div>

        {remainingRequests !== null && (
          <span className="text-xs font-mono tabular-nums text-[#71717A]">
            {remainingRequests}/10 consultas disp. (1 min)
          </span>
        )}
      </div>

      {/* Quick suggestions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            disabled={isLoading}
            onClick={() => void askMaestro(q)}
            className="text-left px-3 py-1.5 rounded-lg border border-[#E5E2DC] bg-[#FAF9F6] hover:bg-[#F3F1EC] text-xs font-medium text-[#18181B] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Conversation thread */}
      {messages.length > 0 && (
        <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{opacity: 0, y: 6}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.18}}
                className={`p-3.5 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#F3F1EC] text-[#18181B] ml-6'
                    : 'bg-[#FAF9F6] border border-[#E5E2DC] text-[#18181B] mr-4'
                }`}
              >
                <p className="text-xs font-medium text-[#71717A] mb-1">
                  {msg.role === 'user' ? 'Tu consulta' : 'Maestro Marco Bellini'}
                </p>
                <p className="whitespace-pre-line">{msg.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E2DC] mr-4 flex items-center gap-2.5 text-xs text-[#52525B]">
              <Loader2 className="w-4 h-4 animate-spin text-[#C83E2B]" aria-hidden="true" />
              <span>Marco está revisando tu impasto y equilibrio de ingredientes…</span>
            </div>
          )}
        </div>
      )}

      {errorText && (
        <div
          role="alert"
          className="mt-4 p-3 rounded-xl border border-[#C83E2B]/30 bg-[#C83E2B]/[0.05] text-xs text-[#9E2B1C]"
        >
          {errorText}
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-2">
        <label htmlFor="maestro-input" className="sr-only">
          Pregunta al maestro pizzero italiano
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="maestro-input"
            type="text"
            maxLength={MAX_CHARS}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregúntale sobre masas, quesos, horneado o maridaje…"
            className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-[#E5E2DC] bg-white focus:outline-none focus:ring-2 focus:ring-[#C83E2B]"
          />
          <button
            type="submit"
            disabled={isLoading || input.trim().length === 0}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] disabled:opacity-45 text-white text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="w-4 h-4" aria-hidden="true" />
            )}
            <span>Consultar</span>
          </button>
        </div>
        <div className="flex items-center justify-between text-xs text-[#71717A] font-mono tabular-nums">
          <span>Máximo {MAX_CHARS} caracteres por consulta</span>
          <span>
            {input.length}/{MAX_CHARS}
          </span>
        </div>
      </form>
    </div>
  );
}
