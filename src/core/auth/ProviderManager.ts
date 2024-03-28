import AuthProvider from "src/core/auth/AuthProvider";

export default class AuthProviderManager {
  private providers: AuthProvider[] = [];

  push(provider: AuthProvider) {
    this.providers.push(provider);
  }

  getEnabledProviders() {
    return this.providers.filter((provider) => provider.enabled);
  }

  getEnabledNextAuthProvider() {
    return this.getEnabledProviders().map(
      (provider) => provider.nextAuthProvider
    );
  }
}
