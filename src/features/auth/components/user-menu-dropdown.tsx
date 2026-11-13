"use client";

import { LogOut, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/features/auth/actions";

export function UserMenuDropdown({
  nome,
  email,
  avatarUrl,
}: {
  nome: string | null;
  email: string | null;
  avatarUrl: string | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Abrir menu da conta"
        className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {/* Decorativo: o nome acessível vem do aria-label do botão. */}
        <Avatar className="size-9" aria-hidden="true">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt="" referrerPolicy="no-referrer" /> : null}
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <UserRound className="size-5" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col">
            <span className="truncate font-medium text-foreground">{nome ?? "Sua conta"}</span>
            {email ? <span className="truncate text-xs">{email}</span> : null}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void signOut()}>
          <LogOut aria-hidden="true" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
