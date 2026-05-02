import React from 'react';
import { Link } from 'react-router-dom';
import { moduleCatalog } from './modulesCatalogData';

const badgeClass = (status: 'implemented' | 'partial' | 'missing') => {
  if (status === 'implemented') return 'bg-green-100 text-green-800';
  if (status === 'partial') return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
};

export const ModuleCatalog: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          All {moduleCatalog.length} Enterprise Modules
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Module-by-module view coverage and backend implementation audit.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {moduleCatalog.map((module) => (
          <Link
            key={module.id}
            to={module.viewPath}
            className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-primary-400 hover:shadow dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-300">
                  Module {module.id} • {module.phase}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{module.name}</h3>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`rounded px-2 py-1 text-xs font-semibold ${badgeClass(module.backendStatus)}`}>
                Backend: {module.backendStatus}
              </span>
              <span className={`rounded px-2 py-1 text-xs font-semibold ${badgeClass(module.frontendStatus)}`}>
                Frontend: {module.frontendStatus}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

