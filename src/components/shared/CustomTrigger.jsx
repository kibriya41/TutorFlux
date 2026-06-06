import { authClient } from "@/lib/auth-client";
import { ArrowRightFromSquare, Person } from "@gravity-ui/icons";
import { Avatar, Dropdown, Label } from "@heroui/react";
import { useRouter } from "next/navigation";

export function CustomTrigger() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <Dropdown>
      <Dropdown.Trigger className="rounded-full">
        <Avatar>
          <Avatar.Image src={user?.image} />
          <Avatar.Fallback delayMs={600}>{user?.name?.charAt(0)}</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <Avatar.Image alt={user?.name} src={user?.image} />
              <Avatar.Fallback delayMs={600}>{user?.name?.charAt(0)}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col gap-0">
              <p className="text-sm leading-5 font-medium">{user?.name}</p>
              <p className="text-xs leading-none text-muted">{user?.email}</p>
            </div>
          </div>
        </div>
        <Dropdown.Menu>
          <Dropdown.Item
            id="profile"
            textValue="Profile"
            onPress={() => router.push("/profile")}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <Label>Profile</Label>
              <Person className="size-3.5 text-muted" />
            </div>
          </Dropdown.Item>
          <Dropdown.Item id="logout" textValue="Logout" variant="danger">
            <button onClick={handleSignOut} className="flex w-full items-center justify-between gap-2">
              <Label>Log Out</Label>
              <ArrowRightFromSquare className="size-3.5 text-danger" />
            </button>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}