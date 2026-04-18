import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AppProvider, useApp } from '../context/AppContext';
import { MobileDrawer } from './MobileDrawer';
import { BottomNav } from './BottomNav';
import { Layout } from './Layout';
import type { UserRole } from '../context/AppContext';

function RoleSetter({ role }: { role: UserRole }) {
  const { setRole } = useApp();
  React.useEffect(() => {
    setRole(role);
  }, [role, setRole]);
  return null;
}

function renderWithShell(ui: React.ReactNode, initialRole: UserRole = 'patient', initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AppProvider>
        <RoleSetter role={initialRole} />
        {ui}
      </AppProvider>
    </MemoryRouter>
  );
}

describe('BottomNav', () => {
  it('renders five tabs for patient role', () => {
    renderWithShell(<BottomNav onOpenMore={() => {}} />, 'patient');
    const nav = screen.getByRole('navigation', { name: /primary/i });
    const links = within(nav).getAllByRole('link');
    const moreBtn = within(nav).getAllByRole('button');
    expect(links.length + moreBtn.length).toBe(5);
  });

  it('patient tabs include Home, Reminders, Health ID, Video', () => {
    renderWithShell(<BottomNav onOpenMore={() => {}} />, 'patient');
    const nav = screen.getByRole('navigation', { name: /primary/i });
    const hrefs = within(nav)
      .getAllByRole('link')
      .map(a => a.getAttribute('href'));
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/reminders');
    expect(hrefs).toContain('/health-id');
    expect(hrefs).toContain('/video-consult');
  });

  it('doctor tabs include Home, Patients, Prescriptions, Voice', () => {
    renderWithShell(<BottomNav onOpenMore={() => {}} />, 'doctor');
    const nav = screen.getByRole('navigation', { name: /primary/i });
    const hrefs = within(nav)
      .getAllByRole('link')
      .map(a => a.getAttribute('href'));
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/patients');
    expect(hrefs).toContain('/prescriptions');
    expect(hrefs).toContain('/voice-consult');
  });

  it('admin tabs include Home, Staff, Inventory, Reports', () => {
    renderWithShell(<BottomNav onOpenMore={() => {}} />, 'admin');
    const nav = screen.getByRole('navigation', { name: /primary/i });
    const hrefs = within(nav)
      .getAllByRole('link')
      .map(a => a.getAttribute('href'));
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/staff');
    expect(hrefs).toContain('/inventory');
    expect(hrefs).toContain('/reports');
  });

  it('invokes onOpenMore when the More tab is tapped', () => {
    let opened = 0;
    renderWithShell(<BottomNav onOpenMore={() => { opened += 1; }} />, 'patient');
    const more = screen.getByRole('button', { name: /more/i });
    fireEvent.click(more);
    expect(opened).toBe(1);
  });
});

describe('MobileDrawer', () => {
  it('is hidden when open=false', () => {
    renderWithShell(<MobileDrawer open={false} onClose={() => {}} />, 'patient');
    const drawer = screen.queryByRole('dialog', { name: /navigation/i });
    expect(drawer).toBeNull();
  });

  it('renders when open=true', () => {
    renderWithShell(<MobileDrawer open={true} onClose={() => {}} />, 'patient');
    expect(screen.getByRole('dialog', { name: /navigation/i })).toBeInTheDocument();
  });

  it('closes when backdrop is clicked', () => {
    let closed = 0;
    renderWithShell(<MobileDrawer open={true} onClose={() => { closed += 1; }} />, 'patient');
    const backdrop = screen.getByTestId('mobile-drawer-backdrop');
    fireEvent.click(backdrop);
    expect(closed).toBe(1);
  });

  it('renders role switcher and language selector', () => {
    renderWithShell(<MobileDrawer open={true} onClose={() => {}} />, 'patient');
    expect(screen.getByLabelText(/switch role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
  });

  it('renders all patient nav items when role=patient', () => {
    renderWithShell(<MobileDrawer open={true} onClose={() => {}} />, 'patient');
    const dialog = screen.getByRole('dialog', { name: /navigation/i });
    const links = within(dialog).getAllByRole('link');
    const hrefs = links.map(a => a.getAttribute('href'));
    expect(hrefs).toContain('/health-id');
    expect(hrefs).toContain('/records');
    expect(hrefs).toContain('/consent');
  });

  it('closes when a nav link inside is clicked', () => {
    let closed = 0;
    renderWithShell(<MobileDrawer open={true} onClose={() => { closed += 1; }} />, 'patient');
    const dialog = screen.getByRole('dialog', { name: /navigation/i });
    const firstLink = within(dialog).getAllByRole('link')[0];
    fireEvent.click(firstLink);
    expect(closed).toBeGreaterThan(0);
  });
});

describe('Layout mobile header', () => {
  it('renders a hamburger (menu) button', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppProvider>
          <Layout />
        </AppProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /open navigation/i })).toBeInTheDocument();
  });

  it('renders the bottom navigation on mobile', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppProvider>
          <Layout />
        </AppProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument();
  });

  it('opens the drawer when hamburger is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppProvider>
          <Layout />
        </AppProvider>
      </MemoryRouter>
    );
    expect(screen.queryByRole('dialog', { name: /navigation/i })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /open navigation/i }));
    expect(screen.getByRole('dialog', { name: /navigation/i })).toBeInTheDocument();
  });
});
