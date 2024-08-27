export const shootStatusMessage = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'The task is awaiting action and has not started yet';
      break;

    case 'Pre_production':
      return 'Preparations are being made before production begins';
      break;

    case 'Production':
      return 'The task is currently in progress';
      break;

    case 'Post_production':
      return 'The task is completed and in the final stages of review';
      break;

    case 'Revision':
      return 'The task requires revisions or corrections';
      break;

    case 'Completed':
      return 'The task has been successfully finished';
      break;

    case 'In_dispute':
      return 'There are issues or disagreements that need to be resolved';
      break;

    case 'Cancelled':
      return 'The task has been stopped and will not be completed';
      break;
    default:
      break;
  }
};

export const allStatus = [
  {
    key: 'pending',
    value: 'Pending',
  },
  {
    key: 'pre_production',
    value: 'Pre Production',
  },
  {
    key: 'production',
    value: 'Production',
  },
  {
    key: 'post_production',
    value: 'Post Production',
  },
  {
    key: 'revision',
    value: 'Revision',
  },
  {
    key: 'completed',
    value: 'Completed',
  },
  {
    key: 'cancelled',
    value: 'Cancelled',
  },
  {
    key: 'in_dispute',
    value: 'In Dispute',
  },
];

