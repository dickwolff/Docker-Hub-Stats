"use client";

import Link from "next/link";
import { ModeToggle } from "./togglemode";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu";
import { Button } from "./ui/button";
import { Github } from "lucide-react";

export function Menu() {

    return (
        <div className="flex flex-1 items-center justify-end">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem className="mr-2 hidden sm:block">
                        <span className="text-sm">Created by <Link href="https://github.com/dickwolff/" target="_blank">Dick Wolff</Link></span>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="https://github.com/dickwolff/Docker-Pull-Stats" target="_blank">
                            <Button variant="outline" size="icon">
                                <Github width={16} height={16} />
                            </Button>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <ModeToggle />
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}
