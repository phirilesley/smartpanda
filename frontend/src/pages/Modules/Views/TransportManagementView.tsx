import React from 'react';
import { WorkflowCanvas } from './WorkflowCanvas';

const TransportManagementView: React.FC = () => {
  return (
    <WorkflowCanvas
      title="Transport Management"
      subtitle="Manage fleet, route stops, student assignments, and trip execution logs."
      statuses={['Planned', 'Active', 'Suspended', 'Completed']}
      fields={[
        { key: 'name', label: 'Route/Trip', placeholder: 'Route or trip name' },
        { key: 'owner', label: 'Driver/Officer', placeholder: 'Driver or transport officer' },
        { key: 'status', label: 'Status', placeholder: 'Status (Planned/Active/Completed)' },
        { key: 'detail', label: 'Detail', placeholder: 'Stops, vehicle, remarks' }
      ]}
      initialItems={[
        {
          id: 'trp-1',
          name: 'Norton Morning Route',
          status: 'Active',
          owner: 'Mr. Sibanda',
          date: '2026-05-02',
          detail: 'Bus ACX001, 4 configured stops, 36 assigned learners.'
        },
        {
          id: 'trp-2',
          name: 'Ruwa Afternoon Return',
          status: 'Planned',
          owner: 'Ms. Chipo',
          date: '2026-05-03',
          detail: 'Departure 15:10, pickup sequence validated.'
        }
      ]}
    />
  );
};

export default TransportManagementView;

