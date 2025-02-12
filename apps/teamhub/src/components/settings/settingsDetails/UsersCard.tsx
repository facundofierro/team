'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, UserX } from 'lucide-react'
import type { User as DbUser } from '@teamhub/db'

type User = DbUser & {
  role: 'admin' | 'user'
  lastLogin?: string
}

export function UsersCard({
  users,
  onChange,
}: {
  users: DbUser[]
  onChange: (users: DbUser[]) => void
}) {
  const enrichedUsers = users.map((user) => ({
    ...user,
    role: (user.metadata as any)?.role || 'user',
    lastLogin: (user.metadata as any)?.lastLogin,
  }))

  return (
    <Card className="h-full bg-cardLight">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users</CardTitle>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </CardHeader>
      <CardContent>
        <Table className="bg-white rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrichedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    title="Remove user"
                  >
                    <UserX className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
