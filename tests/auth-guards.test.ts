/** @jest-environment node */
jest.mock('server-only', () => ({}), { virtual: true });
jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('next/navigation', () => ({ redirect: (url: string) => { throw new Error(`REDIRECT:${url}`); } }));
import { getServerSession } from 'next-auth';
import { requireRole } from '../lib/auth';
import { runAdminCheck } from '../src/app/admin/actions';
import AdminPage from '../src/app/admin/page';
import DashboardPage from '../src/app/dashboard/page';
const sessionMock = jest.mocked(getServerSession);
const session = (role: 'admin' | 'user') => ({ user: { id: 'test', name: 'Test', email: 'test@example.com', role }, expires: '2099-01-01' });
beforeEach(() => sessionMock.mockReset());
test('page and Server Action independently reject anonymous sessions without Middleware', async () => {
  sessionMock.mockResolvedValue(null);
  await expect(DashboardPage()).rejects.toThrow('REDIRECT:/login');
  await expect(AdminPage({ searchParams: Promise.resolve({}) })).rejects.toThrow('REDIRECT:/login');
  await expect(runAdminCheck()).rejects.toThrow('REDIRECT:/login');
});
test('page and Server Action independently reject users without Middleware', async () => {
  sessionMock.mockResolvedValue(session('user'));
  await expect(requireRole()).resolves.toEqual(session('user'));
  await expect(AdminPage({ searchParams: Promise.resolve({}) })).rejects.toThrow('REDIRECT:/forbidden');
  await expect(runAdminCheck()).rejects.toThrow('REDIRECT:/forbidden');
});
test('admin can render page and execute Server Action', async () => {
  sessionMock.mockResolvedValue(session('admin'));
  await expect(AdminPage({ searchParams: Promise.resolve({}) })).resolves.toBeTruthy();
  await expect(runAdminCheck()).rejects.toThrow('REDIRECT:/admin?checked=1');
});
