export function ItineraryDisplay({ itinerary }: { itinerary: string[] }) {
  return (
    <ol className="space-y-4">
      {itinerary.map((item, index) => (
        <li key={index} className="flex gap-4">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
            {index + 1}
          </div>
          <div className="pt-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal">Day {index + 1}</p>
            <p className="text-sm text-ink">{item}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
