# Personal website

This site uses the [Persona theme](themes/persona/) with a shared Markdown, math,
and citation build pipeline. Install Zola 0.23+, Python 3.11+, and Pandoc.

```bash
make serve                              # Preview and reload on source changes
make build                              # Build public/
make check ZOLA_ARGS=--skip-external-links
```

Pass preview options with `make serve ZOLA_ARGS="--port 1112"`. The existing
`ZOLA_PORT` environment variable is also supported by `serve.sh`.

Edit ordinary `.md` files in `content/`. On pages with `[extra.tex]`, write
`$...$` and `$$...$$` using normal LaTeX, including `\\` and `\{...\}`; manual
HTML wrappers are unnecessary. Citation posts can use `[@key]` with a colocated
`references.bib` or `[extra].bibliography`.

The pipeline prepares a separate copy before running Zola. Source Markdown
remains editable and no generated companion `.md` is stored in `content/`.
Use the commands above rather than bare Zola commands, which bypass this step.
The deployment workflow runs the same preprocessing.

See [Persona's post guide](themes/persona/docs/posts.md) for authoring details.
