import { Outlet } from "react-router-dom"
import { NavBarMenu } from "./NavBar.menu"


export function NavBar() {
    return (
        <>
        <NavBarMenu/>
        <Outlet />
        </>
    )
}