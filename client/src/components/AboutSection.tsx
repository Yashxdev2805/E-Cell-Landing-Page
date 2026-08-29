import { useState, useEffect } from 'react';
import { Lightbulb, Users, Calendar, IndianRupee, Target, Rocket, GraduationCap, Award } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  target: number;
  suffix: string;
  color: string;
  bgColor: string;
  hasIntersected: boolean;
}

function KpiCard({ icon: Icon, label, target, suffix, color, bgColor, hasIntersected }: KpiCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!hasIntersected) return;
    let frame: number;
    const duration = 1500;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [hasIntersected, target]);

  return (
    <div className="ecell-card p-6 flex flex-col items-center text-center gap-3 group">
      <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <span className="text-3xl sm:text-4xl font-extrabold text-white font-heading tabular-nums">
        {hasIntersected ? count : 0}{suffix}
      </span>
      <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">{label}</span>
    </div>
  );
}

export function AboutSection() {
  const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.2 });

  const kpis = [
    { icon: Lightbulb, label: 'Startups Incubated', target: 50, suffix: '+', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
    { icon: IndianRupee, label: 'Funding Facilitated', target: 15, suffix: 'L+', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
    { icon: Calendar, label: 'Workshops Conducted', target: 25, suffix: '+', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { icon: Users, label: 'Active Community', target: 500, suffix: '+', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  ];

  return (
    <section id="about" className="section-container">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-4">
          <Target className="w-3.5 h-3.5" />
          About E-Cell UIET KUK
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading mt-3">
          Empowering Student Entrepreneurs
        </h2>
        <p className="mt-4 text-slate-400 max-w-2xl mx-auto leading-relaxed">
          We bridge the gap between ideas and execution. Through mentorship, workshops, and
          competitive platforms, we nurture the entrepreneurial spirit across campus.
        </p>
      </div>

      <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} hasIntersected={hasIntersected} />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="ecell-glass rounded-2xl p-8 group hover:border-blue-500/20 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">Our Vision</h3>
          </div>
          <p className="text-slate-400 leading-relaxed">
            To establish UIET Kurukshetra as a premier hub for student-led innovation, where every
            aspiring entrepreneur has access to mentorship, resources, and a community that
            transforms ambitious ideas into scalable ventures.
          </p>
        </div>

        <div className="ecell-glass rounded-2xl p-8 group hover:border-amber-500/20 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">Our Mission</h3>
          </div>
          <p className="text-slate-400 leading-relaxed">
            We foster entrepreneurship through flagship competitions, expert speaker sessions,
            hands-on bootcamps, and incubation support — creating a pipeline from ideation
            to venture creation within the university ecosystem.
          </p>
        </div>
      </div>

      <div className="ecell-card p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
          <GraduationCap className="w-8 h-8 text-blue-300" />
        </div>
        <div>
          <p className="text-slate-400 leading-relaxed italic mb-4">
            "The E-Cell at UIET embodies our university's commitment to nurturing innovation.
            Through student-led initiatives and industry collaborations, we are building a
            generation of creators who will shape the future of technology and business."
          </p>
          <div>
            <p className="text-sm font-bold text-white font-heading">Prof. Faculty Advisor</p>
            <p className="text-xs text-slate-500">Faculty In-Charge, E-Cell UIET KUK</p>
          </div>
        </div>
      </div>
    </section>
  );
}
