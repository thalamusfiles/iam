module.exports = {
  siteMetadata: {
    siteTitle: `IAM`,
    defaultTitle: `IAM Doc`,
    siteTitleShort: `IAM  Doc`,
    siteDescription: `Ferramenta SSO para controle de acesso centralizado`,
    siteUrl: `https://iam.piemontez.digital`,
    siteAuthor: `@piemontez`,
    siteImage: `/banner.png`,
    siteLanguage: `pt`,
    themeColor: `#8257E6`,
    basePath: `/`,
  },
  plugins: [
    {
      resolve: `@rocketseat/gatsby-theme-docs`,
      options: {
        configPath: `src/config`,
        docsPath: `src/docs`,
        yamlFilesPath: `src/yamlFiles`,
        repositoryUrl: `https://github.com/piemontez/iam`,
        baseDir: `examples/gatsby-theme-docs`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `IAM Doc`,
        short_name: `IAM Doc`,
        start_url: `/`,
        background_color: `#ffffff`,
        display: `standalone`,
        icon: `static/favicon.png`,
      },
    },
    `gatsby-plugin-sitemap`,
     {
       resolve: `gatsby-plugin-google-analytics`,
       options: {
         trackingId: `UA-131606801-1`,
       },
     },
    `gatsby-plugin-remove-trailing-slashes`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://iam.piemontez.digital`,
      },
    },
    `gatsby-plugin-offline`,
  ],
};
