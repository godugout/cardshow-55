
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, LayoutGrid, Table } from "lucide-react";

type CardManagementViewMode = 'rows' | 'grid' | 'table';

interface CardManagementViewToggleProps {
  value: CardManagementViewMode;
  onChange: (mode: CardManagementViewMode) => void;
}

export const CardManagementViewToggle: React.FC<CardManagementViewToggleProps> = ({
  value,
  onChange,
}) => {
  return (
    <ToggleGroup type="single" value={value} onValueChange={(val) => val && onChange(val as CardManagementViewMode)}>
      <ToggleGroupItem value="rows" aria-label="Row View">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Grid View">
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="table" aria-label="Table View">
        <Table className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export type { CardManagementViewMode };
