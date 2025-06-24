import { Box, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import NavItem from "./NavItem"
import { NavLink } from "@utils/types"

const MenuBar = styled("div")(({ theme }) => ({
  "& ul": {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
}))

const NavGroup = ({ item, open }: { item: NavLink; open?: boolean }) => {
  const navCollapse = item.children?.map((menuItem: NavLink) => {
    switch (menuItem.type) {
      case "item":
        return <NavItem key={menuItem.label} item={menuItem} open={open} />
      default:
        return (
          <Typography
            variant="h6"
            color="error"
            align="center"
            key={menuItem.label}
          >
            Fix - Items
          </Typography>
        )
    }
  })

  return (
    <MenuBar className="menu-bar">
      <ul className="menu-bar__one crancy-dashboard-menu">
        {navCollapse}
      </ul>
    </MenuBar>
  )
}

export default NavGroup
