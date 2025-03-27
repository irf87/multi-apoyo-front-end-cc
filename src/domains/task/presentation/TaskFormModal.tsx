'use client';

import { useEffect, useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Modal } from '@/presentation/design-system/ui/atoms/modal/Modal';
import { Button } from '@/presentation/design-system/ui/atoms/buttons/Button';
import { Input } from '@/presentation/design-system/ui/atoms/inputs/Input';
import { Select } from '@/presentation/design-system/ui/atoms/inputs/Select';
import { TaskStatus, TaskNode } from '@/domains/task/domain/TaskTypes';
import { Form, CheckboxGroup, Checkbox, ButtonGroup } from '@/domains/task/presentation/FormModalStyled';
interface TaskFormInputs {
  title: string;
  description: string;
  status: TaskStatus;
  isFavorite: boolean;
}

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormInputs) => Promise<boolean>;
  task?: TaskNode;
  mode: 'create' | 'edit';
  error?: string;
}

const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In progress',
  done: 'Done',
};

export function TaskFormModal({ open, onClose, onSubmit, task, mode, error }: TaskFormModalProps) {
  const [duplicateTitleError, setDuplicateTitleError] = useState<string | null>(null);
  const formMethods = useForm<TaskFormInputs>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      isFavorite: false,
    }
  });

  const handleSubmit = async (data: TaskFormInputs) => {
    const shouldCloseModal = await onSubmit(data);
    if (mode === 'create' && shouldCloseModal) {
      formMethods.reset({
        title: '',
        description: '',
        status: 'pending',
        isFavorite: false,
      });
    }
    if(shouldCloseModal) onClose();
  };

  useEffect(() => {
    if (task && mode === 'edit') {
      formMethods.reset({
        title: task.title,
        description: task.description,
        status: task.status,
        isFavorite: task.isFavorite,
      });
    } else {
      formMethods.reset({
        title: '',
        description: '',
        status: 'pending',
        isFavorite: false,
      });
    }
    setDuplicateTitleError(null);
  }, [task, mode, formMethods]);

  useEffect(() => {
    if (error === 'A task with this title already exists') {
      console.log('error', error);
      setDuplicateTitleError(error);
    }
  }, [error]);

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title={mode === 'create' ? 'Create New Task' : 'Edit Task'}
    >
      <FormProvider {...formMethods}>
        <Form onSubmit={formMethods.handleSubmit(handleSubmit)}>
          <Controller
            control={formMethods.control}
            name="title"
            rules={{
              required: 'Title is required',
              minLength: {
                value: 3,
                message: 'Title must be at least 3 characters',
              },
            }}
            render={({ field }) => (
              <Input
                label="Title"
                error={!!formMethods.formState.errors.title || !!duplicateTitleError}
                helperText={formMethods.formState.errors.title?.message || duplicateTitleError || undefined}
                {...field}
                fullWidth
              />
            )}
          />

          <Controller
            control={formMethods.control}
            name="description"
            rules={{
              required: 'Description is required',
              minLength: {
                value: 10,
                message: 'Description must be at least 10 characters',
              },
            }}
            render={({ field }) => (
              <Input
                label="Description"
                error={!!formMethods.formState.errors.description}
                helperText={formMethods.formState.errors.description?.message}
                {...field}
                fullWidth
              />
            )}
          />

          <Controller
            control={formMethods.control}
            name="status"
            rules={{
              required: 'Status is required',
            }}
            render={({ field }) => (
              <Select
                label="Status"
                error={!!formMethods.formState.errors.status}
                helperText={formMethods.formState.errors.status?.message}
                {...field}
                fullWidth
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            )}
          />

          <Controller
            control={formMethods.control}
            name="isFavorite"
            render={({ field: { value, onChange } }) => (
              <CheckboxGroup>
                <Checkbox
                  type="checkbox"
                  id="favorite"
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                />
                <label htmlFor="favorite">Mark as favorite</label>
              </CheckboxGroup>
            )}
          />

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!formMethods.formState.isValid}
            >
              {mode === 'create' ? 'Create Task' : 'Update Task'}
            </Button>
          </ButtonGroup>
        </Form>
      </FormProvider>
    </Modal>
  );
} 