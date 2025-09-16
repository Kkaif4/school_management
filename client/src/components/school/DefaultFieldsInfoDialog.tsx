import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DefaultFieldsInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DefaultFieldsInfoDialog: React.FC<
  DefaultFieldsInfoDialogProps
> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Default Fields Already Included</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <p>
            The following fields are already part of the student information:
          </p>
          <ul className="list-disc pl-6">
            <li>Student ID</li>
            <li>Registration Number</li>
            <li>First, Middle and Last Name</li>
            <li>Date of Birth</li>
            <li>Gender</li>
            <li> Division</li>
            <li>Roll Number</li>
            <li>Grade (class)</li>
          </ul>
          <p className="mt-2">You can add custom fields if needed.</p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
