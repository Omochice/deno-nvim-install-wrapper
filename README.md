# deno-nvim-install-wrapper

This is tool for install nvim for me.

## Required permissins

- `--allow-env`
    - For reading some environment variable
        - `XDG_DATA_HOME`
        - `HOME`
- `--allow-write`
    - For `Deno.mkdir`
- `--allow-read`
    - For
        - `Deno.stat`
        - `Deno.lstatSync`
- `--allow-run`
    - For `Deno.Command().spawn`
        - using in dax

## Installation

```shell
$ deno install --allow-env --allow-write --allow-read --allow-run https://pax.deno.dev/Omochice/deno-nvim-install-wrapper/cli.ts
```

## Using

This has some options:

- `--pull-to`
    - Directory to pull neovim/neovim>
- `--install-to`
    - Directory to install `nvim`.
- `--delete`
    - List of detete plugins after installing>
- `--verbose`
    - Show raw process output like `git`, `make`.

