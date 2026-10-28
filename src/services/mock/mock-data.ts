import { Board, ColumnStatus, Label, Priority } from '@/features/board/types';
import { Task } from '@/features/tasks/types';

const TITLES = [
  'Fix login redirect after session expiration',
  'Optimize dashboard initial load time',
  'Implement password reset email flow',
  'Resolve memory leak in notifications',
  'Add pagination to user management',
  'Fix duplicate API requests on page refresh',
  'Improve accessibility for modal dialogs',
  'Update profile image upload validation',
  'Implement email verification reminder',
  'Fix race condition in websocket updates',
  'Reduce bundle size using code splitting',
  'Add loading skeleton for dashboard widgets',
  'Fix incorrect timezone conversion',
  'Implement audit log filtering',
  'Improve search result ranking',
  'Fix broken keyboard navigation',
  'Optimize database query for reports',
  'Add export to CSV feature',
  'Fix file upload progress indicator',
  'Implement two-factor authentication',
  'Resolve stale cache after profile update',
  'Improve mobile navigation experience',
  'Fix dark mode color inconsistencies',
  'Implement organization switching',
  'Optimize image lazy loading',
  'Add confirmation dialog before delete',
  'Fix notification badge count',
  'Improve API error handling',
  'Add retry logic for failed requests',
  'Fix calendar recurring events',
  'Implement infinite scrolling',
  'Resolve drag-and-drop flickering',
  'Improve form validation messages',
  'Fix sorting on user table',
  'Optimize search indexing',
  'Implement project archiving',
  'Fix markdown preview rendering',
  'Add keyboard shortcuts',
  'Improve onboarding walkthrough',
  'Resolve authentication timeout issues',
  'Fix duplicate email invitations',
  'Implement activity timeline',
  'Optimize websocket reconnection',
  'Improve PDF export formatting',
  'Fix comment mention notifications',
  'Implement bulk task editing',
  'Resolve avatar caching issue',
  'Improve audit log performance',
  'Fix dropdown positioning',
  'Implement saved search filters',
  'Optimize GraphQL query performance',
  'Fix task ordering persistence',
  'Improve offline synchronization',
  'Implement custom user roles',
  'Resolve file permission issues',
  'Fix responsive table layout',
  'Improve chart rendering performance',
  'Implement project templates',
  'Fix browser back navigation',
  'Optimize background job scheduling',
  'Improve accessibility for tables',
  'Resolve duplicate webhook events',
  'Fix attachment preview generation',
  'Implement custom notifications',
  'Optimize task filtering performance',
  'Fix calendar drag interaction',
  'Improve session management',
  'Resolve broken deep links',
  'Implement workspace settings',
  'Fix role permission inheritance',
  'Optimize API response caching',
  'Improve error boundary handling',
  'Resolve search indexing delays',
  'Implement recurring task creation',
  'Fix markdown editor shortcuts',
  'Improve dashboard widget layout',
  'Resolve SSO login issues',
  'Optimize report generation',
  'Implement custom fields',
  'Fix browser autofill problems',
  'Improve image compression pipeline',
  'Resolve duplicate task creation',
  'Implement archived task recovery',
];

const statuses: ColumnStatus[] = ['todo', 'in-progress', 'in-review', 'done'];

const priorities: Priority[] = ['low', 'medium', 'high'];

const labels: Label[] = ['feature', 'bug', 'docs', 'perf'];

// eslint-disable-next-line prefer-const
export const DUMMY_TASKS: Task[] = Array.from({ length: 8 }, (_, i) => {
  const status = statuses[i % statuses.length];

  return {
    id: `task-${i + 1}`,
    title: `${TITLES[i % TITLES.length]} ${Math.floor(i / TITLES.length) + 1}`,
    description: `Investigation and implementation required for ${TITLES[i % TITLES.length]}.`,
    priority: priorities[(i * 7) % priorities.length],
    label: labels[(i * 11) % labels.length],
    status,
    assigneeId: `${(i % 10) + 1}`,
    boardId: 'board-1',
    createdAt: new Date(Date.UTC(2026, 5, 1 + (i % 28), 9)).toISOString(),
    dueDate: new Date(Date.UTC(2026, 5, 10 + (i % 20), 9)).toISOString(),
  };
});

const titles = {
  todo: 'Todo',
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  done: 'Done',
};

export const DUMMY_BOARD: Board = {
  id: 'board-1',
  title: 'Project-1',
  createdAt: '2026-06-01T09:00:00Z',
  columns: statuses.map((status, index) => ({
    id: `col-${index + 1}`,
    title: titles[status],
    status,
    taskIds: DUMMY_TASKS.filter((t) => t.status === status).map((t) => t.id),
  })),
};
