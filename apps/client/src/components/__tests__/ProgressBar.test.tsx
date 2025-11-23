import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  it('should render without crashing', () => {
    const { container } = render(<ProgressBar value={50} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should display the correct percentage width', () => {
    const { container } = render(<ProgressBar value={75} />);
    const progressFill = container.querySelector('[style*="width"]');

    expect(progressFill).toHaveStyle({ width: '75%' });
  });

  it('should show label when showLabel is true', () => {
    render(<ProgressBar value={60} showLabel={true} />);

    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('should not show label when showLabel is false', () => {
    render(<ProgressBar value={60} showLabel={false} />);

    expect(screen.queryByText('60%')).not.toBeInTheDocument();
  });

  it('should cap percentage at 100%', () => {
    const { container } = render(<ProgressBar value={150} max={100} />);
    const progressFill = container.querySelector('[style*="width"]');

    expect(progressFill).toHaveStyle({ width: '100%' });
  });

  it('should not go below 0%', () => {
    const { container } = render(<ProgressBar value={-20} />);
    const progressFill = container.querySelector('[style*="width"]');

    expect(progressFill).toHaveStyle({ width: '0%' });
  });

  it('should handle custom max value', () => {
    const { container } = render(<ProgressBar value={50} max={200} />);
    const progressFill = container.querySelector('[style*="width"]');

    // 50 out of 200 is 25%
    expect(progressFill).toHaveStyle({ width: '25%' });
  });

  it('should apply different sizes correctly', () => {
    const { container: smContainer } = render(<ProgressBar value={50} size="sm" />);
    const { container: mdContainer } = render(<ProgressBar value={50} size="md" />);
    const { container: lgContainer } = render(<ProgressBar value={50} size="lg" />);

    const smBar = smContainer.querySelector('.h-1\\.5');
    const mdBar = mdContainer.querySelector('.h-2');
    const lgBar = lgContainer.querySelector('.h-3');

    expect(smBar).toBeInTheDocument();
    expect(mdBar).toBeInTheDocument();
    expect(lgBar).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<ProgressBar value={50} className="custom-class" />);
    const wrapper = container.firstChild;

    expect(wrapper).toHaveClass('custom-class');
  });

  it('should use correct colors for different percentages', () => {
    const { container: redContainer } = render(<ProgressBar value={10} />);
    const { container: yellowContainer } = render(<ProgressBar value={35} />);
    const { container: blueContainer } = render(<ProgressBar value={60} />);
    const { container: greenContainer } = render(<ProgressBar value={90} />);

    expect(redContainer.querySelector('.bg-red-500')).toBeInTheDocument();
    expect(yellowContainer.querySelector('.bg-yellow-500')).toBeInTheDocument();
    expect(blueContainer.querySelector('.bg-blue-500')).toBeInTheDocument();
    expect(greenContainer.querySelector('.bg-green-500')).toBeInTheDocument();
  });

  it('should round percentage in label', () => {
    render(<ProgressBar value={66.6} showLabel={true} />);

    // 66.6 should round to 67
    expect(screen.getByText('67%')).toBeInTheDocument();
  });
});
