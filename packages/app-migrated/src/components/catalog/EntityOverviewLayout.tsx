import { Grid } from '@backstage/ui';
import {
  EntityContentLayoutBlueprint,
  EntityContentLayoutProps,
} from '@backstage/plugin-catalog-react/alpha';

const OverviewLayout = (props: EntityContentLayoutProps) => {
  const infoCards = props.cards.filter(c => c.type === 'info');
  const contentCards = props.cards.filter(c => c.type === 'content');
  const ungroupedCards = props.cards.filter(c => !c.type);

  return (
    <>
      <Grid.Root columns={{ initial: '1', md: '2' }} gap="3">
        <Grid.Item>
          <Grid.Root columns="1" gap="3">
            {infoCards.map((card, i) => (
              <Grid.Item key={i}>{card.element}</Grid.Item>
            ))}
          </Grid.Root>
        </Grid.Item>
        <Grid.Item>
          <Grid.Root columns="1" gap="3">
            {contentCards.map((card, i) => (
              <Grid.Item key={i}>{card.element}</Grid.Item>
            ))}
          </Grid.Root>
        </Grid.Item>
      </Grid.Root>
      {ungroupedCards.length > 0 && (
        <Grid.Root columns={{ initial: '1', md: '2' }} gap="3" mt="3">
          {ungroupedCards.map((card, i) => (
            <Grid.Item key={i}>{card.element}</Grid.Item>
          ))}
        </Grid.Root>
      )}
    </>
  );
};

export const entityOverviewLayoutExtension = EntityContentLayoutBlueprint.make({
  name: 'overview',
  params: {
    loader: async () => OverviewLayout,
  },
});
