import { render, screen } from '@testing-library/react';
import StatusBadge from './components/StatusBadge';

test('renders booking status badge', () => {
  render(<StatusBadge status="pending" />);
  expect(screen.getByText(/pending/i)).toBeInTheDocument();
});
