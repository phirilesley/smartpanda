import React from 'react';
import { WorkflowCanvas } from './WorkflowCanvas';

const HostelManagementView: React.FC = () => {
  return (
    <WorkflowCanvas
      title="Hostel Management"
      subtitle="Control hostels, room/bed allocations, transfers, checkout, and boarding incidents."
      statuses={['Active', 'Transferred', 'CheckedOut', 'Flagged', 'Resolved']}
      fields={[
        { key: 'name', label: 'Allocation', placeholder: 'Student/room reference' },
        { key: 'owner', label: 'Hostel Officer', placeholder: 'Matron/Warden' },
        { key: 'status', label: 'Status', placeholder: 'Status (Active/Transferred/CheckedOut)' },
        { key: 'detail', label: 'Detail', placeholder: 'Bed code, incident, transfer note' }
      ]}
      initialItems={[
        {
          id: 'hst-1',
          name: 'T. Moyo -> A1-02',
          status: 'Active',
          owner: 'Warden Ncube',
          date: '2026-05-01',
          detail: 'Current term allocation, no incident.'
        },
        {
          id: 'hst-2',
          name: 'L. Dube -> B3-08',
          status: 'Flagged',
          owner: 'Matron Zhou',
          date: '2026-05-02',
          detail: 'Noise incident logged, pending resolution.'
        }
      ]}
    />
  );
};

export default HostelManagementView;

