import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getModuleBySlug } from './modulesCatalogData';

const statusClass = (status: 'implemented' | 'partial' | 'missing') => {
  if (status === 'implemented') return 'text-green-700 bg-green-100';
  if (status === 'partial') return 'text-amber-700 bg-amber-100';
  return 'text-red-700 bg-red-100';
};

export const ModuleDetail: React.FC = () => {
  const { moduleSlug } = useParams<{ moduleSlug: string }>();
  const module = moduleSlug ? getModuleBySlug(moduleSlug) : undefined;

  if (!module) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="text-xl font-semibold text-red-700">Module not found</h2>
        <Link to="/modules" className="mt-4 inline-block text-primary-700 hover:underline">
          Return to module catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-300">
          Module {module.id} - {module.phase}
        </p>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{module.name}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Backend Status</h3>
          <span className={`mt-3 inline-block rounded px-2 py-1 text-sm font-semibold ${statusClass(module.backendStatus)}`}>
            {module.backendStatus}
          </span>
          <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{module.backendArea}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Frontend View Status</h3>
          <span className={`mt-3 inline-block rounded px-2 py-1 text-sm font-semibold ${statusClass(module.frontendStatus)}`}>
            {module.frontendStatus}
          </span>
          <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
            Dedicated module route is available at <code>{module.viewPath}</code>.
          </p>
        </div>
      </div>

      <Link to="/modules" className="inline-block rounded bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
        Back to all modules
      </Link>
    </div>
  );
};
