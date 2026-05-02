import React from 'react';

interface ModuleKpi {
  label: string;
  value: string;
  note: string;
}

interface OperationsModuleTemplateProps {
  title: string;
  subtitle: string;
  zimbabweFocus: string;
  kpis: ModuleKpi[];
  workflows: string[];
  complianceChecks: string[];
}

export const OperationsModuleTemplate: React.FC<OperationsModuleTemplateProps> = ({
  title,
  subtitle,
  zimbabweFocus,
  kpis,
  workflows,
  complianceChecks
}) => {
  return (
    <div className="space-y-6">
      <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{subtitle}</p>
        <p className="mt-3 rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
          Zimbabwe Focus: {zimbabweFocus}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <article
            key={kpi.label}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{kpi.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{kpi.value}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{kpi.note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Core Workflows</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {workflows.map((workflow) => (
              <li key={workflow} className="rounded bg-slate-50 px-3 py-2 dark:bg-slate-900/40">
                {workflow}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Compliance Checks</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {complianceChecks.map((check) => (
              <li key={check} className="rounded bg-slate-50 px-3 py-2 dark:bg-slate-900/40">
                {check}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
};

