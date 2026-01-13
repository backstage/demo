# Code blocks

## Overview

This page shows some examples of code blocks in action and how you use them.

## Explanation

To be able to create code blocks you'll wrap your code example in three (3) backticks like this - ``` - the line before the code and the line after. On the first line of backticks you'll also include the code language, also know as a lexer, as this will tell TechDocs how to format it. the full list of supported lexers can be found in the Pygments [Available lexers documentation](https://pygments.org/docs/lexers/).

## Examples

### Typescript snippet

```typescript
const serviceEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        <Grid item md={6}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/docs" title="Docs">
      <EntityTechdocsContent />
    </EntityLayout.Route>
  </EntityLayout>
);
```

### Python snippet

```python
def getUsersInGroup(targetGroup, secure=False):

    if __debug__:
        print('targetGroup=[' + targetGroup + ']')
```

## Markdown

### Typescript Markdown

````markdown
    ```typescript
    const serviceEntityPage = (
    <EntityLayout>
        <EntityLayout.Route path="/" title="Overview">
        <Grid container spacing={3} alignItems="stretch">
            <Grid item md={6}>
            <EntityAboutCard variant="gridItem" />
            </Grid>
        </Grid>
        </EntityLayout.Route>
        <EntityLayout.Route path="/docs" title="Docs">
        <EntityTechdocsContent />
        </EntityLayout.Route>
    </EntityLayout>
    );
    ```
````

### Python Markdown

````markdown
    ```python
    def getUsersInGroup(targetGroup, secure=False):

        if __debug__:
            print('targetGroup=[' + targetGroup + ']')
    ```
````
