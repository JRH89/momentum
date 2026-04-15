import { NextResponse, NextRequest } from 'next/server';
import * as invoices from '@/lib/invoices';

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get('projectId');
  
  if (!projectId) {
    return NextResponse.json(
      { error: 'Project ID is required' },
      { status: 400 }
    );
  }

  try {
    const invoiceList = await invoices.getInvoicesByProject(projectId);
    return NextResponse.json(invoiceList);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newInvoice = await invoices.createInvoice({
      projectId: data.projectId,
      amount: data.amount,
      dueDate: data.dueDate,
    });
    
    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
