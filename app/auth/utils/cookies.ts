export const setCookie = (name: string, value: string, maxAge: number) => {
  const cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge / 1000}; SameSite=Lax; Secure`;
  document.cookie = cookie;
};

export const getCookie = (name: string): string | null => {
  const value = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1];

  return value ? decodeURIComponent(value) : null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;
};

export const hasAuthCookies = (): boolean => {
  return Boolean(
    getCookie('XSRF-TOKEN') && 
    document.cookie.includes('laravel_session')
  );
};