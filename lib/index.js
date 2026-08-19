// dsh-workspace-pin host half.
//
// Pure UI plugin: the entire feature (「会话优先」ordering, workspace
// pin/unpin menu, pinned section with its own manual drag order) lives in
// the browser half shipped via exports["./client"] and discovered through
// the package.json dsh.client declaration. The host apply exists only so
// the plugin appears in the cordis Loader (load and lifecycle follow the
// host; browser registration happens client-side).
function apply() {}
export { apply };
