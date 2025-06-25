
import React, { useEffect } from "react";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useCards } from "@/hooks/useCards";
import { LoadingState } from "@/components/common/LoadingState";
import { Link } from "react-router-dom";

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { cards, loading: cardsLoading, fetchCards, error } = useCards();

  console.log('Index page rendering - user:', user?.email, 'authLoading:', authLoading);

  // Fetch cards when component mounts and user is available
  useEffect(() => {
    if (user && !authLoading && !cardsLoading) {
      console.log('🔄 Triggering cards fetch from Index page');
      fetchCards();
    }
  }, [user, authLoading]);

  if (authLoading) {
    return <LoadingState message="Loading application..." size="lg" fullPage={true} />;
  }

  if (!user) {
    return (
      <div className="bg-[#141416] min-h-screen flex flex-col items-center justify-center">
        <div className="text-center max-w-4xl px-6">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            Create, collect, and trade
            <br />
            card art with stunning 3D effects
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Experience cards like never before with immersive 3D viewing, professional lighting, and visual effects that bring your art to life.
          </p>
          <Link to="/auth">
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-colors">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#141416] min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
          </h1>
          <p className="text-xl text-gray-400">
            Ready to create some amazing cards?
          </p>
        </div>

        {cardsLoading ? (
          <LoadingState message="Loading your cards..." size="md" />
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-yellow-400 text-lg mb-4">⚠️</div>
            <h3 className="text-white text-xl mb-2">Data Loading Issue</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={fetchCards}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
            >
              Retry Loading
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/create" className="bg-gradient-to-br from-green-500 to-blue-600 p-6 rounded-xl hover:scale-105 transition-transform">
              <h3 className="text-white text-xl font-bold mb-2">Create New Card</h3>
              <p className="text-white/80">Design and build your next masterpiece</p>
            </Link>

            <Link to="/cards" className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-xl hover:scale-105 transition-transform">
              <h3 className="text-white text-xl font-bold mb-2">My Cards ({cards.length})</h3>
              <p className="text-white/80">View and manage your collection</p>
            </Link>

            <Link to="/gallery" className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-xl hover:scale-105 transition-transform">
              <h3 className="text-white text-xl font-bold mb-2">Browse Gallery</h3>
              <p className="text-white/80">Discover cards from other creators</p>
            </Link>

            <Link to="/collections" className="bg-gradient-to-br from-teal-500 to-cyan-600 p-6 rounded-xl hover:scale-105 transition-transform">
              <h3 className="text-white text-xl font-bold mb-2">Collections</h3>
              <p className="text-white/80">Organize your cards into sets</p>
            </Link>

            <Link to="/studio" className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl hover:scale-105 transition-transform">
              <h3 className="text-white text-xl font-bold mb-2">Creator Studio</h3>
              <p className="text-white/80">Advanced tools and analytics</p>
            </Link>

            <Link to="/cardshow" className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-xl hover:scale-105 transition-transform">
              <h3 className="text-white text-xl font-bold mb-2">Cardshow Hub</h3>
              <p className="text-white/80">Trading and marketplace features</p>
            </Link>
          </div>
        )}

        {cards.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cards.slice(0, 4).map((card) => (
                <div key={card.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                  {card.thumbnail_url && (
                    <img 
                      src={card.thumbnail_url} 
                      alt={card.title}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                  )}
                  <h3 className="text-white font-semibold text-sm mb-1">{card.title}</h3>
                  <p className="text-gray-400 text-xs capitalize">{card.rarity}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
