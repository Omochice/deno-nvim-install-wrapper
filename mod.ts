import $ from "https://deno.land/x/dax@0.35.0/mod.ts";

const repository = new URL("https://github.com/neovim/neovim.git");

const defaultCloneOption = {
  parent: true,
  arg: "--depth=1",
} as const;

export function pullRepository(
  pullTo: string,
  option = defaultCloneOption,
) {
  const mergedOption = { ...defaultCloneOption, ...option };
  const pullPath = $.path(pullTo);
  if (pullPath.existsSync()) {
    return $`git pull`.cwd(pullTo);
  }
  const parent = pullPath.parent();
  if (parent?.existsSync() === false && mergedOption.parent) {
    Deno.mkdirSync(parent.toFileUrl(), { recursive: true });
  }

  return $`git clone ${repository.href} ${pullTo.toString()} ${mergedOption.arg}`;
}

type BuildType =
  | "Release"
  | "Debug"
  | "RelWithDebInfo";

export function buildNvim(
  projectDir: string,
  installTo: string,
  buildType: BuildType = "Release",
) {
  return $`make CMAKE_BUILD_TYPE=${buildType} CMAKE_INSTALL_PREFIX=${installTo}`
    .cwd(projectDir);
}

export function cleanProject(projectDir: string) {
  return $`make clean`.cwd(projectDir);
}
