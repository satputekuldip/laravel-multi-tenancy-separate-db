import { PasswordInput } from '@/components/password-input';
import { RolesMultiSelect } from '@/components/roles-multi-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles?: Array<{ id: number; name: string }>;
}

interface Props {
    user: User;
    roles: Role[];
    canChangeRoleAndEmail?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '#',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

export default function UsersEdit({
    user,
    roles,
    canChangeRoleAndEmail = true,
}: Props) {
    const userRoleNames = user.roles?.map((r) => r.name) || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />
            <div className="mx-auto flex h-full w-1/2 min-w-0 flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Edit User</h1>

                <div className="rounded-lg border border-sidebar-border bg-sidebar p-6">
                    <Form
                        method="patch"
                        action={`/admin/users/${user.id}`}
                        className="space-y-4"
                    >
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={user.name}
                                required
                                className="mt-1"
                            />
                        </div>

                        {canChangeRoleAndEmail ? (
                            <>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        defaultValue={user.email}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                                <RolesMultiSelect
                                    roles={roles}
                                    defaultValue={userRoleNames}
                                    label="Roles"
                                />
                            </>
                        ) : (
                            <>
                                <div>
                                    <Label>Email</Label>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                                <div>
                                    <Label>Roles</Label>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {userRoleNames.length
                                            ? userRoleNames.join(', ')
                                            : 'None'}
                                    </p>
                                </div>
                            </>
                        )}

                        <div>
                            <Label htmlFor="password">
                                Password (leave blank to keep current)
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password_confirmation">
                                Confirm Password
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                className="mt-1"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit">Update User</Button>
                            <Button type="button" variant="outline" asChild>
                                <a href="/admin/users">Cancel</a>
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
