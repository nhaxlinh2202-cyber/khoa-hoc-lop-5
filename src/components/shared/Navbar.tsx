
import { useState, useEffect } from 'react';
import { Menu, X, GraduationCap, ChevronRight } from 'lucide-react';

interface NavbarProps {
  sections: { id: string; name: string }[];
}

export default function Navbar({ sections }: NavbarProps) {
  const [activeSection, setActiveSection] = useState('intro');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Calculate reading scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      // 2. Active section detection (Scroll Spy)
      const scrollPosition = window.scrollY + 120; // safe offset for header

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // Offset for sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#D9D9D9] transition-all">
      {/* Top Reading Progress Bar */}
      <div 
        className="h-1 bg-black transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Category */}
          <div className="flex items-center space-x-6 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="font-display font-bold text-xl tracking-tighter text-black">
              SCIENCE.05
            </div>
            <div className="hidden md:block h-4 w-px bg-[#D9D9D9]" />
            <div className="hidden md:block">
              <span className="font-mono text-[9px] text-[#444444] block tracking-widest uppercase">
                Chuyên Đề Lactic
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider transition-all duration-200 border ${
                  activeSection === sec.id
                    ? 'bg-black text-white border-black'
                    : 'bg-transparent text-[#444444] border-transparent hover:border-[#D9D9D9] hover:bg-[#F2F2F2]'
                }`}
              >
                {sec.name.split(' — ')[0]} {/* display clean shorthand */}
              </button>
            ))}
          </div>

          {/* Right Badge as shown in Geometric Balance template */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-[9px] font-mono px-3 py-1 border border-black rounded-full font-bold tracking-widest bg-white">
              NHÓM: LACTIC
            </div>

            {/* Mobile Hamburguer Trigger */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 border border-[#D9D9D9] text-[#111111] hover:bg-[#F2F2F2] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#D9D9D9] absolute left-0 right-0 py-4 px-6 space-y-2 shadow-lg animate-fade-in">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`w-full flex items-center justify-between p-3 text-xs font-mono font-bold uppercase tracking-wider text-left transition-all border ${
                activeSection === sec.id
                  ? 'bg-black text-white border-black'
                  : 'bg-[#FAFAFA] text-[#444444] border-[#D9D9D9] hover:bg-[#F2F2F2]'
              }`}
            >
              <span>{sec.name}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
