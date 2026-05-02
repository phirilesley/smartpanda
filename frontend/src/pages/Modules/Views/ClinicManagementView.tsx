import React from 'react';
import { WorkflowCanvas } from './WorkflowCanvas';

const ClinicManagementView: React.FC = () => {
  return (
    <WorkflowCanvas
      title="Clinic Management"
      subtitle="Track clinic visits, treatment plans, referrals, and medication dispensing history."
      statuses={['Open', 'FollowUpScheduled', 'Referred', 'Closed']}
      fields={[
        { key: 'name', label: 'Visit Case', placeholder: 'Case/visit title' },
        { key: 'owner', label: 'Clinician', placeholder: 'Clinician or nurse' },
        { key: 'status', label: 'Status', placeholder: 'Status (Open/Referred/Closed)' },
        { key: 'detail', label: 'Detail', placeholder: 'Diagnosis, medication, referral notes' }
      ]}
      initialItems={[
        {
          id: 'cln-1',
          name: 'STU001 - Fever Case',
          status: 'FollowUpScheduled',
          owner: 'Nurse Mlambo',
          date: '2026-05-02',
          detail: 'Paracetamol dispensed, follow-up in 2 days.'
        },
        {
          id: 'cln-2',
          name: 'STAFF009 - Referral',
          status: 'Referred',
          owner: 'Nurse Dube',
          date: '2026-05-01',
          detail: 'Referred to district hospital for further tests.'
        }
      ]}
    />
  );
};

export default ClinicManagementView;

