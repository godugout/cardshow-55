
import React, { useState } from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { useCards } from '@/hooks/useCards';
import { useDebug } from '@/contexts/DebugContext';
import { localCardStorage } from '@/lib/localCardStorage';
import { Minimize2, Maximize2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const CardDebugInfo: React.FC = () => {
  const { user } = useAuth();
  const { cards, userCards, loading, dataSource } = useCards();
  const { isDebugMode, setDebugMode } = useDebug();
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    cards: true,
    route: false,
    performance: false,
  });

  const localCards = localCardStorage.getAllCards();
  const unsyncedCards = localCardStorage.getUnsyncedCards();

  // Only show in development mode AND when debug mode is enabled
  if (process.env.NODE_ENV !== 'development' || !isDebugMode) {
    return null;
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 bg-black/90 text-white p-2 rounded-lg text-xs z-50 border border-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-green-400">●</span>
          <span>Debug</span>
          <button 
            onClick={() => setIsMinimized(false)}
            className="hover:text-gray-300"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
          <button 
            onClick={() => setDebugMode(false)}
            className="hover:text-gray-300"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50 border border-gray-600">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-green-400">Debug Panel</h3>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(true)}
            className="hover:text-gray-300 p-1"
            title="Minimize"
          >
            <Minimize2 className="w-3 h-3" />
          </button>
          <button 
            onClick={() => setDebugMode(false)}
            className="hover:text-gray-300 p-1"
            title="Close Debug Panel"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Cards Section */}
      <div className="mb-3">
        <button 
          onClick={() => toggleSection('cards')}
          className="flex items-center gap-1 w-full text-left hover:text-gray-300"
        >
          {expandedSections.cards ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          <span className="font-semibold">Cards Data</span>
        </button>
        {expandedSections.cards && (
          <div className="ml-4 mt-1 space-y-1 text-gray-300">
            <div>User ID: {user?.id || 'Not logged in'}</div>
            <div>Data Source: <span className="text-yellow-400">{dataSource}</span></div>
            <div>Database Cards: <span className="text-blue-400">{cards.length}</span></div>
            <div>User Cards: <span className="text-purple-400">{userCards.length}</span></div>
            <div>Local Cards: <span className="text-orange-400">{localCards.length}</span></div>
            <div>Unsynced Cards: <span className="text-red-400">{unsyncedCards.length}</span></div>
            <div>Loading: {loading ? 'Yes' : 'No'}</div>
          </div>
        )}
      </div>

      {/* Route Section */}
      <div className="mb-3">
        <button 
          onClick={() => toggleSection('route')}
          className="flex items-center gap-1 w-full text-left hover:text-gray-300"
        >
          {expandedSections.route ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          <span className="font-semibold">Route Info</span>
        </button>
        {expandedSections.route && (
          <div className="ml-4 mt-1 space-y-1 text-gray-300">
            <div>Current Route: <span className="text-cyan-400">{location.pathname}</span></div>
            <div>Search: {location.search || 'None'}</div>
            <div>Hash: {location.hash || 'None'}</div>
          </div>
        )}
      </div>

      {/* Performance Section */}
      <div className="mb-3">
        <button 
          onClick={() => toggleSection('performance')}
          className="flex items-center gap-1 w-full text-left hover:text-gray-300"
        >
          {expandedSections.performance ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          <span className="font-semibold">Performance</span>
        </button>
        {expandedSections.performance && (
          <div className="ml-4 mt-1 space-y-1 text-gray-300">
            <div>Memory: {(performance as any).memory ? `${Math.round((performance as any).memory.usedJSHeapSize / 1048576)}MB` : 'N/A'}</div>
            <div>Connection: {(navigator as any).connection ? (navigator as any).connection.effectiveType : 'Unknown'}</div>
            <div>Timestamp: {new Date().toLocaleTimeString()}</div>
          </div>
        )}
      </div>

      {/* Unsynced Cards Alert */}
      {unsyncedCards.length > 0 && (
        <div className="mt-3 p-2 bg-yellow-900/50 rounded border border-yellow-600">
          <div className="font-semibold text-yellow-400">⚠ Unsynced Cards:</div>
          <div className="max-h-20 overflow-y-auto">
            {unsyncedCards.map(card => (
              <div key={card.id} className="truncate text-yellow-300">
                • {card.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
