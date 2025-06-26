
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Plus } from 'lucide-react';

const CardsPage = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-crd-white mb-2">My Cards</h1>
            <p className="text-crd-lightGray">Create and manage your trading cards</p>
          </div>
          <CRDButton asChild variant="primary">
            <Link to="/cards/create">
              <Plus className="w-4 h-4 mr-2" />
              Create Card
            </Link>
          </CRDButton>
        </div>

        {/* Content */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white">Get Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-crd-lightGray">
              Welcome to your card creation hub! Start by creating your first trading card.
            </p>
            <CRDButton asChild variant="primary">
              <Link to="/cards/create">
                Create Your First Card
              </Link>
            </CRDButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CardsPage;
