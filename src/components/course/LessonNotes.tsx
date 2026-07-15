import { useState } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Card, Button } from '../ui';

interface LessonNotesProps {
  lessonTitle: string;
}

const sampleNotes = `# Passive Information Gathering

## Key Concepts
- **OSINT** (Open Source Intelligence) is the collection and analysis of information from publicly available sources
- Passive recon leaves no footprint on the target's systems
- Active recon involves direct interaction with the target

## Tools Covered
1. **theHarvester** - Email and subdomain enumeration
2. **Shodan** - Internet-connected device search engine
3. **Maltego** - Visual link analysis
4. **Recon-ng** - Modular web reconnaissance framework

## Key Takeaways
- Always start with passive recon before active enumeration
- Document all findings systematically
- Cross-reference data from multiple sources`;

const sampleResources = [
  { title: 'OSINT Framework', type: 'Tool', url: '#' },
  { title: 'Recon-ng Documentation', type: 'Docs', url: '#' },
  { title: 'Lab: Passive Recon Exercise', type: 'Lab', url: '#' },
  { title: 'Supplementary Reading: Intelligence Gathering', type: 'PDF', url: '#' },
];

export function LessonNotes({ lessonTitle }: LessonNotesProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'resources'>('notes');

  return (
    <Card variant="glass" className="p-5">
      <div className="flex items-center gap-1 mb-4 p-1 rounded-lg bg-surface-800 border border-white/[0.04]">
        {(['notes', 'resources'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-3 py-1.5 rounded-md text-caption font-medium transition-all capitalize ${
              activeTab === tab
                ? 'bg-white/[0.06] text-white'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'notes' ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-body-sm font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent-cyan" />
              {lessonTitle}
            </h3>
            <Button variant="ghost" size="sm">
              <Download className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-wrap text-body-sm leading-relaxed">
            {sampleNotes}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {sampleResources.map((resource) => (
            <a
              key={resource.title}
              href={resource.url}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-surface-600 border border-white/[0.06] flex items-center justify-center shrink-0">
                <span className="text-caption font-medium text-slate-400">{resource.type.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-body-sm text-white truncate group-hover:text-accent-cyan transition-colors">
                  {resource.title}
                </div>
                <div className="text-caption text-slate-500">{resource.type}</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </a>
          ))}
        </div>
      )}
    </Card>
  );
}
