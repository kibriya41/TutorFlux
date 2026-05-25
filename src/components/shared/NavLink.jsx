"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const NavLink = ({href, children}) => {
const pathName = usePathname();

const isActive = href === pathName;

    return <Link href={href} className={`${isActive && "border-b-2 border-blue-700 "}`}>{children}</Link>
};

export default NavLink;