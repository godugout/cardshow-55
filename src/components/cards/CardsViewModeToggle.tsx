
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, LayoutGrid, Table } from "lucide-react";

type ViewMode = 'rows' | 'grid' | 'table';

interface CardsViewModeToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export const CardsViewModeToggle: React.FC<CardsViewModeToggleProps> = ({
  value,
  onChange,
}) => {
  return (
    <ToggleGroup type="single" value={value} onValueChange={(val) => val && onChange(val as ViewMode)}>
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
