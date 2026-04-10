import { WHATSAPP_NUMBER } from '../config';

export function HeroSection() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Gostaria de fazer um orçamento para um item personalizado.')}`;
  const whatsappContactUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden text-white flex items-center justify-center">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(84, 18, 152, 0.20) 0%, rgba(103, 31, 166, 0.30) 40%, rgba(104, 31, 165, 0.40) 100%), url('/Hero_bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 max-w-4xl text-center px-6 pt-28 md:pt-20 pb-40">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
          Transforme ideias em
          <br />
          peças reais
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-10">
          Seja para decoração, presentes, utilidades ou colecionáveis, produzimos itens em impressão 3D com acabamento premium e prazo rápido.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-md font-semibold text-sm hover:opacity-90 transition-all"
          >
            Fazer Orçamento
          </a>

          <a
            href={whatsappContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/75 text-white px-8 py-4 rounded-md font-semibold text-sm hover:bg-white/10 transition-all"
          >
            Falar no WhatsApp <span className="text-base">↗</span>
          </a>
        </div>
      </div>

      <a
        href="#catalogo"
        className="absolute z-10 bottom-28 text-3xl text-white/90 animate-bounce hover:text-white transition-colors"
        aria-label="Descer para o catálogo"
      >
        ↓
      </a>

      <div
        className="absolute left-0 right-0 -bottom-px h-28 bg-white z-10"
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 42%, 50% 0, 0 42%)' }}
      />
    </section>
  );
}
