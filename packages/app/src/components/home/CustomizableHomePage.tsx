import { Page, Content } from '@backstage/core-components';
import {
  HomePageCompanyLogo,
  TemplateBackstageLogo,
  HomePageStarredEntities,
  HomePageToolkit,
  CustomHomepageGrid,
  HomePageRandomJoke,
  HomePageTopVisited,
  HomePageRecentlyVisited,
} from '@backstage/plugin-home';
import { HomePageSearchBar } from '@backstage/plugin-search';
import { Grid } from '@material-ui/core';
import React from 'react';
import { tools, useLogoStyles } from './shared';

const defaultConfig = [
  {
    component: 'HomePageSearchBar',
    x: 0,
    y: 0,
    width: 24,
    height: 2,
  },
  {
    component: 'HomePageRecentlyVisited',
    x: 0,
    y: 1,
    width: 5,
    height: 4,
  },
  {
    component: 'HomePageTopVisited',
    x: 5,
    y: 1,
    width: 5,
    height: 4,
  },
  {
    component: 'HomePageStarredEntities',
    x: 0,
    y: 2,
    width: 6,
    height: 4,
  },
  {
    component: 'HomePageToolkit',
    x: 6,
    y: 6,
    width: 4,
    height: 4,
  },
];

export const CustomizableHomePage = () => {
  const { svg, path, container } = useLogoStyles();

  return (
    <Page themeId="home">
      <Content>
        <Grid container justifyContent="center">
          <HomePageCompanyLogo
            className={container}
            logo={<TemplateBackstageLogo classes={{ svg, path }} />}
          />
        </Grid>

        <CustomHomepageGrid config={defaultConfig}>
          <HomePageSearchBar />
          <HomePageRecentlyVisited />
          <HomePageTopVisited />
          <HomePageToolkit tools={tools} />
          <HomePageStarredEntities />
          <HomePageRandomJoke />
        </CustomHomepageGrid>
      </Content>
    </Page>
  );
};
