import { createProject, updateProject, deleteProject, getProject } from '@/lib/projects';
import { createInvoice, sendInvoice, getInvoice } from '@/lib/invoices';

// Mock the database client
jest.mock('@/lib/db', () => ({
  project: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
  },
  invoice: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
  },
}));

describe('Project Management', () => {
  const testProject = {
    id: 'proj_test123',
    name: 'Test Project',
    description: 'A test project',
    status: 'active',
    customerId: 'cus_test123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new project', async () => {
    const { project } = require('@/lib/db');
    project.create.mockResolvedValueOnce(testProject);

    const result = await createProject({
      name: testProject.name,
      description: testProject.description,
      customerId: testProject.customerId,
    });

    expect(project.create).toHaveBeenCalledWith({
      data: {
        name: testProject.name,
        description: testProject.description,
        customerId: testProject.customerId,
      },
    });
    
    expect(result).toEqual(testProject);
  });

  it('should update an existing project', async () => {
    const { project } = require('@/lib/db');
    const updatedProject = { ...testProject, status: 'completed' };
    
    project.update.mockResolvedValueOnce(updatedProject);

    const result = await updateProject(testProject.id, { status: 'completed' });

    expect(project.update).toHaveBeenCalledWith({
      where: { id: testProject.id },
      data: { status: 'completed' },
    });
    
    expect(result).toEqual(updatedProject);
  });
});

describe('Invoice Management', () => {
  const testInvoice = {
    id: 'inv_test123',
    projectId: 'proj_test123',
    amount: 1000,
    status: 'draft',
    dueDate: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new invoice', async () => {
    const { invoice } = require('@/lib/db');
    invoice.create.mockResolvedValueOnce(testInvoice);

    const result = await createInvoice({
      projectId: testInvoice.projectId,
      amount: testInvoice.amount,
      dueDate: testInvoice.dueDate,
    });

    expect(invoice.create).toHaveBeenCalledWith({
      data: {
        projectId: testInvoice.projectId,
        amount: testInvoice.amount,
        dueDate: testInvoice.dueDate,
        status: 'draft',
      },
    });
    
    expect(result).toEqual(testInvoice);
  });

  it('should send an invoice', async () => {
    const { invoice } = require('@/lib/db');
    const sentInvoice = { ...testInvoice, status: 'sent' };
    
    invoice.update.mockResolvedValueOnce(sentInvoice);

    const result = await sendInvoice(testInvoice.id);

    expect(invoice.update).toHaveBeenCalledWith({
      where: { id: testInvoice.id },
      data: { 
        status: 'sent',
        sentAt: expect.any(Date),
      },
    });
    
    expect(result).toEqual(sentInvoice);
  });
});
