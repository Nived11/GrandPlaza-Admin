import * as XLSX from 'xlsx';
import { AdminOrder } from '@/features/orders/types/orderTypes';

/**
 * Utility to calculate optimal column widths for Excel sheets
 */
function calculateColumnWidths(data: Record<string, any>[]): { wch: number }[] {
  if (!data || data.length === 0) return [];
  const keys = Object.keys(data[0]);
  return keys.map((key) => {
    let maxLen = key.length;
    data.forEach((row) => {
      const val = row[key];
      if (val !== undefined && val !== null) {
        const strVal = String(val);
        if (strVal.length > maxLen) {
          maxLen = Math.min(strVal.length, 60); // Cap width at 60 chars
        }
      }
    });
    return { wch: Math.max(maxLen + 3, 12) }; // Minimum 12 char width + padding
  });
}

/**
 * 1. Export Food Orders to Excel (.xlsx)
 */
export function exportOrdersToExcel(
  orders: AdminOrder[],
  customFilename?: string
): void {
  if (!orders || orders.length === 0) {
    throw new Error('No orders available to export.');
  }

  const rows = orders.map((order) => {
    const createdDate = new Date(order.created_at);
    const dateFormatted = !isNaN(createdDate.getTime())
      ? createdDate.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '';
    const timeFormatted = !isNaN(createdDate.getTime())
      ? createdDate.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      : '';

    const packedDate = order.packed_at ? new Date(order.packed_at) : null;
    const packedFormatted =
      packedDate && !isNaN(packedDate.getTime())
        ? `${packedDate.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
          })} ${packedDate.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}`
        : 'Not Packed Yet';

    // Format items list: e.g. "2x Chicken Biryani (Full), 1x Lime Juice"
    const itemsDescription = (order.items || [])
      .map(
        (item) =>
          `${item.quantity}x ${item.item_name}${
            item.variant_name ? ` (${item.variant_name})` : ''
          }`
      )
      .join(', ');

    return {
      'Order ID': `#${order.id}`,
      'Order Date': dateFormatted,
      'Order Placed Time': timeFormatted,
      'Customer Name': order.customer_name || 'Guest',
      'Customer Phone': order.customer_phone || '-',
      'Delivery Address': order.delivery_address || 'Takeaway / In-Store',
      'Items Ordered': itemsDescription || '-',
      'Total Items': (order.items || []).reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      ),
      'Total Amount (₹)': parseFloat(order.total_price || '0').toFixed(2),
      'Order Status': (order.status || '').toUpperCase(),
      'Payment Status':
        order.payment_status === 'completed' ? 'PAID' : 'COD (PENDING)',
      'Payment Method': order.payment_method || 'Online / Cash',
      'Special Instructions': order.special_instructions || 'None',
      'Food Packed Time': packedFormatted,
      'Prep Duration (Mins)':
        order.packing_duration_mins != null
          ? `${order.packing_duration_mins} mins`
          : '-',
      'Delivery Partner': order.delivery_boy?.name
        ? `${order.delivery_boy.name} (${order.delivery_boy.phone})`
        : 'Unassigned',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet['!cols'] = calculateColumnWidths(rows);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders Details');

  const todayStr = new Date().toISOString().split('T')[0];
  const filename = customFilename || `GrandPlaza_Orders_${todayStr}.xlsx`;

  XLSX.writeFile(workbook, filename);
}

/**
 * 2. Export Table Bookings / Reservations to Excel (.xlsx)
 */
export function exportBookingsToExcel(
  bookings: any[],
  customFilename?: string
): void {
  if (!bookings || bookings.length === 0) {
    throw new Error('No table bookings available to export.');
  }

  const rows = bookings.map((b) => {
    const bookedCreated = b.created_at ? new Date(b.created_at) : null;
    const bookedOn =
      bookedCreated && !isNaN(bookedCreated.getTime())
        ? `${bookedCreated.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })} ${bookedCreated.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}`
        : '-';

    return {
      'Booking ID': `#${b.id}`,
      'Guest Name': b.customer_name || 'Guest',
      'Phone Number': b.phone_number || '-',
      'Email': b.email || '-',
      'Guests Count': b.number_of_guests || 1,
      'Reservation Date': b.booking_date || '-',
      'Reservation Time': b.booking_time || '-',
      'Status': (b.status || 'PENDING').toUpperCase(),
      'Special Requests': b.special_request || 'None',
      'Booked On': bookedOn,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet['!cols'] = calculateColumnWidths(rows);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Reservations');

  const todayStr = new Date().toISOString().split('T')[0];
  const filename =
    customFilename || `GrandPlaza_Table_Reservations_${todayStr}.xlsx`;

  XLSX.writeFile(workbook, filename);
}

/**
 * 3. Export Customers to Excel (.xlsx)
 */
export function exportCustomersToExcel(
  customers: any[],
  customFilename?: string
): void {
  if (!customers || customers.length === 0) {
    throw new Error('No customer records available to export.');
  }

  const rows = customers.map((c) => ({
    'Customer ID': `#${c.id}`,
    'Name': `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.username || 'Customer',
    'Phone Number': c.phone_number || '-',
    'Email': c.email || '-',
    'Delivery Address': c.address || '-',
    'Customer Badge': c.customer_badge || 'REGULAR',
    'Total Orders': c.total_orders || 0,
    'Total Spent (₹)': Number(c.total_spent || 0).toFixed(2),
    'Account Status': c.is_active !== false ? 'Active' : 'Blocked',
    'Last Order Date': c.last_order_date || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet['!cols'] = calculateColumnWidths(rows);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers List');

  const todayStr = new Date().toISOString().split('T')[0];
  const filename = customFilename || `GrandPlaza_Customers_${todayStr}.xlsx`;

  XLSX.writeFile(workbook, filename);
}

/**
 * 4. Master All-in-One Multi-Sheet Excel Workbook Export
 * Exports Orders, Table Reservations, and Customers into a single .xlsx file!
 */
export function exportMasterWorkbookToExcel(params: {
  orders?: AdminOrder[];
  bookings?: any[];
  customers?: any[];
  filename?: string;
}): void {
  const { orders = [], bookings = [], customers = [], filename } = params;

  if (orders.length === 0 && bookings.length === 0 && customers.length === 0) {
    throw new Error('No data found to export.');
  }

  const workbook = XLSX.utils.book_new();

  // 1. Orders Sheet
  if (orders.length > 0) {
    const orderRows = orders.map((order) => {
      const createdDate = new Date(order.created_at);
      const dateFormatted = !isNaN(createdDate.getTime())
        ? createdDate.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : '';
      const timeFormatted = !isNaN(createdDate.getTime())
        ? createdDate.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
        : '';

      const itemsDescription = (order.items || [])
        .map(
          (item) =>
            `${item.quantity}x ${item.item_name}${
              item.variant_name ? ` (${item.variant_name})` : ''
            }`
        )
        .join(', ');

      return {
        'Order ID': `#${order.id}`,
        'Order Date': dateFormatted,
        'Placed Time': timeFormatted,
        'Customer Name': order.customer_name || 'Guest',
        'Customer Phone': order.customer_phone || '-',
        'Delivery Address': order.delivery_address || 'Takeaway',
        'Items Ordered': itemsDescription || '-',
        'Total Items': (order.items || []).reduce(
          (sum, item) => sum + (item.quantity || 1),
          0
        ),
        'Total Amount (₹)': parseFloat(order.total_price || '0').toFixed(2),
        'Order Status': (order.status || '').toUpperCase(),
        'Payment Status':
          order.payment_status === 'completed' ? 'PAID' : 'COD (PENDING)',
        'Payment Method': order.payment_method || 'Online / Cash',
        'Special Instructions': order.special_instructions || 'None',
        'Food Packed Time': order.packed_at
          ? new Date(order.packed_at).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
          : '-',
        'Prep Duration (Mins)':
          order.packing_duration_mins != null
            ? `${order.packing_duration_mins}m`
            : '-',
        'Delivery Partner': order.delivery_boy?.name || 'Unassigned',
      };
    });

    const orderSheet = XLSX.utils.json_to_sheet(orderRows);
    orderSheet['!cols'] = calculateColumnWidths(orderRows);
    XLSX.utils.book_append_sheet(workbook, orderSheet, 'Orders Details');
  }

  // 2. Table Reservations Sheet
  if (bookings.length > 0) {
    const bookingRows = bookings.map((b) => ({
      'Booking ID': `#${b.id}`,
      'Guest Name': b.customer_name || 'Guest',
      'Phone Number': b.phone_number || '-',
      'Email': b.email || '-',
      'Guests Count': b.number_of_guests || 1,
      'Reservation Date': b.booking_date || '-',
      'Reservation Time': b.booking_time || '-',
      'Status': (b.status || 'PENDING').toUpperCase(),
      'Special Requests': b.special_request || 'None',
      'Booked On': b.created_at
        ? new Date(b.created_at).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : '-',
    }));

    const bookingSheet = XLSX.utils.json_to_sheet(bookingRows);
    bookingSheet['!cols'] = calculateColumnWidths(bookingRows);
    XLSX.utils.book_append_sheet(workbook, bookingSheet, 'Table Reservations');
  }

  // 3. Customers Sheet
  if (customers.length > 0) {
    const customerRows = customers.map((c) => ({
      'Customer ID': `#${c.id}`,
      'Name': `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.username || 'Customer',
      'Phone Number': c.phone_number || '-',
      'Email': c.email || '-',
      'Address': c.address || '-',
      'Badge': c.customer_badge || 'REGULAR',
      'Total Orders': c.total_orders || 0,
      'Total Spent (₹)': Number(c.total_spent || 0).toFixed(2),
      'Account Status': c.is_active !== false ? 'Active' : 'Blocked',
    }));

    const customerSheet = XLSX.utils.json_to_sheet(customerRows);
    customerSheet['!cols'] = calculateColumnWidths(customerRows);
    XLSX.utils.book_append_sheet(workbook, customerSheet, 'Customers');
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const finalFilename =
    filename || `GrandPlaza_Master_Export_${todayStr}.xlsx`;

  XLSX.writeFile(workbook, finalFilename);
}
