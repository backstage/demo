import { Grid } from '@material-ui/core';
import {
  EntityContentLayoutBlueprint,
  EntityContentLayoutProps,
} from '@backstage/plugin-catalog-react/alpha';

const OverviewLayout = (props: EntityContentLayoutProps) => {
  const infoCards = props.cards.filter(c => c.type === 'info');
  const contentCards = props.cards.filter(c => c.type === 'content');
  const ungroupedCards = props.cards.filter(c => !c.type);

  return (
    <Grid container spacing={3} alignItems="stretch">
      <Grid item md={6} xs={12}>
        <Grid container spacing={3}>
          {infoCards.map((card, i) => (
            <Grid key={i} item xs={12}>
              {card.element}
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item md={6} xs={12}>
        <Grid container spacing={3}>
          {contentCards.map((card, i) => (
            <Grid key={i} item xs={12}>
              {card.element}
            </Grid>
          ))}
        </Grid>
      </Grid>
      {ungroupedCards.length > 0 && (
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {ungroupedCards.map((card, i) => (
              <Grid key={i} item md={6} xs={12}>
                {card.element}
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export const entityOverviewLayoutExtension = EntityContentLayoutBlueprint.make({
  name: 'overview',
  params: {
    loader: async () => OverviewLayout,
  },
});
