declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
    prefetch: (url: string) => void;
  };
  
  export function usePathname(): string;
  
  export function useSearchParams(): URLSearchParams;
  
  export interface RedirectType {
    push: 'push';
    replace: 'replace';
  }
  
  export function redirect(url: string, type?: RedirectType[keyof RedirectType]): never;
  
  export function notFound(): never;
}
