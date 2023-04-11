class EndpointsConfigure {
  url = null as string | null;
  port = null as string | null;
  base = null as string | null;
  timeout = 5000;
  // Modules Urls
  managementUrl = '/mgt';
  // AUTH Urls
  apiAuth = null as string | null;
  apiAuthLogin = '/login';
  apiAuthRegister = '/register';
  apiOauthApplicationInfo = 'application/info';
  apiOauthScopeInfo = 'scope/info';
  // IAM Urls
  apiIAM = null as string | null;
  apiIAMMe = '/me';
  apiIAMToken = '/token';
  apiIAMTokenActive = '/token/active';
  // API MGT Urls
  apiMGT = null as string | null;
  apiMGTUser = `/user`;
  apiMGTRole = `/role`;
  apiMGTPermission = `/permission`;
  apiMGTApplication = `/application`;

  configureEndpoint = (baseUrl: string = 'localhost', basePort: string = '3000') => {
    const baseEndpoint = `${baseUrl}:${basePort}`;
    const apiAuth = `${baseEndpoint}/auth`;
    const apiIAM = `${baseEndpoint}/iam`;
    const apiMGT = `${baseEndpoint}/mgt`;

    this.url = baseUrl;
    this.port = basePort;
    this.base = baseEndpoint;
    this.apiAuth = apiAuth;
    this.apiIAM = apiIAM;
    this.apiMGT = apiMGT;
  };
}

const Endpoints = new EndpointsConfigure();

export default Endpoints;
