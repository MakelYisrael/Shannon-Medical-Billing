import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface TranscriptPanelProps {
  transcript: string;
  title?: string;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({ transcript, title = 'Transcript' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!transcript || transcript.trim().length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 max-h-96 overflow-y-auto">
          <div className="prose prose-sm max-w-none">
            {transcript.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="text-gray-700 leading-relaxed mb-3 last:mb-0">
                  {paragraph}
                </p>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
