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
import { createSchoolSchema, customField } from '@/types/school';
import { DefaultFieldsInfoDialog } from '@/components/school/DefaultFieldsInfoDialog';
import { Info, X } from 'lucide-react';
import { RequiredLabel } from '../ui/RequiredLabel';
import { toast as sonnerToast } from '../ui/sonner';
import { toast } from '@/hooks/use-toast';
import { handleApiError } from '@/utils/api-error';

import { countryCodesList } from '@/assets/countryCodes';

export type CreateSchoolFormData = z.infer<typeof createSchoolSchema> & {
  _id?: string;
  studentFields?: customField[];
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enableCustomFields, setEnableCustomFields] = useState(false);
  const [studentFields, setCustomFields] = useState<customField[]>([]);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<
    (typeof countryCodesList)[number]['code']
  >(countryCodesList[0].code);

  const form = useForm<CreateSchoolFormData>({
    resolver: zodResolver(createSchoolSchema),
    defaultValues: {
      name: '',
      principalName: '',
      address: '',
      contactNumber: '',
      isActive: true,
      adminId: adminId || '',
      studentFields: [],
    },
  });

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
      if (!isEditing) {
        setCustomFields(schoolToEdit?.studentFields || []);
      }

      // Set country code from existing phone number if it exists
      if (schoolToEdit?.contactNumber) {
        const phoneNumber = schoolToEdit.contactNumber;
        const countryCode = countryCodesList.find((cc) =>
          phoneNumber.startsWith(cc.code)
        );
        if (countryCode) {
          setSelectedCountryCode(countryCode.code);
        }
      }
    }
  }, [open, schoolToEdit, adminId, isEditing, form]);

  const handleAddCustomField = () => {
    setCustomFields([
      ...studentFields,
      { name: '', type: 'string', required: false },
    ]);
  };

  const handleRemoveCustomField = (index: number) => {
    setCustomFields(studentFields.filter((_, i) => i !== index));
  };

  const handleFieldChange = <K extends keyof customField>(
    index: number,
    key: K,
    value: customField[K]
  ) => {
    setCustomFields((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const cleanData = (data: CreateSchoolFormData) => {
    const cleaned = { ...data };
    for (const key in cleaned) {
      if (cleaned[key] === '') {
        delete cleaned[key];
      }
    }
    return cleaned;
  };

  const onSubmit = async (data: CreateSchoolFormData) => {
    setIsSubmitting(true);
    try {
      const cleanedData = cleanData(data);
      const payload = {
        ...cleanedData,
        ...(isEditing
          ? {}
          : { studentFields: enableCustomFields ? studentFields : [] }),
      };

      let response: { data: any };
      if (isEditing && schoolToEdit?._id) {
        response = await schoolAPI.updateSchool(schoolToEdit._id, payload);
      } else {
        response = await schoolAPI.createSchool(payload);
      }
      sonnerToast(response.data.message);
      onSchoolCreated();
      handleClose();
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        `Failed to ${isEditing ? 'update' : 'create'} school`
      );
      sonnerToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setCustomFields([]);
    setEnableCustomFields(false);
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
                  <RequiredLabel>School Name</RequiredLabel>
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
                  <RequiredLabel>Principal Name</RequiredLabel>
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
                  <FormLabel>Address</FormLabel>
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
                  <FormLabel>Contact Number</FormLabel>
                  <div className="flex gap-2">
                    <select
                      className="w-28 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={selectedCountryCode}
                      onChange={(e) =>
                        setSelectedCountryCode(
                          e.target.value as typeof selectedCountryCode
                        )
                      }>
                      {countryCodesList.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.code} {country.country}
                        </option>
                      ))}
                    </select>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter phone number"
                        {...field}
                        value={
                          field.value
                            ? field.value.replace(selectedCountryCode, '')
                            : ''
                        }
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          field.onChange(selectedCountryCode + value);
                        }}
                        className="flex-1"
                      />
                    </FormControl>
                  </div>
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

            {!isEditing && (
              <>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={enableCustomFields}
                    onCheckedChange={setEnableCustomFields}
                  />
                  <span>Add Custom Fields for Students?</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInfoDialog(true)}>
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
                <DefaultFieldsInfoDialog
                  open={showInfoDialog}
                  onOpenChange={setShowInfoDialog}
                />

                {enableCustomFields && (
                  // Added max-h-72 (you can adjust this value) and overflow-y-auto
                  <div className="space-y-4 border rounded-md p-4 max-h-72 overflow-y-auto">
                    <p className="text-xs text-gray-500">
                      Field names Must be unique and should not start with a
                      number or contain spaces and special characters.
                    </p>
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Custom Fields</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddCustomField}>
                        + Add Field
                      </Button>
                    </div>
                    {studentFields.map((field, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center w-full">
                        {/* Field Name */}
                        <Input
                          className="md:col-span-4 w-full"
                          placeholder="Field Name"
                          value={field.name}
                          onChange={(e) => {
                            const value = e.target.value;
                            const validPattern = /^[A-Za-z_][A-Za-z0-9_]*$/;

                            if (value === '' || validPattern.test(value)) {
                              handleFieldChange(index, 'name', value);
                            } else {
                              toast({
                                title: 'Invalid Input',
                                description:
                                  'Field names must start with a letter or underscore, and may only contain letters, numbers, or underscores (no spaces).',
                                variant: 'destructive',
                              });
                            }
                          }}
                        />

                        {/* Field Type */}
                        <select
                          className="md:col-span-3 border rounded-md px-2 py-2 w-full bg-white"
                          value={field.type}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              'type',
                              e.target.value as customField['type']
                            )
                          }>
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                          <option value="boolean">Boolean</option>
                        </select>

                        {/* Required Checkbox */}
                        <div className="md:col-span-3 flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                'required',
                                e.target.checked
                              )
                            }
                            className="h-4 w-4"
                          />
                          <span className="text-sm">Required</span>
                        </div>

                        <div className="md:col-span-2 flex justify-end">
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveCustomField(index)}>
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* === Footer === */}
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
