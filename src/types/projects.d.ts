declare module '@/lib/projects' {
  export function createProject(project: { name: string; description: string; customerId: string }): Promise<any>;
  export function updateProject(id: string, updates: any): Promise<any>;
  export function deleteProject(id: string): Promise<void>;
  export function getProject(id: string): Promise<any>;
}
