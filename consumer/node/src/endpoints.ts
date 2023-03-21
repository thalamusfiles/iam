const EndpointsDef = {
  url: null as string | null,
  port: null as string | null,
  base: null as string | null,
  timeout: 5000,
  //Modules Urls
  managementUrl: '/mgt',
  //AUTH Urls
  apiAuth: null as string | null,
  apiAuthLogin: '/login',
  //API MGT Urls
  apiMGT: null as string | null,
  apiMGTPerson: `/person`,
  apiMGTRole: `/role`,
  apiMGTPermission: `/permission`,
  apiMGTRegion: `/region`,
  apiMGTApplication: `/application`,
};

const configureEndpoint = (baseUrl: string = 'localhost', basePort: string = '3000') => {
  const baseEndpoint = `${baseUrl}:${basePort}`;
  const apiAuth = `${baseEndpoint}/auth`;
  const apiMGT = `${baseEndpoint}/apicrud`;

  EndpointsDef.url = baseUrl;
  EndpointsDef.port = basePort;
  EndpointsDef.base = baseEndpoint;
  EndpointsDef.apiAuth = apiAuth;
  EndpointsDef.apiMGT = apiMGT;
};

export { EndpointsDef, configureEndpoint };
