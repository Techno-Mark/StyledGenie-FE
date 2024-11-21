type PermissionAction = "view" | "create" | "edit" | "delete";

export const checkPermission = (
  moduleName: string,
  action: PermissionAction,
  permissions: Array<{
    moduleName: string;
    view: boolean;
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
  }>
) => {
  return permissions.some((perm) => {
    if (perm.moduleName !== moduleName) return false;
    // Check if the action is a valid key in perm
    return action in perm && perm[action] === true;
  });
};
