// Mock implementation of next-auth/react
export const signIn = jest.fn().mockResolvedValue({ ok: true });
export const signOut = jest.fn().mockResolvedValue(undefined);
export const useSession = jest.fn(() => ({
  data: null,
  status: 'unauthenticated',
}));
export const getSession = jest.fn().mockResolvedValue(null);
export const getProviders = jest.fn().mockResolvedValue({});

export default {
  signIn,
  signOut,
  useSession,
  getSession,
  getProviders,
};
