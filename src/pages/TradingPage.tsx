
import React from 'react';
import { TradingDashboard } from '@/components/trading/TradingDashboard';

const TradingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <TradingDashboard />
    </div>
  );
};

export default TradingPage;
