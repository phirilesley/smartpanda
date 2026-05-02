import React from 'react';
import { WorkflowCanvas } from './WorkflowCanvas';

const HealthManagementView: React.FC = () => {
  return (
    <WorkflowCanvas
      title="Health Management"
      subtitle="Maintain health profiles, screenings, and immunization schedules for students and staff."
      statuses={['Current', 'DueSoon', 'Overdue', 'Escalated']}
      fields={[
        { key: 'name', label: 'Profile/Vaccine', placeholder: 'Profile or vaccine item' },
        { key: 'owner', label: 'Nurse', placeholder: 'Health officer' },
        { key: 'status', label: 'Status', placeholder: 'Status (Current/DueSoon/Overdue)' },
        { key: 'detail', label: 'Detail', placeholder: 'Allergy, screening, due date notes' }
      ]}
      initialItems={[
        {
          id: 'hlth-1',
          name: 'Student STU001 Immunization',
          status: 'DueSoon',
          owner: 'Nurse Moyo',
          date: '2026-05-12',
          detail: 'Tetanus booster due within 10 days.'
        },
        {
          id: 'hlth-2',
          name: 'Grade 5 Screening Batch',
          status: 'Current',
          owner: 'Nurse Chari',
          date: '2026-05-02',
          detail: 'Height/weight screening completed for 34 learners.'
        }
      ]}
    />
  );
};

export default HealthManagementView;

