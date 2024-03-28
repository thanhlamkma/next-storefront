import credentials from "src/auth/providers/credentials";
import facebook from "src/auth/providers/facebook";
import google from "src/auth/providers/google";

export const authProviders = [credentials, facebook, google];
