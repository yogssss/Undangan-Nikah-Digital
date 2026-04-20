import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  Gift,
  ExternalLink,
  ChevronDown,
  Volume2,
  VolumeX,
  CalendarPlus,
  Ticket
} from 'lucide-react';

// --- ANIMATION COMPONENT ---
const FadeInSection = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target); 
        }
      });
    }, { threshold: 0.15 });

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const audioRef = useRef(null);

  // Link Google Calendar
  const gcalUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Gurur+%26+Dina&dates=20261225T020000Z/20261225T070000Z&details=Turut+mengundang+Bapak/Ibu/Saudara/i+untuk+hadir+di+acara+pernikahan+kami.+Terima+kasih+atas+doa+dan+restunya.&location=Gedung+Serbaguna+Jakarta,+Jl.+Ahmad+Yani+No.+123,+Jakarta+Selatan";

  // Mendapatkan nama tamu dari URL (Untuk Teks & QR Code)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) setGuestName(to.replace(/\+/g, ' '));
  }, []);

  // Countdown Logic
  useEffect(() => {
    const targetDate = new Date("2026-12-25T09:00:00").getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    setIsPlaying(true);
    if (audioRef.current) audioRef.current.play();
  };

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // --- COMPONENTS ---

  const Cover = () => (
    <div className={`fixed inset-0 z-[100] transition-transform duration-1000 ease-in-out flex items-center justify-center bg-stone-100 ${isOpen ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#8b7e74 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>
      
      <div className="text-center p-6 space-y-6 z-10 max-w-lg">
        <div className="animate-bounce mb-8">
          <Heart className="w-12 h-12 text-rose-400 mx-auto fill-rose-400" />
        </div>
        <p className="tracking-[0.3em] text-stone-500 uppercase text-sm">The Wedding Of</p>
        <h1 className="text-5xl md:text-7xl font-serif text-stone-800 italic">Gurur & Dina</h1>
        
        <div className="pt-12">
          <p className="text-stone-500 mb-2">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <h2 className="text-2xl font-semibold text-stone-800 mb-8">{guestName}</h2>
          <button 
            onClick={handleOpenInvitation}
            className="px-8 py-4 bg-stone-800 text-white rounded-full hover:bg-stone-700 transition-all flex items-center gap-2 mx-auto shadow-xl hover:scale-105 active:scale-95"
          >
            <ExternalLink className="w-5 h-5" /> Buka Undangan
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 font-sans selection:bg-rose-100 overflow-x-hidden">
      <Cover />
      
      <audio ref={audioRef} loop>
        <source src="https://www.bensound.com/bensound-music/bensound-tenderness.mp3" type="audio/mpeg" />
      </audio>

      {isOpen && (
        <button 
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-50 p-3 bg-white/80 backdrop-blur shadow-xl rounded-full text-stone-800 border border-stone-200"
        >
          {isPlaying ? <Volume2 className="animate-pulse" /> : <VolumeX />}
        </button>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center p-6 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center">
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 space-y-8 max-w-3xl w-full mt-12">
          <FadeInSection delay={200}>
            <p className="tracking-widest uppercase text-stone-700 font-medium">The Wedding Celebration Of</p>
          </FadeInSection>
          
          <FadeInSection delay={400}>
            <h1 className="text-6xl md:text-8xl font-serif italic mb-4 text-stone-900 drop-shadow-sm">Gurur & Dina</h1>
          </FadeInSection>
          
          <FadeInSection delay={600}>
            <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/50 shadow-xl mt-8">
              <p className="text-xl font-medium mb-6">Jumat, 25 Desember 2026</p>
              
              {/* Countdown in Hero */}
              <div className="flex justify-center gap-2 md:gap-4 mb-8">
                {[
                  { label: 'Hari', val: timeLeft.days },
                  { label: 'Jam', val: timeLeft.hours },
                  { label: 'Menit', val: timeLeft.minutes },
                  { label: 'Detik', val: timeLeft.seconds }
                ].map((item, i) => (
                  <div key={i} className="bg-white/80 shadow-sm p-3 md:p-4 rounded-xl w-16 md:w-20 text-center">
                    <p className="text-xl md:text-3xl font-bold text-stone-800">{item.val}</p>
                    <p className="text-[10px] md:text-xs uppercase tracking-tighter opacity-70 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Add to Google Calendar Button */}
              <a 
                href={gcalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-stone-800 hover:bg-stone-700 text-white rounded-full transition-all shadow-md hover:shadow-lg"
              >
                <CalendarPlus className="w-5 h-5" />
                Simpan ke Kalender
              </a>
            </div>
          </FadeInSection>

          <FadeInSection delay={1000}>
            <div className="pt-8 animate-bounce">
              <ChevronDown className="w-8 h-8 mx-auto text-stone-600" />
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Mempelai Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto space-y-16">
        <FadeInSection>
          <div className="text-center space-y-4 mb-12">
            <p className="italic text-stone-600 leading-relaxed text-lg">"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."</p>
            <p className="font-semibold text-sm text-stone-500">— Ar-Rum: 21</p>
          </div>
        </FadeInSection>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Groom */}
          <FadeInSection delay={200}>
            <div className="text-center space-y-4">
              <div className="w-48 h-48 rounded-full overflow-hidden mx-auto border-8 border-white shadow-xl">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300" alt="Groom" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-3xl font-serif">Gurur Prayoga, S.Kom</h2>
              <p className="text-stone-500">Putra dari Bapak Fulan & Ibu Fulanah</p>
            </div>
          </FadeInSection>

          {/* Bride */}
          <FadeInSection delay={400}>
            <div className="text-center space-y-4">
              <div className="w-48 h-48 rounded-full overflow-hidden mx-auto border-8 border-white shadow-xl">
                <img src="https://images.unsplash.com/photo-1511117833452-4724f3d60065?auto=format&fit=crop&q=80&w=300" alt="Bride" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-3xl font-serif">Dina Sari, S.E</h2>
              <p className="text-stone-500">Putri dari Bapak Fulan & Ibu Fulanah</p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-24 bg-stone-800 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10 rotate-12">
           <Heart className="w-96 h-96" />
        </div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif italic mb-4">Informasi Acara</h2>
              <div className="h-px w-24 bg-rose-400 mx-auto"></div>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <FadeInSection delay={200}>
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors h-full">
                <div className="mb-6 flex justify-between items-start">
                  <h3 className="text-2xl font-serif italic">Akad Nikah</h3>
                  <Calendar className="text-rose-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Clock className="w-5 h-5 text-rose-400" />
                    <p>09.00 - 10.30 WIB</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-rose-400 shrink-0 mt-1" />
                    <p className="leading-relaxed">Gedung Serbaguna Jakarta<br/>Jl. Ahmad Yani No. 123, Jakarta Selatan</p>
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={400}>
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors h-full">
                <div className="mb-6 flex justify-between items-start">
                  <h3 className="text-2xl font-serif italic">Resepsi</h3>
                  <Calendar className="text-rose-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Clock className="w-5 h-5 text-rose-400" />
                    <p>11.00 - 14.00 WIB</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-rose-400 shrink-0 mt-1" />
                    <p className="leading-relaxed">Gedung Serbaguna Jakarta<br/>Jl. Ahmad Yani No. 123, Jakarta Selatan</p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>

          <FadeInSection delay={600}>
            <div className="mt-16 text-center">
              <p className="mb-6 text-stone-300">Temukan lokasi acara melalui tautan di bawah ini:</p>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Gedung+Serbaguna+Jakarta+Ahmad+Yani" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-rose-500 hover:bg-rose-600 rounded-full text-white transition-all shadow-lg hover:shadow-rose-500/30 hover:-translate-y-1"
              >
                <MapPin className="w-5 h-5" /> Buka Google Maps
              </a>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* QR Code Entrance Ticket Section */}
      <section className="py-24 px-6 max-w-xl mx-auto">
        <FadeInSection>
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-stone-200 text-center">
            <Ticket className="w-12 h-12 text-rose-500 mx-auto mb-6" />
            <h2 className="text-3xl font-serif italic mb-2">Tiket Masuk</h2>
            <p className="text-stone-500 mb-8 text-sm">Tunjukkan QR Code ini kepada penerima tamu saat Anda tiba di lokasi acara.</p>
            
            <div className="inline-block p-4 bg-white border-2 border-stone-100 rounded-2xl shadow-sm mb-6">
              {/* API otomatis membuat QR Code berdasarkan state guestName */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(guestName)}`} 
                alt="QR Code Tiket Masuk" 
                className="w-48 h-48 md:w-56 md:h-56"
              />
            </div>
            
            <p className="font-bold text-xl text-stone-800 tracking-wide uppercase">
              {guestName}
            </p>
          </div>
        </FadeInSection>
      </section>

      {/* Gallery */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif italic mb-4">Galeri Kebahagiaan</h2>
            <p className="text-stone-500">Momen indah yang kami abadikan</p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1465495910483-0d674575ec60?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1522673607200-1648832cee98?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=400'
          ].map((img, i) => (
            <FadeInSection key={i} delay={i * 100}>
              <div className="aspect-square rounded-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer shadow-md">
                <img src={img} alt="Gallery" className="w-full h-full object-cover" />
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* Gift Section */}
      <section className="py-24 bg-stone-100 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <FadeInSection>
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-stone-200">
              <Gift className="w-12 h-12 text-rose-400 mx-auto mb-6" />
              <h2 className="text-4xl font-serif italic mb-6">Wedding Gift</h2>
              <p className="text-stone-500 mb-10 leading-relaxed">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan kasih Anda, Anda dapat memberi hadiah secara cashless.</p>
              
              <div className="grid gap-6">
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 hover:border-rose-200 transition-colors">
                  <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-2">Transfer Bank BCA</p>
                  <p className="text-2xl font-semibold mb-1">1234 5678 90</p>
                  <p className="text-stone-600 italic">a.n Gurur Prayoga</p>
                </div>
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 hover:border-rose-200 transition-colors">
                  <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-2">Kirim Kado</p>
                  <p className="text-stone-600 italic">Jl. Indah Permai No. 10, Jakarta</p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center space-y-6 bg-stone-900 text-stone-400">
        <FadeInSection>
          <h2 className="text-3xl font-serif italic text-white">Gurur & Dina</h2>
          <p className="max-w-xs mx-auto text-sm italic mt-4">"Kami mengundang Anda untuk berbagi kebahagiaan dalam pernikahan kami."</p>
          <div className="pt-8 mt-8 border-t border-white/10">
            <p className="text-xs uppercase tracking-widest">Digital Invitation by Galeri Undangan</p>
          </div>
        </FadeInSection>
      </footer>
    </div>
  );
}
