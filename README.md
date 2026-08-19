# dsh-workspace-pin

DSH Web 插件「工作目录自动置顶」：当前会话属于哪个工作区，该工作区就自动置顶。

## 功能

- **排序菜单新增「会话优先」**：排序方式中选中「会话优先」后，当前会话所属工作区自动排到列表首位。
- **工作区菜单新增「置顶 / 取消置顶」**：每个工作区 `…` 菜单的第一项；置顶后该工作区进入列表顶部的置顶区。
- **置顶区 + 分隔线**：置顶工作区固定在侧栏最上方（独立「置顶」分组），与下方普通工作区（含当前工作区）用一条分隔线隔开。
- **置顶区内独立手动排序**：置顶区内可直接拖拽排序，顺序独立于宿主工作区顺序（仅本地持久化）；跨区拖拽会被拒绝。

官方工作区浏览器的全部能力（搜索、拖拽、重命名、删除、归档、单列表等）原样保留。

## 安装

本插件**接管官方 `@deepseek-ai/dsh-client-ui-workspace`**（两处注册不能并存），需要两步：

1. **注入插件包**（任选其一）：
   - 开发态（免重启）：`dev_inject_plugin {"dir": "E:/dsh_custom/dsh-workspace-pin"}`，重启后由注入器自动恢复；
   - 正式装配：`dsh plugin --profile web add <本目录>`。
2. **禁用官方 ui-workspace**：在 `~/.dsh/profiles/web/cordis.patch.yml` 追加：

   ```yaml
   - id: ui-workspace
     disabled: true
   ```

   然后刷新浏览器页面。

> 注入器（dsh-super-injector）的 client 骨架白名单需要包含 `sidebar.workspaces`（本项目开发时已加入 `KNOWN_SLOTS`，请确认你的注入器版本包含该条目，否则注入会被校验拦截）。

## 卸载 / 恢复官方

1. `dev_uninject_plugin {"match": "dsh-workspace-pin"}`；
2. 删除 `cordis.patch.yml` 中的 `ui-workspace disabled` 条目；
3. 重启 dsh web（或刷新页面后按官方装配恢复）。

## 文件说明

| 文件 | 说明 |
| --- | --- |
| `package.json` | 插件元数据；`dsh.client` 声明浏览器入口 |
| `lib/index.js` | host 侧入口（纯 UI 插件，空 apply） |
| `lib/client.js` | 浏览器端 bundle：以官方 `@deepseek-ai/dsh-client-ui-workspace`（rc.7）为基底 fork 改造，模块 id 改为 `dsh-workspace-pin`，增加置顶状态/排序/菜单/置顶区渲染，并接管官方注册（含 `sidebar.workspaces.directoryFlow` 子槽声明与 `conversation.hero.workspace` 注册） |

## 实现要点

- 官方 ui-workspace 是单座 Slot `sidebar.workspaces`，排序菜单/工作区菜单/渲染全部闭包在官方 bundle 内，无加性 Slot 可注入 —— 因此采用「整体接管」：profile 层禁用官方 entry，本插件完整注册。
- 置顶状态持久化于浏览器 `localStorage`（key `dsh.workspace.pin.view.v1`），首次运行自动迁移官方 v5 视图偏好。
- 客户端 store 扩展：`pinnedWorkspaceIds`（有序置顶列表）+ `togglePin` / `setPinnedOrder` actions。

## License

MIT
