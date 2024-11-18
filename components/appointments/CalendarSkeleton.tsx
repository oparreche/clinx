'use client';

export default function CalendarSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-40 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Calendar skeleton */}
      <div className="bg-white rounded-lg shadow p-4">
        {/* Calendar header */}
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Week days */}
          {[...Array(7)].map((_, i) => (
            <div key={`day-${i}`} className="h-8 bg-gray-200 rounded"></div>
          ))}

          {/* Calendar cells */}
          {[...Array(35)].map((_, i) => (
            <div key={`cell-${i}`} className="h-32 bg-gray-100 rounded p-2">
              <div className="h-4 w-8 bg-gray-200 rounded mb-2"></div>
              {/* Event placeholders */}
              {Math.random() > 0.7 && (
                <div className="h-6 bg-gray-200 rounded mb-1"></div>
              )}
              {Math.random() > 0.8 && (
                <div className="h-6 bg-gray-200 rounded"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
