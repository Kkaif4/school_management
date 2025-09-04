import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { schoolAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { createSchoolSchema } from '@/types/school';

export type CreateSchoolFormData = z.infer<typeof createSchoolSchema> & {
  _id?: string;
};

interface CreateSchoolModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchoolCreated: () => void;
  adminId: string | undefined;
  schoolToEdit?: CreateSchoolFormData;
  isEditing?: boolean;
}

export const CreateSchoolModal: React.FC<CreateSchoolModalProps> = ({
  open,
  onOpenChange,
  onSchoolCreated,
  adminId,
  schoolToEdit,
  isEditing = false,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateSchoolFormData>({
    resolver: zodResolver(createSchoolSchema),
    defaultValues: {
      name: '',
      principalName: '',
      address: '',
      contactNumber: '',
      isActive: true,
      adminId: adminId || '',
    },
  });

  // ✅ Reset form values whenever modal opens or schoolToEdit changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: schoolToEdit?.name || '',
        principalName: schoolToEdit?.principalName || '',
        address: schoolToEdit?.address || '',
        contactNumber: schoolToEdit?.contactNumber || '',
        isActive: schoolToEdit?.isActive ?? true,
        adminId: adminId || '',
      });

      if (schoolToEdit) {
        console.log('Editing school:', schoolToEdit.name);
      }
    }
  }, [open, schoolToEdit, adminId, form]);

  const onSubmit = async (data: CreateSchoolFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && schoolToEdit?._id) {
        await schoolAPI.updateSchool(schoolToEdit._id, data);
        toast({
          title: 'Success',
          description: 'School updated successfully',
        });
      } else {
        await schoolAPI.createSchool(data);
        toast({
          title: 'Success',
          description: 'School created successfully',
        });
      }
      onSchoolCreated();
      handleClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit School' : 'Create New School'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modify the details of the school.'
              : 'Add a new school under your administration.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter school name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="principalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Principal Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter principal name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Is Active</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="gradient" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditing
                    ? 'Updating...'
                    : 'Creating...'
                  : isEditing
                  ? 'Update School'
                  : 'Create School'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
