
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Collection {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  coverTemplate?: string;
  cardCount: number;
  visibility: string;
  createdAt: string;
}

interface CollectionCardProps {
  collection: Collection;
  onEdit: (collection: Collection) => void;
  onDelete: (collectionId: string) => void;
  onView: (collection: Collection) => void;
}

const coverTemplateGradients = {
  retro: 'from-purple-500 to-pink-500',
  vintage: 'from-amber-500 to-orange-500',
  modern: 'from-blue-500 to-cyan-500',
  neon: 'from-green-400 to-blue-500',
  classic: 'from-gray-600 to-gray-800',
  minimal: 'from-slate-400 to-slate-600'
};

export const CollectionCard = ({ collection, onEdit, onDelete, onView }: CollectionCardProps) => {
  const getCoverElement = () => {
    if (collection.coverImageUrl) {
      return (
        <img 
          src={collection.coverImageUrl} 
          alt={collection.title}
          className="w-full h-32 object-cover"
        />
      );
    }
    
    if (collection.coverTemplate && coverTemplateGradients[collection.coverTemplate as keyof typeof coverTemplateGradients]) {
      return (
        <div className={`w-full h-32 bg-gradient-to-br ${coverTemplateGradients[collection.coverTemplate as keyof typeof coverTemplateGradients]}`} />
      );
    }
    
    return (
      <div className="w-full h-32 bg-gradient-to-br from-crd-blue to-crd-orange" />
    );
  };

  return (
    <Card className="crd-card hover:ring-1 hover:ring-crd-green transition-all cursor-pointer group">
      <div onClick={() => onView(collection)}>
        <div className="relative overflow-hidden rounded-t-lg">
          {getCoverElement()}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-crd-white font-semibold text-lg truncate pr-2">{collection.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="text-crd-lightGray hover:text-crd-white">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-crd-dark border-crd-mediumGray">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(collection);
                  }}
                  className="text-crd-white hover:bg-crd-mediumGray"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(collection);
                  }}
                  className="text-crd-white hover:bg-crd-mediumGray"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(collection.id);
                  }}
                  className="text-red-400 hover:bg-crd-mediumGray"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {collection.description && (
            <p className="text-crd-lightGray text-sm mb-3 line-clamp-2">{collection.description}</p>
          )}
          
          <div className="flex items-center justify-between text-xs text-crd-lightGray">
            <span>{collection.cardCount} cards</span>
            <span className="capitalize">{collection.visibility}</span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
