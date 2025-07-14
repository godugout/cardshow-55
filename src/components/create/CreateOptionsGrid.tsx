
import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, FileText, Sparkles } from 'lucide-react';

export const CreateOptionsGrid: React.FC = () => {
  const createOptions = [
    {
      title: "Create CRD",
      description: "Design digital trading cards with professional tools",
      icon: <Palette className="w-8 h-8" />,
      link: "/create/crd",
      gradient: "from-purple-500 to-blue-500"
    },
    {
      title: "Create Story",
      description: "Tell your story through interactive narratives",
      icon: <FileText className="w-8 h-8" />,
      link: "/create/story",
      gradient: "from-green-500 to-teal-500"
    },
    {
      title: "AI Assistant",
      description: "Get help creating with AI-powered tools",
      icon: <Sparkles className="w-8 h-8" />,
      link: "/create/ai",
      gradient: "from-orange-500 to-red-500",
      comingSoon: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {createOptions.map((option) => (
        <div
          key={option.title}
          className="relative group"
        >
          {option.comingSoon ? (
            <div className="bg-crd-darker border border-crd-border rounded-xl p-6 h-full opacity-60 cursor-not-allowed">
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${option.gradient} flex items-center justify-center text-white mb-4`}>
                {option.icon}
              </div>
              <h3 className="text-xl font-semibold text-crd-light mb-2">{option.title}</h3>
              <p className="text-crd-muted mb-4">{option.description}</p>
              <span className="inline-block px-3 py-1 bg-crd-accent/20 text-crd-accent text-sm rounded-full">
                Coming Soon
              </span>
            </div>
          ) : (
            <Link
              to={option.link}
              className="block bg-crd-darker border border-crd-border rounded-xl p-6 h-full transition-all duration-300 hover:border-crd-accent hover:bg-crd-dark group-hover:transform group-hover:scale-105"
            >
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${option.gradient} flex items-center justify-center text-white mb-4 transition-transform group-hover:scale-110`}>
                {option.icon}
              </div>
              <h3 className="text-xl font-semibold text-crd-light mb-2 group-hover:text-white transition-colors">
                {option.title}
              </h3>
              <p className="text-crd-muted group-hover:text-crd-light transition-colors">
                {option.description}
              </p>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};
