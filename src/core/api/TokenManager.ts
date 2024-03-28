class TokenManager<Types extends TokenTypes> {
  private tokens: Partial<Record<Types, string>> = {};

  getToken(type: Types) {
    return this.tokens[type] || "";
  }

  setToken(type: Types, token: string) {
    return (this.tokens[type] = token);
  }
}

export default new TokenManager();
