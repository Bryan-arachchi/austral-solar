'use client';

import { useEffect, useState } from 'react';
import { User, usersApi, CreateUserDto, UpdateUserDto } from '@/lib/users-api';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Pencil, Trash2, Search, Plus } from 'lucide-react';
import RouteGuard from '@/components/RouteGuard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const USER_TYPES = {
  ADMIN: 'Admin',
  CLIENT: 'Client'
} as const;

type UserTypeValue = typeof USER_TYPES[keyof typeof USER_TYPES];

function UsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getUsers({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        sortBy: 'createdAt:desc'
      });
      setUsers(response.docs);
      setTotalPages(response.totalPages);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load users';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchQuery]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersApi.deleteUser(userId);
        toast.success('User deleted successfully');
        loadUsers();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
        toast.error(errorMessage);
      }
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      const userType = (formData.get('type') as UserTypeValue) || USER_TYPES.CLIENT;
      
      if (selectedUser) {
        const updateData: UpdateUserDto = {
          firstName: formData.get('firstName') as string,
          lastName: formData.get('lastName') as string,
          email: formData.get('email') as string,
          type: [userType],
          phoneNumber: formData.get('phoneNumber') as string,
          address: formData.get('address') as string,
          city: formData.get('city') as string,
          country: formData.get('country') as string,
        };
        await usersApi.updateUser(selectedUser._id, updateData);
        toast.success('User updated successfully');
      } else {
        const createData: CreateUserDto = {
          firstName: formData.get('firstName') as string,
          lastName: formData.get('lastName') as string,
          email: formData.get('email') as string,
          type: [userType],
          phoneNumber: formData.get('phoneNumber') as string,
          address: formData.get('address') as string,
          city: formData.get('city') as string,
          country: formData.get('country') as string,
        };
        await usersApi.createUser(createData);
        toast.success('User created successfully');
      }

      setIsDialogOpen(false);
      loadUsers();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save user';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedUser(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {selectedUser ? 'Edit User' : 'Add New User'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSave(new FormData(e.currentTarget));
                  }}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          name="firstName"
                          placeholder="First Name"
                          defaultValue={selectedUser?.firstName}
                          required
                        />
                        <Input
                          name="lastName"
                          placeholder="Last Name"
                          defaultValue={selectedUser?.lastName}
                          required
                        />
                      </div>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        defaultValue={selectedUser?.email}
                        required
                      />
                      <Select name="type" defaultValue={selectedUser?.type[0] || USER_TYPES.CLIENT}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={USER_TYPES.ADMIN}>{USER_TYPES.ADMIN}</SelectItem>
                          <SelectItem value={USER_TYPES.CLIENT}>{USER_TYPES.CLIENT}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        name="phoneNumber"
                        placeholder="Phone Number"
                        defaultValue={selectedUser?.phoneNumber}
                      />
                      <Input
                        name="address"
                        placeholder="Address"
                        defaultValue={selectedUser?.address}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          name="city"
                          placeholder="City"
                          defaultValue={selectedUser?.city}
                        />
                        <Input
                          name="country"
                          placeholder="Country"
                          defaultValue={selectedUser?.country || 'Sri Lanka'}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        {selectedUser ? 'Update' : 'Create'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.firstName}</TableCell>
                        <TableCell>{user.lastName}</TableCell>
                        <TableCell>{user.type.join(', ')}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phoneNumber}</TableCell>
                        <TableCell>{user.address}</TableCell>
                        <TableCell>{user.city}</TableCell>
                        <TableCell>{user.country}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(user)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(user._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  return (
    <RouteGuard>
      <UsersContent />
    </RouteGuard>
  );
}