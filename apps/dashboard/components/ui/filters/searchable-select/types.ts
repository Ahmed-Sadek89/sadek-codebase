export type FilterOption = {
  id: number;
  label: string;
};

export type SearchableFilterProps = {
  value: number | null;
  onChange: (id: number | null) => void;
  className?: string;
};
