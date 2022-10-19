module.exports = {
  siteMetadata: {
    siteTitle: `IAM`,
    defaultTitle: `IAM Thalamus Doc`,
    siteTitleShort: `IAM  Doc`,
    siteDescription: `Ferramenta SSO para controle de acesso centralizado`,
    siteUrl: `https://iam.thalamus.digital`,
    siteAuthor: `@thalamus`,
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
        repositoryUrl: `https://github.com/thalamusfiles/iam`,
        baseDir: `examples/gatsby-theme-docs`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `IAM Thalamus Doc`,
        short_name: `IAM Thalamus Doc`,
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
        siteUrl: `https://iam.thalamus.digital`,
      },
    },
    `gatsby-plugin-offline`,
  ],
};
