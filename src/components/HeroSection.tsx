import { createWhatsAppUrl, getWhatsAppMessage } from '../utils/whatsapp';

export function HeroSection() {
  const whatsappUrl = createWhatsAppUrl(getWhatsAppMessage('quote'));
  const whatsappContactUrl = createWhatsAppUrl(getWhatsAppMessage('contact'));
  const heroBgUrl = `${import.meta.env.BASE_URL}Hero_bg.webp`;
  const heroBackgroundStyle = {
    backgroundImage: `url('${heroBgUrl}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } as const;

  const heroOverlayStyle = {
    background:
      'radial-gradient(circle at center, rgba(103, 31, 166, 0.10) 0%, rgba(103, 31, 166, 0.06) 34%, rgba(103, 31, 166, 0.03) 68%, rgba(103, 31, 166, 0) 100%)',
    backdropFilter: 'blur(5px)',
    WebkitBackdropFilter: 'blur(5px)',
    WebkitMaskImage: 'radial-gradient(circle at center, black 0%, black 72%, transparent 100%)',
    maskImage: 'radial-gradient(circle at center, black 0%, black 72%, transparent 100%)',
  } as const;

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden text-white flex items-center justify-center">
      <div className="absolute inset-0" style={heroBackgroundStyle} />

      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={heroOverlayStyle} />

      <div className="relative z-10 max-w-4xl text-center px-6 pt-28 md:pt-20 pb-40">
        <h1 className="text-secondary text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6 [text-shadow:2px_2px_4px_rgba(0,0,0,1)]">
          Transforme <span className="text-primary [text-shadow:1px_1px_1px_rgba(0,0,0,1)]">ideias</span> em
          <br />
          peças <span className="text-primary [text-shadow:1px_1px_1px_rgba(0,0,0,1)]">reais</span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-white leading-relaxed max-w-3xl mx-auto mb-10 font-semibold [text-shadow:1px_1px_2px_rgba(0,0,0,1)]">
          Seja para decoração, presentes, utilidades ou colecionáveis, produzimos itens em impressão 3D com acabamento premium e prazo rápido.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-md font-bold text-sm hover:opacity-90 transition-all"
          >
            Solicitar Orçamento
          </a>

          <a
            href={whatsappContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/75 text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-white/10 transition-all [text-shadow:0_0_10px_rgba(0,0,0,0.5)]"
          >
            Tirar Dúvidas no WhatsApp <span className="text-base">↗</span>
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
