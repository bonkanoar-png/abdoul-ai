"use client";

type ProjectFiltersProps = {
  categories: string[];
  technologies: string[];
  category: string;
  technology: string;
  onCategoryChange: (category: string) => void;
  onTechnologyChange: (technology: string) => void;
};

export function ProjectFilters({
  categories,
  technologies,
  category,
  technology,
  onCategoryChange,
  onTechnologyChange,
}: ProjectFiltersProps) {
  return (
    <fieldset className="border-line bg-surface rounded-[var(--radius-lg)] border p-5">
      <legend className="text-ink px-2 text-sm font-bold">Filtrer les projets</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-muted text-sm font-semibold">
          Catégorie
          <select
            className="border-line bg-canvas text-ink mt-2 min-h-11 w-full rounded-xl border px-3"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="Tous">Toutes les catégories</option>
            {categories.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-muted text-sm font-semibold">
          Technologie
          <select
            className="border-line bg-canvas text-ink mt-2 min-h-11 w-full rounded-xl border px-3"
            value={technology}
            onChange={(event) => onTechnologyChange(event.target.value)}
          >
            <option value="Toutes">Toutes les technologies</option>
            {technologies.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
    </fieldset>
  );
}
