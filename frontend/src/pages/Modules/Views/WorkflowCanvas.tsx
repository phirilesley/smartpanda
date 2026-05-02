import React, { useMemo, useState } from 'react';

type WorkflowItem = {
  id: string;
  name: string;
  status: string;
  owner: string;
  date: string;
  detail: string;
};

type FormField = {
  key: string;
  label: string;
  placeholder: string;
};

interface WorkflowCanvasProps {
  title: string;
  subtitle: string;
  statuses: string[];
  fields: FormField[];
  initialItems: WorkflowItem[];
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  title,
  subtitle,
  statuses,
  fields,
  initialItems
}) => {
  const [items, setItems] = useState<WorkflowItem[]>(initialItems);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(initialItems[0]?.id ?? null);
  const [form, setForm] = useState<Record<string, string>>(
    fields.reduce((acc, field) => {
      acc[field.key] = '';
      return acc;
    }, {} as Record<string, string>)
  );
  const [activity, setActivity] = useState<string[]>([
    `${new Date().toLocaleString()}: ${title} workspace loaded.`
  ]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.owner.toLowerCase().includes(search.toLowerCase()) ||
        item.detail.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [items, search, statusFilter]);

  const selected = items.find((x) => x.id === selectedId) ?? null;

  const createItem = () => {
    const name = form[fields[0]?.key] ?? '';
    if (!name.trim()) return;

    const owner = form.owner?.trim() || 'Operations';
    const status = form.status?.trim() || statuses[0];
    const detail = form.detail?.trim() || 'No detail';

    const next: WorkflowItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      owner,
      status,
      detail,
      date: new Date().toISOString().slice(0, 10)
    };

    setItems((prev) => [next, ...prev]);
    setSelectedId(next.id);
    setActivity((prev) => [`${new Date().toLocaleString()}: Created "${next.name}".`, ...prev.slice(0, 11)]);
    setForm(fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {} as Record<string, string>));
  };

  const updateStatus = (id: string, nextStatus: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)));
    const changed = items.find((x) => x.id === id);
    if (changed) {
      setActivity((prev) => [
        `${new Date().toLocaleString()}: ${changed.name} -> ${nextStatus}.`,
        ...prev.slice(0, 11)
      ]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{subtitle}</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-3 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, owner, detail..."
              className="rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            >
              <option>All</option>
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Records: <span className="font-semibold">{filtered.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left dark:border-slate-700">
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Owner</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className="cursor-pointer border-b border-slate-100 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900/60"
                  >
                    <td className="px-2 py-2 font-medium text-slate-900 dark:text-slate-100">{item.name}</td>
                    <td className="px-2 py-2 text-slate-600 dark:text-slate-300">{item.owner}</td>
                    <td className="px-2 py-2">
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                      >
                        {statuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-2 text-slate-600 dark:text-slate-300">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">Create</h2>
            <div className="mt-3 space-y-2">
              {fields.map((field) => (
                <input
                  key={field.key}
                  value={form[field.key] ?? ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  aria-label={field.label}
                  className="w-full rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                />
              ))}
              <button
                onClick={createItem}
                className="w-full rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Save Record
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">Detail</h2>
            {selected ? (
              <div className="mt-3 space-y-2 text-sm">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{selected.name}</p>
                <p className="text-slate-600 dark:text-slate-300">Owner: {selected.owner}</p>
                <p className="text-slate-600 dark:text-slate-300">Status: {selected.status}</p>
                <p className="text-slate-600 dark:text-slate-300">Date: {selected.date}</p>
                <p className="rounded bg-slate-50 p-2 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200">
                  {selected.detail}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">Select a row to view details.</p>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">Activity History</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          {activity.map((line) => (
            <li key={line} className="rounded bg-slate-50 px-3 py-2 dark:bg-slate-900/40">
              {line}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

