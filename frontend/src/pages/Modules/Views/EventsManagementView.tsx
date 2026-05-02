import React from 'react';
import { WorkflowCanvas } from './WorkflowCanvas';

const EventsManagementView: React.FC = () => {
  return (
    <WorkflowCanvas
      title="Events Management"
      subtitle="Create school events, register participants, track attendance, and monitor venue conflicts."
      statuses={['Scheduled', 'Open', 'InProgress', 'Completed', 'Cancelled']}
      fields={[
        { key: 'name', label: 'Event Name', placeholder: 'Event name' },
        { key: 'owner', label: 'Coordinator', placeholder: 'Coordinator' },
        { key: 'status', label: 'Status', placeholder: 'Status (Scheduled/Open/Completed)' },
        { key: 'detail', label: 'Detail', placeholder: 'Venue, date, notes' }
      ]}
      initialItems={[
        {
          id: 'evt-1',
          name: 'Term 1 Parent Consultation',
          status: 'Scheduled',
          owner: 'Deputy Head',
          date: '2026-05-20',
          detail: 'Main Hall, Grade 5-7 slots, RSVP enabled.'
        },
        {
          id: 'evt-2',
          name: 'Inter-house Athletics',
          status: 'Open',
          owner: 'Sports Director',
          date: '2026-05-28',
          detail: 'Field A, registration still open for houses.'
        }
      ]}
    />
  );
};

export default EventsManagementView;

