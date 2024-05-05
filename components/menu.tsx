"use client";

import { ModeToggle } from "./togglemode";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu";

export function Menu() {

    return (
        <div className="flex flex-1 items-center justify-end">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <ModeToggle />
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}
