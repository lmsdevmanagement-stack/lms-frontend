'use client';

import { Modal } from '@/app/components/ui/modal';
import type React from 'react';

interface AuthModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function AuthModal({ open, title, description, onClose, children }: AuthModalProps) {
  return (
    <Modal open={open} title={title} description={description} onClose={onClose}>
      {children}
    </Modal>
  );
}
