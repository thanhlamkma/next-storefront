import { Provider } from "next-auth/providers";

export default abstract class AuthProvider {
  enabled: boolean = true;
  nextAuthProvider!: Provider;
}
