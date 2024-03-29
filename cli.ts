import $ from "https://deno.land/x/dax@0.36.0/mod.ts";
import { buildNvim, cleanProject, pullRepository } from "./mod.ts";
import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";
import { join } from "https://deno.land/std@0.220.1/path/join.ts";
import { isAbsolute } from "https://deno.land/std@0.220.1/path/is_absolute.ts";
import { existsSync } from "https://deno.land/std@0.220.1/fs/exists.ts";

const defaultDeleteFiles = [
  ...[
    "gzip.vim",
    "health.vim",
    "matchit.vim",
    "matchparen.vim",
    "netrwPlugin.vim",
    "shada.vim",
    "spellfile.vim",
    "tarPlugin.vim",
    "tohtml.vim",
    "tutor.vim",
    "zipPlugin.vim",
  ].map((e) => join("share", "plugin", e)),
  join("/", "etc", "xdg", "nvim", "sysinit.vim"),
  join("/", "usr", "share", "nvim", "archlinux"),
];

if (import.meta.main) {
  const { options } = await new Command()
    .name(import.meta.url)
    .option("--pull-to <pullTo:string>", "", { required: true })
    .option("--install-to <installTo:string>", "", { required: true })
    .option("--delete <deletes:string[]>", "", { default: defaultDeleteFiles })
    .option("--force", "force install (reclone if exists)", { default: false })
    .option("--verbose", "show raw output", { default: false })
    .parse(Deno.args);

  if (options.force && existsSync(options.pullTo)) {
    Deno.removeSync(options.pullTo, { recursive: true });
  }

  await $.progress("sync with neovim/neovim")
    .with(
      async () => {
        const pull = pullRepository(options.pullTo);
        await (options.verbose ? pull : pull.quiet());
      },
    );
  await $.progress("build nvim")
    .with(
      async () => {
        const clean = cleanProject(options.pullTo);
        await (options.verbose ? clean : clean.quiet());
        const build = buildNvim(options.pullTo, options.installTo);
        await (options.verbose ? build : build.quiet());
      },
    );
  await $.progress("delete unneeded plugins")
    .with(
      async () => {
        await Promise.all(options.delete.map((path) => {
          const filePath = isAbsolute(path)
            ? path
            : join(options.installTo, path);
          try {
            Deno.removeSync(filePath);
          } catch (e: unknown) {
            if (options.verbose) {
              console.error(e);
            }
          }
        }));
      },
    );
}
