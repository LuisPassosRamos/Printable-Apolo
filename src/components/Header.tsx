import { useState, useEffect, useRef } from 'react';
import { createWhatsAppUrl, getWhatsAppMessage } from '../utils/whatsapp';

interface HeaderProps {
  tags: string[];
  selectedTag: string;
  onSelectTag: (tag: string) => void;
}

export function Header({ tags, selectedTag, onSelectTag }: HeaderProps) {
  const whatsappUrl = createWhatsAppUrl(getWhatsAppMessage('order'));
  const logoUrl = `${import.meta.env.BASE_URL}Logo_white.webp`;
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleTagClick = (tag: string) => {
    onSelectTag(tag);
    setDropdownOpen(false);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 ${
        scrolled ? 'bg-secondary/95 backdrop-blur-sm shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-7 flex items-center justify-between">
        <div className="flex items-center gap-3 text-white">
          <img src={logoUrl} alt="Olympus 3D" className="w-20 h-20 object-contain" />
          <span className="text-primary font-bold tracking-wide text-sm md:text-base">Olympus 3D</span>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-primary">
          <a href="#" className="hover:text-white transition-colors">Homepage</a>
          <a href="#catalogo" className="hover:text-white transition-colors">Catálogo</a>

          {/* Categories dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 hover:text-white transition-colors focus:outline-none"
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              {selectedTag ? (
                <span className="text-white font-semibold">{selectedTag}</span>
              ) : (
                'Categorias'
              )}
              <span className={`text-[10px] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true">▼</span>
            </button>

            {dropdownOpen && (
              <div
                role="listbox"
                className="absolute top-full mt-3 right-0 min-w-[180px] bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden"
              >
                {selectedTag && (
                  <button
                    role="option"
                    aria-selected={false}
                    onClick={() => handleTagClick('')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors italic"
                  >
                    Todas as categorias
                  </button>
                )}
                {tags.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-400">Nenhuma categoria</p>
                ) : (
                  tags.map((tag) => (
                    <button
                      key={tag}
                      role="option"
                      aria-selected={tag === selectedTag}
                      onClick={() => handleTagClick(tag)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        tag === selectedTag
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {tag}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-secondary/95 text-primary px-8 py-4 rounded-md font-bold text-sm hover:opacity-90 transition-all"
            
          >
            Fazer pedido
          </a>
        </nav>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="lg:hidden border border-primary/70 text-primary text-xs font-semibold px-3 py-1.5 rounded-md"
        >
          Pedir
        </a>
      </div>
    </header>
  );
}
