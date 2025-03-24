'use client';

import { Container } from '@/presentation/design-system/ui/atoms/layouts/Container';
import { TaskBoard } from '@/domains/task/ui/TaskBoard';
import { Button } from '@/presentation/design-system/ui/atoms/buttons/Button';

export function TaskManager() {
  

  return (
    <Container>
       <div className="flex justify-end mb-4" style={{ justifyContent: 'flex-end' }}>
         <Button variant="primary">
           Agregar
         </Button>
       </div>
       <TaskBoard />
    </Container>
  );
}
