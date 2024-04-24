import {
  CatalogIcon,
  Content,
  DocsIcon,
  Header,
  Page,
} from '@backstage/core-components';
import { CatalogSearchResultListItem } from '@backstage/plugin-catalog';
import { SearchType } from '@backstage/plugin-search';
import {
  DefaultResultListItem,
  SearchBar,
  SearchFilter,
  SearchResult,
  SearchResultPager,
  useSearch,
} from '@backstage/plugin-search-react';
import { TechDocsSearchResultListItem } from '@backstage/plugin-techdocs';
import { Grid, List, makeStyles, Paper, Theme } from '@material-ui/core';
import React from 'react';
import { ToolSearchResultListItem } from '@backstage-community/plugin-explore';
import { useApi } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  CATALOG_FILTER_EXISTS,
} from '@backstage/plugin-catalog-react';
import BuildIcon from '@material-ui/icons/Build';

const useStyles = makeStyles((theme: Theme) => ({
  bar: {
    padding: theme.spacing(1, 0),
  },
  filters: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  filter: {
    '& + &': {
      marginTop: theme.spacing(2.5),
    },
  },
}));

const SearchPage = () => {
  const classes = useStyles();
  const { types } = useSearch();
  const catalogApi = useApi(catalogApiRef);
  return (
    <Page themeId="home">
      <Header title="Search" />
      <Content>
        <Grid container direction="row">
          <Grid item xs={12}>
            <SearchBar />
          </Grid>
          <Grid item xs={3}>
            <SearchType.Accordion
              name="Result Type"
              defaultValue=""
              types={[
                {
                  value: 'software-catalog',
                  name: 'Software Catalog',
                  icon: <CatalogIcon />,
                },
                {
                  value: 'techdocs',
                  name: 'Documentation',
                  icon: <DocsIcon />,
                },
                {
                  value: 'tools',
                  name: 'Tools',
                  icon: <BuildIcon />,
                },
              ]}
            />
            <Paper className={classes.filters}>
              {types.includes('techdocs') && (
                <SearchFilter.Select
                  className={classes.filter}
                  label="Entity"
                  name="name"
                  values={async () => {
                    // Return a list of entities which are documented.
                    const { items } = await catalogApi.getEntities({
                      fields: ['metadata.name'],
                      filter: {
                        'metadata.annotations.backstage.io/techdocs-ref':
                          CATALOG_FILTER_EXISTS,
                      },
                    });

                    const names = items.map(entity => entity.metadata.name);
                    names.sort();
                    return names;
                  }}
                />
              )}
              <SearchFilter.Select
                className={classes.filter}
                label="Kind"
                name="kind"
                values={['Component', 'Template']}
              />
              <SearchFilter.Checkbox
                className={classes.filter}
                label="Lifecycle"
                name="lifecycle"
                values={['experimental', 'production']}
              />
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <SearchResult>
              {({ results }) => (
                <List>
                  {results.map(({ type, document, highlight, rank }) => {
                    switch (type) {
                      case 'software-catalog':
                        return (
                          <CatalogSearchResultListItem
                            key={document.location}
                            result={document}
                            highlight={highlight}
                            rank={rank}
                          />
                        );
                      case 'techdocs':
                        return (
                          <TechDocsSearchResultListItem
                            key={document.location}
                            result={document}
                            highlight={highlight}
                            rank={rank}
                          />
                        );
                      case 'tools':
                        return (
                          <ToolSearchResultListItem
                            key={document.location}
                            result={document}
                            highlight={highlight}
                            rank={rank}
                          />
                        );
                      default:
                        return (
                          <DefaultResultListItem
                            key={document.location}
                            result={document}
                            highlight={highlight}
                            rank={rank}
                          />
                        );
                    }
                  })}
                </List>
              )}
            </SearchResult>
            <SearchResultPager />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export const searchPage = <SearchPage />;
