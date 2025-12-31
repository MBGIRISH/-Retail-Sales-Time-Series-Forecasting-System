
import React from 'react';
import { Section } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: Section;
  onSectionClick: (section: Section) => void;
}

const sections = Object.values(Section);

const Layout: React.FC<LayoutProps> = ({ children, activeSection, onSectionClick }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <i className="fas fa-chart-line text-white"></i>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">RetailForecast AI</h1>
          </div>
          <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Enterprise DS Portal</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => onSectionClick(section)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                activeSection === section
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fas fa-${getIconForSection(section)} w-5`}></i>
              <span className="text-sm font-medium">{section}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">JD</div>
            <div>
              <p className="text-xs font-semibold text-white">Sr. Data Scientist</p>
              <p className="text-[10px] text-slate-500">MNC Retail Ops</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scroll-smooth">
        <header className="sticky top-0 z-10 glass-effect px-8 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">{activeSection}</h2>
          <div className="flex items-center gap-4">
             <span className="flex items-center gap-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Connected to Gemini API
             </span>
             <button className="text-slate-500 hover:text-slate-800 transition-colors">
                <i className="fas fa-bell"></i>
             </button>
          </div>
        </header>
        
        <div className="max-w-6xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const getIconForSection = (section: Section): string => {
  switch (section) {
    case Section.Introduction: return 'info-circle';
    case Section.EDA: return 'magnifying-glass-chart';
    case Section.Preprocessing: return 'gears';
    case Section.Modeling: return 'microchip';
    case Section.Evaluation: return 'check-double';
    case Section.Forecasting: return 'calendar-days';
    case Section.Insights: return 'lightbulb';
    case Section.Production: return 'rocket';
    default: return 'circle';
  }
};

export default Layout;
