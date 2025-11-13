import { render, screen } from '@testing-library/react';
import Maybe from '../../components/common/Maybe';

describe('Maybe', () => {
  it('renders children when test is true', () => {
    render(
      <Maybe test={true}>
        <div>Visible Content</div>
      </Maybe>
    );

    expect(screen.getByText('Visible Content')).toBeInTheDocument();
  });

  it('does not render children when test is false', () => {
    render(
      <Maybe test={false}>
        <div>Hidden Content</div>
      </Maybe>
    );

    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
  });

  it('does not render children when test is undefined', () => {
    render(
      <Maybe test={undefined}>
        <div>Hidden Content</div>
      </Maybe>
    );

    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
  });

  it('does not render children when test is null', () => {
    render(
      <Maybe test={null}>
        <div>Hidden Content</div>
      </Maybe>
    );

    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
  });

  it('does not render children when test is empty string', () => {
    render(
      <Maybe test={''}>
        <div>Hidden Content</div>
      </Maybe>
    );

    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
  });

  it('renders children when test is truthy string', () => {
    render(
      <Maybe test={'truthy'}>
        <div>Visible Content</div>
      </Maybe>
    );

    expect(screen.getByText('Visible Content')).toBeInTheDocument();
  });

  it('renders children when test is non-zero number', () => {
    render(
      <Maybe test={1}>
        <div>Visible Content</div>
      </Maybe>
    );

    expect(screen.getByText('Visible Content')).toBeInTheDocument();
  });

  it('does not render children when test is zero', () => {
    render(
      <Maybe test={0}>
        <div>Hidden Content</div>
      </Maybe>
    );

    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <Maybe test={true}>
        <div>First Child</div>
        <div>Second Child</div>
      </Maybe>
    );

    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
  });
});
