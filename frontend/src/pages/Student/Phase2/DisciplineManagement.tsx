import React, { useMemo, useState } from 'react';

interface DisciplineCase {
  id: string;
  studentName: string;
  studentNumber: string;
  grade: string;
  stream: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Review' | 'Resolved';
  description: string;
}

export const DisciplineManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Open' | 'In Review' | 'Resolved'>('all');

  const cases: DisciplineCase[] = [
    {
      id: 'disc-001',
      studentName: 'Tadiwa Moyo',
      studentNumber: 'SP-2026-014',
      grade: 'Form 2',
      stream: 'B',
      category: 'Behavior',
      severity: 'Medium',
      status: 'Open',
      description: 'Repeated disruption during class sessions.'
    },
    {
      id: 'disc-002',
      studentName: 'Chipo Ndlovu',
      studentNumber: 'SP-2026-062',
      grade: 'Form 4',
      stream: 'A',
      category: 'Attendance',
      severity: 'Low',
      status: 'Resolved',
      description: 'Resolved chronic late arrival issue with guardian intervention.'
    }
  ];

  const filteredCases = useMemo(() => {
    return cases.filter((disciplineCase) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        disciplineCase.studentName.toLowerCase().includes(q) ||
        disciplineCase.studentNumber.toLowerCase().includes(q) ||
        disciplineCase.description.toLowerCase().includes(q);
      const matchesStatus = filterStatus === 'all' || disciplineCase.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [cases, filterStatus, searchTerm]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Discipline Management</h1>
      <div className="flex gap-3">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search student or case"
          className="border rounded px-3 py-2 w-full"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All</option>
          <option value="Open">Open</option>
          <option value="In Review">In Review</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="text-left p-3">Student</th>
              <th className="text-left p-3">Case</th>
              <th className="text-left p-3">Severity</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((disciplineCase) => (
              <tr key={disciplineCase.id} className="border-t border-gray-100 dark:border-gray-700">
                <td className="p-3">{disciplineCase.studentName} ({disciplineCase.studentNumber})</td>
                <td className="p-3">{disciplineCase.description}</td>
                <td className="p-3">{disciplineCase.severity}</td>
                <td className="p-3">{disciplineCase.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
