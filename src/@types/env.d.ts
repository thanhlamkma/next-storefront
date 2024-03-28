declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        NEXT_PUBLIC_APP_NAME: string;

        NEXT_PUBLIC_API_URL: string;
        NEXT_PUBLIC_API_AUTH_URL: string;
        NEXT_PUBLIC_API_PRODUCT_URL: string;
        NEXT_PUBLIC_API_ORDER_URL: string;
        NEXT_PUBLIC_API_CUSTOMER_URL: string;
        NEXT_PUBLIC_API_CDN_URL: string;
        NEXT_PUBLIC_DEFAULT_PAGE_SIZE: number;

        // Next auth
        NEXTAUTH_URL: string;

        // Credentials auth
        CREDENTIALS_GRANT_TYPE: string;
        CREDENTIALS_SCOPE: string;
        CREDENTIALS_CLIENT_ID: string;
        CREDENTIALS_CLIENT_SECRET: string;

        // Facebook auth
        NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH: boolean;
        NEXT_PUBLIC_FACEBOOK_CLIENT_ID: string;

        // Googfle auth
        NEXT_PUBLIC_ENABLE_GOOGLE_AUTH: boolean;
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
      }
    }
  }
}
