import { useSession } from "next-auth/react";
import { useTheme } from "@mui/material/styles";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Menu, MenuItem } from "@menu/vertical-menu";
import { useSettings } from "@core/hooks/useSettings";
import useVerticalNav from "@menu/hooks/useVerticalNav";
import StyledVerticalNavExpandIcon from "@menu/styles/vertical/StyledVerticalNavExpandIcon";
import menuItemStyles from "@core/styles/vertical/menuItemStyles";
import menuSectionStyles from "@core/styles/vertical/menuSectionStyles";
import { VerticalMenuContextProps } from "@/@menu/components/vertical-menu/Menu";
import { checkPermission } from "@/utils/permissionCheckFunction";

type RenderExpandIconProps = {
  open?: boolean;
  transitionDuration?: VerticalMenuContextProps["transitionDuration"];
};

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void;
};

const RenderExpandIcon = ({
  open,
  transitionDuration,
}: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon
    open={open}
    transitionDuration={transitionDuration}
  >
    <i className="tabler-chevron-right" />
  </StyledVerticalNavExpandIcon>
);

const VerticalMenu = ({ scrollMenu }: Props) => {
  const theme = useTheme();
  const verticalNavOptions = useVerticalNav();
  const { settings } = useSettings();
  const { isBreakpointReached } = useVerticalNav();
  const { data: session } = useSession();

  const ScrollWrapper = isBreakpointReached ? "div" : PerfectScrollbar;

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
          className: "bs-full overflow-y-auto overflow-x-hidden",
          onScroll: (container) => scrollMenu(container, false),
        }
        : {
          options: { wheelPropagation: false, suppressScrollX: true },
          onScrollY: (container) => scrollMenu(container, true),
        })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => (
          <RenderExpandIcon
            open={open}
            transitionDuration={verticalNavOptions.transitionDuration}
          />
        )}
        renderExpandedMenuItemIcon={{
          icon: <i className="tabler-circle text-xs" />,
        }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
       
          <MenuItem href="/lead" icon={<i className="tabler-users-group" />}>
            Lead
          </MenuItem>
    
      </Menu>
    </ScrollWrapper>
  );
};

export default VerticalMenu;
