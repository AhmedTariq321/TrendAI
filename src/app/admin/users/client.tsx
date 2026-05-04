"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Ban, Trash2, RefreshCw, Shield, Users } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

type UserWithCount = {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "BANNED";
  createdAt: Date;
  lastActiveAt: Date;
  _count: { generations: number; savedItems: number };
};

export function UsersClient({ initialUsers }: { initialUsers: UserWithCount[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const action = async (userId: string, act: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: act }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const updated = await res.json();

      if (act === "delete") {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        toast.success("User deleted");
      } else {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updated } : u)));
        toast.success(`Action "${act}" completed`);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground mt-1">{users.length} total users</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline"><Users className="h-3 w-3 mr-1" />{users.filter(u => u.status === "ACTIVE").length} active</Badge>
          <Badge variant="destructive" className="opacity-70">{users.filter(u => u.status === "BANNED").length} banned</Badge>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Generations</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.imageUrl ?? ""} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {user.name?.charAt(0) ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{user.name ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="text-xs">
                      {user.role === "ADMIN" && <Shield className="h-3 w-3 mr-1" />}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "ACTIVE" ? "outline" : "destructive"}
                      className={`text-xs ${user.status === "ACTIVE" ? "border-green-500/30 text-green-600" : ""}`}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{user._count.generations}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(user.lastActiveAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="h-8 w-8 p-0" />}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => action(user.id, user.status === "ACTIVE" ? "ban" : "unban")}>
                          <Ban className="h-4 w-4 mr-2" />
                          {user.status === "ACTIVE" ? "Ban User" : "Unban User"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => action(user.id, "make_admin")}>
                          <Shield className="h-4 w-4 mr-2" />
                          {user.role === "ADMIN" ? "Remove Admin" : "Make Admin"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => action(user.id, "reset_usage")}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reset Usage
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            if (confirm(`Delete ${user.email}? This cannot be undone.`)) {
                              action(user.id, "delete");
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
