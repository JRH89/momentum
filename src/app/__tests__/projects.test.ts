import { createProject, updateProject, deleteProject, getProject } from '@/lib/projects';
import { createInvoice, sendInvoice, getInvoice } from '@/lib/invoices';
import db from '@/lib/db';

// Mock the database client
jest.mock('@/lib/db', () => ({
  project: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  invoice: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
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
    (db.project.create as jest.Mock).mockResolvedValueOnce(testProject);

    const result = await createProject({
      name: testProject.name,
      description: testProject.description,
      customerId: testProject.customerId,
    });

    expect(db.project.create).toHaveBeenCalledWith({
      data: {
        name: testProject.name,
        description: testProject.description,
        customerId: testProject.customerId,
      },
    });
    
    expect(result).toEqual(testProject);
  });

  it('should update a project', async () => {
    const updatedData = { name: 'Updated Project', status: 'completed' };
    const updatedProject = { ...testProject, ...updatedData };
    
    (db.project.update as jest.Mock).mockResolvedValueOnce(updatedProject);

    const result = await updateProject(testProject.id, updatedData);

    expect(db.project.update).toHaveBeenCalledWith({
      where: { id: testProject.id },
      data: updatedData,
    });
    
    expect(result).toEqual(updatedProject);
  });

  it('should delete a project', async () => {
    (db.project.delete as jest.Mock).mockResolvedValueOnce(testProject);

    const result = await deleteProject(testProject.id);

    expect(db.project.delete).toHaveBeenCalledWith({
      where: { id: testProject.id },
    });
    
    expect(result).toEqual(testProject);
  });

  it('should get a project by id', async () => {
    (db.project.findUnique as jest.Mock).mockResolvedValueOnce(testProject);

    const result = await getProject(testProject.id);

    expect(db.project.findUnique).toHaveBeenCalledWith({
      where: { id: testProject.id },
    });
    
    expect(result).toEqual(testProject);
  });
});

describe('Invoice Management', () => {
  const testInvoice = {
    id: 'inv_test123',
    projectId: 'proj_test123',
    amount: 1000,
    status: 'draft' as const,
    dueDate: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new invoice', async () => {
    (db.invoice.create as jest.Mock).mockResolvedValueOnce(testInvoice);

    const result = await createInvoice({
      projectId: testInvoice.projectId,
      amount: testInvoice.amount,
      dueDate: testInvoice.dueDate,
    });

    expect(db.invoice.create).toHaveBeenCalledWith({
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
    const sentInvoice = { 
      ...testInvoice, 
      status: 'sent',
      sentAt: new Date().toISOString() 
    };
    
    (db.invoice.update as jest.Mock).mockResolvedValueOnce(sentInvoice);

    const result = await sendInvoice(testInvoice.id);

    expect(db.invoice.update).toHaveBeenCalledWith({
      where: { id: testInvoice.id },
      data: { 
        status: 'sent',
        sentAt: expect.any(Date),
      },
    });
    
    expect(result).toEqual(sentInvoice);
  });

  it('should get an invoice by id', async () => {
    (db.invoice.findUnique as jest.Mock).mockResolvedValueOnce(testInvoice);

    const result = await getInvoice(testInvoice.id);

    expect(db.invoice.findUnique).toHaveBeenCalledWith({
      where: { id: testInvoice.id },
    });
    
    expect(result).toEqual(testInvoice);
  });
});
