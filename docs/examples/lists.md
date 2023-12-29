# Lists

## Overview

This page shows how you can use lists in TechDocs.

## Explanation

The [`techdocs-core`](https://github.com/backstage/mkdocs-techdocs-core) MkDocs plugin includes the [`mdx_truly_sane_lists`](https://github.com/radude/mdx_truly_sane_lists) plugin which has a default of 2, this means that each nested list needs to be 2 spaces under its parent.

## Example

Here is an example:

1. A list item
2. Another list item
  1. The first sub item
  2. Another sub item
    1. Oh wait, we have a deeply nested item here
    2. Why not another, you might need it!
  3. A third and final sub item
3. The last item in this list

## Markdown

Here is the Markdown:

```markdown
1. A list item
2. Another list item
  1. The first sub item
  2. Another sub item
    1. Oh wait, we have a deeply nested item here
    2. Why not another, you might need it!
  3. A third and final sub item
3. The last item in this list
```
